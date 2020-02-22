<script>
    export let classroom;
    export let showToolbox = false;
    export let currentLayer = null;
    export let Layers = [];

    import {
        SettingsBrush,
        SettingsEraser,
        SettingsShapes,
        SelectedNode
    } from './modes/settings.js';

    import ToolBox from './ToolBox.svelte';

    import {onMount, tick} from 'svelte';
    import Konva from 'konva';
    import _ from 'underscore';

    let Stage, StageWidth, StageHeight;

    let windowResize = _.debounce(() => {
        updateStageWH();
    }, 100);

    let container, wrapper;

    let mode;

    let _lastNode, _isPaint = false;

    onMount(() => {
        container = document.getElementById('board-container');
        wrapper = document.getElementById('board-wrapper');

        updateStageWH();

        Stage = new Konva.Stage({
            container: 'board-container',
            width: StageWidth,
            height: StageHeight
        });

        if (!Layers.length) {
            Layers.push({
                id: 'main',
                node: new Konva.Layer({
                    id: 'main'
                })
            });

            Stage.add(getLayer('main').node);
            currentLayer = 'main';
        }

        SelectedNode.subscribe((node) => {
            if (node != null) {
                Stage.find('Transformer').destroy();
                const transformer = new Konva.Transformer();
                const layer = node.getLayer();

                layer.add(transformer);
                transformer.attachTo(node);
                layer.draw();
            }
        });

        Stage.on('mousedown touchstart', (e) => {
            if (mode == 'brush' || mode == 'eraser') {
                Stage.find('Transformer').destroy();

                _isPaint = true;

                const pos = Stage.getPointerPosition(),
                      strokeWidth = mode == 'brush' ? $SettingsBrush.thickness : $SettingsEraser.thickness,
                      stroke = mode == 'brush' ? $SettingsBrush.color : '#000';

                _lastNode = new Konva.Line({
                    stroke,
                    strokeWidth,
                    lineJoin: 'round',
                    lineCap: 'round',
                    globalCompositeOperation: (mode == 'brush' ? 'source-over' : 'destination-out'),
                    points: [pos.x, pos.y],
                    name: 'lines'
                });

                if (mode == 'brush') {
                    _lastNode.opacity($SettingsBrush.opacity);
                }

                getLayer(currentLayer).node.add(_lastNode);
            } else if (mode == 'shapes' && $SettingsShapes.shape != null) {
                Stage.find('Transformer').destroy();

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

                const pos = Stage.getPointerPosition();
                _lastNode.draggable(true);
                _lastNode.addName('shapes');
                _lastNode.x(pos.x);
                _lastNode.y(pos.y);

                getLayer(currentLayer).node.add(_lastNode);

                SelectedNode.update((node) => {
                    node = _lastNode;
                    return node;
                });
            }

            if (mode == 'select') {
                if (e.target == Stage || !e.target.hasName('shapes')) {
                    Stage.find('Transformer').destroy();
                    getLayer(currentLayer).node.draw();

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
        });

        Stage.on('mouseup touchend', (e) => {
            if (mode == 'brush' || mode == 'eraser' || mode == 'shapes') {
                _isPaint = false;

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

                const pos = Stage.getPointerPosition();
                const newPoints = _lastNode.points().concat([pos.x, pos.y]);

                _lastNode.points(newPoints);
                
                getLayer(currentLayer).node.batchDraw();
            } else if (mode == 'shapes') {
                if (!_isPaint) {
                    return;
                }

                const pos = Stage.getPointerPosition(),

                    nodePos = {
                        x: _lastNode.x(),
                        y: _lastNode.y()
                    },

                    newRadius = {
                        x: Math.abs(pos.x - nodePos.x),
                        y: Math.abs(pos.y - nodePos.y)
                    };

                if ($SettingsShapes.shape == 'quadrilateral') {
                    _lastNode.width(pos.x - nodePos.x);
                    _lastNode.height(pos.y - nodePos.y);
                } else if ($SettingsShapes.shape == 'triangle') {
                    _lastNode.radius(newRadius.x);
                } else if ($SettingsShapes.shape == 'star') {
                    _lastNode.setAttr('innerRadius', newRadius.x * .7);
                    _lastNode.setAttr('outerRadius', newRadius.x * 2);
                } else if ($SettingsShapes.shape == 'ellipse') {
                    _lastNode.radiusX(newRadius.x);
                    _lastNode.radiusY(newRadius.y);
                }

                getLayer(currentLayer).node.batchDraw();
            }
        });
    });

    $: if (currentLayer != null) {
        Stage.find('Layer').each((node) => {
            if (node.id() == currentLayer) {
                node.show();
            } else {
                node.hide();
            }
        });
    }

    $: if (typeof Stage != 'undefined') {
        Stage.width(StageWidth);
        Stage.height(StageHeight);

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
        } else {
            Stage.container().style.cursor = 'default';
        }
    }

    function updateStageWH()
    {
        StageWidth = computedStageWidth();
        StageHeight = computedStageHeight();
    }

    function getLayer(id)
    {
        return Layers.find((layer) => {
            return layer.id == id;
        });
    }

    function computedStageHeight()
    {
        return window.innerHeight - 70 - parseInt(getComputedStyle(wrapper).marginTop);
    }

    function computedStageWidth()
    {
        return parseInt(getComputedStyle(container).width);
    }

    function genNodeId()
    {
        let length = 8, result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;

        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return classroom.id + '_' + result;
    }
</script>

<svelte:window on:resize={windowResize}/>

<div id="board-wrapper">
    <div id="board-container"></div>
</div>

{#if showToolbox}
    <ToolBox bind:mode={mode} />
{/if}

<style>
#board-wrapper {
    width: 80%;
    margin: 20px auto 0 auto;
}

#board-container {
    background: #fff;
    box-shadow: 0 7px 14px 0 rgba(59,65,94,.1), 0 3px 6px 0 rgba(0,0,0,.07);
}
</style>