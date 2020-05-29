<script>
    export let Classroom;
    export let showToolbox = false;
    export let UserCurrent;

    import {
        SettingsBrush,
        SettingsEraser,
        SettingsShapes,
        SelectedNode,
        SettingsText
    } from './modes/settings.js';

    import {onMount, tick} from 'svelte';
    import axios from 'axios';
    import Konva from 'konva';
    import _ from 'underscore';
    import {XIcon} from 'svelte-feather-icons';
    import {genId} from './util.js';

    import ToolBox from './ToolBox.svelte';

    let Stage, StageWidth, StageHeight, Tabs = [], TabCounter = 0;
    let currentLayer = null, container, wrapper, mode, _lastNode, _isPaint = false;

    const LaravelEcho = window.Echo;
    const Channel = `classroom.${Classroom.id}.board`;

    function saveAndTransmit(event, params)
    {
        if (UserCurrent.user_type == 'teacher') {
            LaravelEcho.private(Channel).whisper('draw', {
                event,
                params
            });

            save();
        }
    }

    const save = _.debounce(async () => {
        try {
            await axios.post('./classroom/drawstate', {
                id: Classroom.id,
                mode: 'save',
                data: {
                    Stage: Stage.toJSON(),
                    Tabs,
                    StageWidth,
                    StageHeight,
                    CurrentLayer: currentLayer
                }
            });
        } catch (e) {
            // error saving
        }
    }, 100);

    let isBuildingCanvas = true;

    function shapeShifter(node, updateAttrs = false)
    {
        const pos = getScaleBasedPointer(),
            nodePos = {
                x: node.x(),
                y: node.y()
            },
            newRadius = {
                x: Math.abs(pos.x - nodePos.x),
                y: Math.abs(pos.y - nodePos.y)
            };

        if (node.hasName('quadrilateral')) {
            if (updateAttrs) {
                node.width(pos.x - nodePos.x);
                node.height(pos.y - nodePos.y);


            }
        } else if (node.hasName('triangle')) {
            if (updateAttrs) {
                node.radius(newRadius.x);
            }
        } else if (node.hasName('star')) {
            if (updateAttrs) {
                node.setAttr('innerRadius', newRadius.x * .7);
                node.setAttr('outerRadius', newRadius.x * 2);
            }
        } else if (node.hasName('ellipse')) {
            if (updateAttrs) {
                node.radiusX(newRadius.x);
                node.radiusY(newRadius.y);
            }
        }

        saveAndTransmit('node_update', {
            id: node.id(),
            attrs: {
                x: node.x(),
                y: node.y(),
                scaleX: node.scaleX(),
                scaleY: node.scaleY()
            }
        });
        Stage.batchDraw();
    }

    function eventShapeTransformStart(e)
    {
        shapeShifter(e.currentTarget);
    }

    function eventShapeTransform(e)
    {
        shapeShifter(e.currentTarget);
    }

    function eventShapeTransformEnd(e)
    {
        shapeShifter(e.currentTarget);
    }

    function eventShapeDragMove(e)
    {
        const node = e.currentTarget;

        saveAndTransmit('node_update', {
            id: node.id(),
            attrs: {
                x: node.x(),
                y: node.y()
            }
        });
    }

    onMount(async () => {
        const drawstateFetch = await axios.post('./classroom/drawstate', {
            id: Classroom.id,
            mode: 'fetch'
        });
        const drawstate = await drawstateFetch.data;
        isBuildingCanvas = false;

        await tick();

        if (drawstate.data) {
            Stage = Konva.Node.create(drawstate.data.Stage, container);

            updateStageWH();

            setStageW(drawstate.data.StageWidth);
            setStageH(drawstate.data.StageHeight);

            if (drawstate.data.CurrentLayer) {
                currentLayer = drawstate.data.CurrentLayer;
            } else {
                currentLayer = 'main';
            }

            Tabs = drawstate.data.Tabs;
            TabCounter = Tabs.length;

            let images = [];
            Stage.find('Image').each((node) => {
                images.push(node.id());
            });

            const imageURLfetcher = await axios.post('./board/get-images-url', {
                node_ids: images
            });

            let imgDefs = imageURLfetcher.data;
            const createImageObj = () => {

            };
            imgDefs.forEach((def) => {
                const imgObj = new Image();
                imgObj.onload = () => {
                    Stage.find(`#${def.node}`).image(imgObj);
                    Stage.draw();
                };
                imgObj.src = def.src;
            });

            if (UserCurrent.user_type == 'teacher') {
                Stage.find('.shapes').each((node) => {
                    node.on('transformstart', eventShapeTransformStart);
                    node.on('transform', eventShapeTransform);
                    node.on('transformend', eventShapeTransformEnd);
                    node.on('dragmove', eventShapeDragMove);
                });

                Stage.find('.texts').each((node) => {
                    node.on('dblclick', nodeTextDbclickEvent);
                    node.on('dragstart', nodeTextDragStartEndEvent);
                    node.on('dragend', nodeTextDragStartEndEvent);
                });
            }

            if (UserCurrent.user_type == 'student') {
                Stage.find('.shapes').each((node) => {
                    node.draggable(false);
                });

                Stage.find('.texts').each((node) => {
                    node.draggable(false);
                });
            }
        } else {
            updateStageWH();

            Stage = new Konva.Stage({
                container: 'board-container',
                width: StageWidth,
                height: StageHeight
            });
        }
        if (!Stage.find('Layer').length) {
            addLayer('main', true);
        }

        if (UserCurrent.user_type == 'teacher') {
            Stage.on('click', (e) => {
                if (mode == 'select') {
                    if (e.target == Stage || !e.target.hasName('shapes')) {
                        Stage.find('Transformer').destroy();
                        Stage.draw();
                        SelectedNode.update((node) => {
                            node = null;
                            return node;
                        });
                        return;
                    }

                    SelectedNode.update((node) => {
                        node = e.target;
                        return node;
                    });
                }

                if (mode == 'text' && isTextInputEditing == false) {
                    if (e.currentTarget == Stage) {
                        showTextEditor();
                    }
                }
            });

            const resetWheelCursor = _.debounce(() => {
                Stage.container().style.cursor = 'default';
            }, 1000);

            const scaleBy = 1.01;
            Stage.on('wheel', (e) => {
                e.evt.preventDefault();

                if (mode === 'zoom' && e.evt.shiftKey === true) {
                    if (e.evt.deltaY > 0) {
                        Stage.container().style.cursor = 'url(./img/zoom-add.png), auto';
                    } else {
                        Stage.container().style.cursor = 'url(./img/zoom-sub.png), auto';
                    }

                    resetWheelCursor.apply();

                    const oldScale = Stage.scaleX();
                    const pointer = Stage.getPointerPosition();

                    const mousePointTo = {
                        x: (pointer.x - Stage.x()) / oldScale,
                        y: (pointer.y - Stage.y()) / oldScale,
                    };

                    const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

                    Stage.scale({ x: newScale, y: newScale });

                    const newPos = {
                        x: pointer.x - mousePointTo.x * newScale,
                        y: pointer.y - mousePointTo.y * newScale,
                    };

                    Stage.position(newPos);
                    Stage.batchDraw();

                    saveAndTransmit('zoom', {
                        scale: Stage.scale(),
                        position: Stage.position()
                    });
                }
            });

            Stage.on('mousedown touchstart', (e) => {
                if (mode == 'brush' || mode == 'eraser') {
                    Stage.find('Transformer').destroy();

                    _isPaint = true;

                    const mousePointTo = getScaleBasedPointer();

                    const strokeWidth = mode == 'brush' ? $SettingsBrush.thickness : $SettingsEraser.thickness,
                        stroke = mode == 'brush' ? $SettingsBrush.color : '#000';

                    _lastNode = new Konva.Line({
                        stroke,
                        strokeWidth,
                        lineJoin: 'round',
                        lineCap: 'round',
                        globalCompositeOperation: (mode == 'brush' ? 'source-over' : 'destination-out'),
                        points: [mousePointTo.x, mousePointTo.y],
                        name: 'lines',
                        id: genNodeId()
                    });

                    if (mode == 'brush') {
                        _lastNode.opacity($SettingsBrush.opacity);
                    }

                    getLayer(currentLayer).add(_lastNode);

                    saveAndTransmit('node_add', {
                        node: _lastNode.toJSON(),
                        layer: currentLayer
                    });
                } else if (mode == 'shapes' && $SettingsShapes.shape != null) {
                    _isPaint = true;

                    switch ($SettingsShapes.shape) {
                        case 'quadrilateral':
                            _lastNode = new Konva.Rect({
                                name: 'quadrilateral'
                            });
                        break;

                        case 'triangle':
                            _lastNode = new Konva.RegularPolygon({
                                sides: 3,
                                name: 'triangle'
                            });
                        break;

                        case 'star':
                            _lastNode = new Konva.Star({
                                numPoints: 5,
                                name: 'star'
                            });
                        break;

                        case 'ellipse':
                            _lastNode = new Konva.Ellipse({
                                name: 'ellipse'
                            });
                        break;
                    }

                    _lastNode.id(genNodeId());
                    _lastNode.fillEnabled(!$SettingsShapes.fill.transparent);

                    if (!$SettingsShapes.fill.transparent) {
                        _lastNode.fill($SettingsShapes.fill.color);
                        _lastNode.opacity($SettingsShapes.fill.opacity);
                    } else {
                        _lastNode.fill(null);
                    }

                    _lastNode.strokeEnabled($SettingsShapes.border.enabled)

                    if ($SettingsShapes.border.enabled) {
                        _lastNode.strokeWidth(4);
                        _lastNode.stroke($SettingsShapes.border.color);
                    }

                    const pos = getScaleBasedPointer();
                    _lastNode.draggable(true);
                    _lastNode.addName('shapes');
                    _lastNode.x(pos.x);
                    _lastNode.y(pos.y);

                    _lastNode.on('transformstart', eventShapeTransformStart);
                    _lastNode.on('transform', eventShapeTransform);
                    _lastNode.on('transformend', eventShapeTransformEnd);
                    _lastNode.on('dragmove', eventShapeDragMove);

                    getLayer(currentLayer).add(_lastNode);

                    SelectedNode.update((node) => {
                        node = _lastNode;
                        return node;
                    });

                    saveAndTransmit('node_add', {
                        node: _lastNode.toJSON(),
                        layer: currentLayer
                    });
                }
            });

            Stage.on('mouseup touchend', (e) => {
                if (mode == 'brush' || mode == 'eraser' || mode == 'shapes') {
                    _isPaint = false;

                    saveAndTransmit('node_update', {
                        id: _lastNode.id(),
                        attrs: _lastNode.getAttrs()
                    });

                    if (mode == 'shapes' && $SettingsShapes.shape) {
                        SelectedNode.update((node) => {
                            node = _lastNode;
                            return node;
                        });

                        mode = 'select';
                    }
                }
            });

            Stage.on('mousemove touchmove', (e) => {
                if (mode == 'brush' || mode == 'eraser') {
                    if (!_isPaint) {
                        return;
                    }

                    const mousePointTo = getScaleBasedPointer();
                    const newPoints = _lastNode.points().concat([mousePointTo.x, mousePointTo.y]);

                    _lastNode.points(newPoints);

                    getLayer(currentLayer).batchDraw();

                    saveAndTransmit('node_update', {
                        id: _lastNode.id(),
                        attrs: {
                            points: newPoints
                        }
                    });
                } else if (mode == 'shapes') {
                    if (!_isPaint) {
                        return;
                    }

                    shapeShifter(_lastNode, true);
                }
            });
        }
    });



    let fontSize, fontColor, fontFace, textInput, isTextInputEditing = false;

    $: fontSize = $SettingsText.font.size;
    $: fontColor = $SettingsText.font.color;
    $: fontFace = $SettingsText.font.face;

    $: if (typeof textInput !== 'undefined') {
        textInput.style.color = fontColor;
        textInput.style.fontFamily = fontFace;
        textInput.style.fontSize = fontSize +'px';
    }

    function createTextInputNode()
    {
        if (typeof textInput === 'undefined') {
            textInput = document.createElement('input');
            textInput.type = 'text';
            textInput.classList.add('board-texteditor');
            textInput.classList.add('d-none');
            textInput.style.left = '-1000px';
            textInput.style.top = '-1000px';
            document.body.appendChild(textInput);

            textInput.addEventListener('keydown', (e) => {
                const KEY_ESC = 27, KEY_ENTER = 13, KEY_DELETE = 46;

                if (e.keyCode === KEY_ESC) {
                    textInput.classList.remove('d-block');
                    textInput.classList.add('d-none');
                    textInput.value = '';
                }

                let node = null;
                if (textInput.getAttribute('data-node-id')) {
                    node = Stage.find(`#${textInput.getAttribute('data-node-id')}`);
                }

                if (e.keyCode == KEY_DELETE && node !== null) {
                    const node_id = node[0].attrs.id;
                    node.destroy();
                    Stage.batchDraw();

                    textInput.classList.remove('d-block');
                    textInput.classList.add('d-none');

                    mode = 'select';
                    isTextInputEditing = false;

                    saveAndTransmit('node_delete', {
                        node: node_id
                    });
                }

                if (e.keyCode === KEY_ENTER) {
                    if (node === null) {
                        const newNode = new Konva.Text({
                            text: textInput.value,
                            x: parseFloat(textInput.getAttribute('data-px')),
                            y: parseFloat(textInput.getAttribute('data-py')),
                            fontFamily: fontFace,
                            fontSize: fontSize,
                            fill: fontColor,
                            draggable: true,
                            name: 'texts',
                            id: genNodeId()
                        });

                        newNode.on('dblclick', nodeTextDbclickEvent);
                        newNode.on('dragstart', nodeTextDragStartEndEvent);
                        newNode.on('dragend', nodeTextDragStartEndEvent);
                        getLayer(currentLayer).add(newNode);
                        textInput.value = '';

                        saveAndTransmit('node_add', {
                            node: newNode.toJSON(),
                            layer: currentLayer
                        });
                    } else {
                        node.fontFamily(fontFace);
                        node.fill(fontColor);
                        node.fontSize(fontSize);
                        node.text(textInput.value);
                        node.visible(true);

                        saveAndTransmit('node_update', {
                            id: node[0].attrs.id,
                            attrs: {
                                fontFamily: fontFace,
                                fill: fontColor,
                                fontSize: fontSize,
                                text: textInput.value
                            }
                        });
                    }

                    Stage.batchDraw();

                    textInput.classList.remove('d-block');
                    textInput.classList.add('d-none');

                    mode = 'select';
                    isTextInputEditing = false;
                }
            });
        }
    }
    function nodeTextDragStartEndEvent(evt)
    {
        const node = evt.currentTarget;

        saveAndTransmit('node_update', {
            id: node.id(),
            attrs: {
                x: node.x(),
                y: node.y()
            }
        });
    }

    function nodeTextDbclickEvent(evt)
    {
        createTextInputNode();
        textInput.value = evt.currentTarget.attrs.text;
        showTextEditor(evt.currentTarget);

        mode = 'text';
    }

    function showTextEditor(node = null)
    {
        createTextInputNode();

        const pointer = getScaleBasedPointer();
        const stageBox = Stage.container().getBoundingClientRect();

        textInput.classList.add('d-block');

        textInput.style.left = node === null ? (stageBox.x + pointer.x) +'px' : (stageBox.x + node.attrs.x) +'px';
        textInput.style.top = node === null ? (stageBox.y + pointer.y) +'px' : (stageBox.y + node.attrs.y) +'px';

        textInput.setAttribute('data-px', pointer.x);
        textInput.setAttribute('data-py', pointer.y);

        textInput.focus();

        if (node !== null) {
            node.visible(false);
            Stage.draw();

            textInput.setAttribute('data-node-id', node.id());
        } else {
            textInput.removeAttribute('data-node-id');
            textInput.value = '';
        }

        isTextInputEditing = true;
    }

    $: if ($SelectedNode != null) {
        Stage.find('Transformer').destroy();
        const transformer = new Konva.Transformer();
        const layer = $SelectedNode.getLayer();

        layer.add(transformer);
        transformer.attachTo($SelectedNode);
        layer.draw();
    }

    $: if (currentLayer != null) {
        saveAndTransmit('current_layer', {
            layer: currentLayer
        });
    }

    $: if (typeof Stage != 'undefined') {
        Stage.width(StageWidth);
        Stage.height(StageHeight);

        saveAndTransmit('stage_dimension', {
            width: StageWidth,
            height: StageHeight
        });

        Stage.find('.shapes').draggable(mode != 'eraser' && mode != 'brush');

        /**
         * @TODO cache the cursor icons using `new Image()`
         */
        if (mode == 'shapes') {
            Stage.container().style.cursor = 'crosshair';
        } else if (mode == 'brush' && !_isPaint) {
            Stage.container().style.cursor = 'url(./img/brush.png), auto';
        } else if (mode == 'brush' && _isPaint) {
            Stage.container().style.cursor = 'url(./img/brush-click.png), auto';
        } else if (mode == 'eraser' && !_isPaint) {
            Stage.container().style.cursor = 'url(./img/eraser.png) 11 11, auto';
        } else if (mode == 'eraser' && _isPaint) {
            Stage.container().style.cursor = 'url(./img/eraser-click.png) 11 11, auto';
        } else if (mode == 'text') {
            Stage.container().style.cursor = 'text';
        } else {
            Stage.container().style.cursor = 'default';
        }
    }

    function getScaleBasedPointer()
    {
        const oldScale = Stage.scaleX();
        const pointer = Stage.getPointerPosition();

        return {
            x: (pointer.x - Stage.x()) / oldScale,
            y: (pointer.y - Stage.y()) / oldScale,
        };
    }

    function updateStageWH()
    {
        setStageW(parseInt(wrapper.parentNode.offsetWidth) - 70);
        setStageH(window.innerHeight - 70 - parseInt(getComputedStyle(wrapper).marginTop));
    }

    function getLayer(id)
    {
        const layer = Stage.find('#'+ id);
        return layer.length > 0 ? layer : null;
    }

    function showLayer(id)
    {
        const layer = Stage.find('Layer');
        let current;
        layer.each((node) => {
            if (node.id() === id) {
                currentLayer = id;
                current = node;
                node.show();
            } else {
                node.hide();
            }
        });

        const img = current.find('Image');

        if (!img.length) {
            updateStageWH();
        } else {
            img.each((node) => {
                setStageW(node.width());
                setStageH(node.height());
            });
        }

        zoomReset(false);
        Stage.draw();
    }

    function addTab(id)
    {
        Tabs = [...Tabs, {
            label: id == 'main' ? 'Main' : 'Layer '+ TabCounter,
            id
        }];
        TabCounter += 1;
    }

    function deleteTab(id)
    {
        const tabIndex = _.findIndex(Tabs, {
            id
        });

        Stage.find(`#${id}`).destroy();

        if (tabIndex > -1) {
            Tabs.splice(tabIndex, 1);
            Tabs = Tabs;
        }

        showLayer(_.last(Tabs).id);
    }

    function addLayer(id, show = false)
    {
        const nodeId = typeof id == 'string' ? id : genNodeId();
        const newLayer = new Konva.Layer({
            id: nodeId
        });

        Stage.add(newLayer);

        addTab(nodeId);

        if (show) {
            showLayer(nodeId);
        }

        saveAndTransmit('layer_add', {
            id: nodeId,
            show
        });
    }

    function clearLayer()
    {
        let destroyedLines = [];
        getLayer(currentLayer).each((node) => {
            node.find('Line').each((line) => {
                destroyedLines.push(line.id());
                line.destroy();
            });
        });

        saveAndTransmit('layer_clear', {
            id: currentLayer,
            nodes: destroyedLines
        });

        zoomReset(false);

        Stage.draw();
    }

    function genNodeId()
    {
        return Classroom.id +'_'+ genId()
    }

    function btnAddLayer()
    {
        addLayer(false, true);
    }

    function setStageW(w)
    {
        wrapper.style.width = w +'px';
        StageWidth = w;
    }

    function setStageH(h)
    {
        wrapper.style.height = h +'px';
        StageHeight = h;
    }

    let displayUploader = false;
    async function addImage(data)
    {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const layerId = genNodeId();

            img.onerror = () => {
                reject({
                    error: true
                });
            };

            img.onload = () => {
                addLayer(layerId, true);
                const node = new Konva.Image({
                    x: 0,
                    y: 0,
                    id: data.node,
                    image: img,
                    draggable: false
                });

                getLayer(layerId).add(node);

                resolve({
                    layer: layerId,
                    node,
                    src: data.image_URL
                });
            };

            img.src = data.image_URL;
        });
    }

    function addImages(images)
    {
        if (images.length) {
            images.forEach(async (data, index) => {
                try {
                    const pdata = await addImage(data.image);
                    const img = await pdata.node;

                    if (img.width() < StageWidth && img.height() < StageHeight) {
                        setStageW(img.width());
                        setStageH(img.height());
                    } else {
                        updateStageWH();

                        if (img.width() > StageWidth) {
                            const ratio = img.width() / StageWidth,
                                newW = img.width() / ratio,
                                newH = img.height() / ratio;

                            img.width(newW);
                            img.height(newH);

                            setStageW(newW);
                            setStageH(newH);
                        } else {
                            setStageW(img.width());
                            setStageH(img.height());
                        }
                    }

                    saveAndTransmit('image_add', {
                        node: img.toJSON(),
                        src: pdata.src,
                        layer: pdata.layer
                    });
                } catch (e) {
                    // error adding image
                }

                if (index == images.length - 1) {
                    displayUploader = false;
                    Stage.batchDraw();
                }
            });
        }
    }

    function deleteNode(e)
    {
        saveAndTransmit('node_delete', e.detail);
    }

    function shapeColors(e)
    {
        saveAndTransmit('node_update', e.detail);
    }

    function zoomReset(e)
    {
        Stage.scale({
            x: 1,
            y: 1
        });

        Stage.position({
            x: 0,
            y: 0
        });

        if (e !== false) {
            Stage.draw();
        }

        saveAndTransmit('zoom_reset', true);
    }

    if (UserCurrent.user_type == 'student') {
        const doDraw = {
            'node_add': (params) => {
                const node = Konva.Node.create(params.node);
                node.draggable(false);
                getLayer(params.layer).add(node);
            },

            'node_update': (params) => {
                Stage.find(`#${params.id}`).setAttrs(params.attrs);
            },

            'node_delete': (params) => {
                Stage.find(`#${params.node}`).destroy();
            },

            'stage_dimension': (params) => {
                setStageW(params.width);
                setStageH(params.height);
            },

            'current_layer': (params) => {
                showLayer(params.layer);
            },

            'layer_add': (params) => {
                addLayer(params.id, params.show);
            },

            'layer_clear': (params) => {
                Stage.find('Line').each((node) => {
                    if (params.nodes.indexOf(node.id()) > -1) {
                        node.destroy();
                    }
                });
            },

            'image_add': (params) => {
                const img = new Image();

                img.onload = () => {
                    const node = Konva.Node.create(params.node);
                    node.image(img);
                    getLayer(params.layer).add(node);

                    Stage.draw();
                };

                img.src = params.src;

            },

            'zoom_reset': () => {
                zoomReset(true);
            },

            'zoom': (params) => {
                Stage.scale(params.scale);
                Stage.position(params.position);

                Stage.batchDraw();
            }
        };

        LaravelEcho.private(Channel).listenForWhisper('draw', (draw) => {
            doDraw[draw.event](draw.params);
            Stage.draw();
        });
    }
</script>

{#if isBuildingCanvas}
    <div class="w-100 text-center mt-5">
        <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
        </div>
        <h4>Creating drawing board...</h4>
    </div>
{:else}
    <div id="tabs">
        {#each Tabs as {label, id}}
            <div class="tab" class:active={currentLayer == id} on:click={
                () => {
                    if (UserCurrent.user_type != 'student') {
                        showLayer(id)
                    }
                }
            }>
                {label}
                {#if id != 'main' && currentLayer == id && UserCurrent.user_type != 'student'}
                    <a href="javascript:;" class="remove" on:click|preventDefault={() => { deleteTab(id) }}>
                        <XIcon />
                    </a>
                {/if}
            </div>
        {/each}
    </div>

    <div id="board-wrapper" class="mb-4" bind:this={ wrapper }>
        <div id="board-container" bind:this={ container }></div>
    </div>

    {#if showToolbox}
        <ToolBox
            Classroom={Classroom}
            on:clearLayer={() => {
                clearLayer();
            }}
            on:addLayer={() => {
                addLayer(false, true);
            }}
            on:addImages={(e) => {
                addImages(e.detail);
            }}
            on:deleteNode={deleteNode}
            on:shapeColors={shapeColors}
            on:zoomReset={ zoomReset }
            bind:mode={mode}
            bind:displayUploader={displayUploader}
        />
    {/if}
{/if}
<style>
:global(.board-texteditor) {
    background: transparent;
    border-top: none;
    border-left: none;
    border-right: none;
    border-bottom: 1px solid #333;
    position: absolute;
}

#tabs {
    width: 95%;
    margin: 0 auto;
}

#tabs .tab {
    width: auto;
    font-size: 0.8rem;
    background: #bdbdbd;
    display: inline-block;
    padding: 5px 15px;
    border-bottom: 1px solid transparent;
    cursor: pointer;
    color: #fff;
}
#tabs .tab:first-child {
    border-bottom-left-radius: 10px;
}
#tabs .tab:last-child {
    border-bottom-right-radius: 10px;
}
#tabs .tab.active {
    color: #212529;
    background: #fff;
    border-bottom: 1px solid #fc4195;
}

#tabs .tab.active .remove {
    color: #fc4195;
    font-size: 0.8rem;
    display: inline-block;
    margin-left: 10px;
}

#board-wrapper {
    width: 80%;
    margin: 20px auto 0 auto;
}

#board-container {
    background: #fff;
    box-shadow: 0 7px 14px 0 rgba(59,65,94,.1), 0 3px 6px 0 rgba(0,0,0,.07);
}
</style>
