window.UIkit = require('uikit');
window.Icons = require('uikit/dist/js/uikit-icons');
UIkit.use(Icons);


import Echo from 'laravel-echo';
window.Pusher = require('pusher-js');

import _ from 'underscore';
import Konva from 'konva';
import axios from 'axios';

import InitLoader from './classroom-v3/InitLoader';
import ComponentsBuilder from './classroom-v3/ComponentsBuilder';
import Chat from './classroom-v3/Chat';
import StageLayers from './classroom-v3/StageLayers';
import RandomQuote from './classroom-v3/RandomQuotes';

import {fetchClassroomInfo, fetchChatMessages, fetchDrawstate} from './classroom-v3/functions/fetchers';

function makeid()
{
    let length = 6, result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}


(async function () {
    const container = document.getElementById('classroom');
    const init = new InitLoader(container);

    let ClassroomInfo, Users, Components, ChatChannel, ChatHandler, Stage, Layers, LaravelEcho, PreviousDrawstate;
    let isFromPreviousDrawstate = false, UploadedImages = [], UploadCounter = 1;

    function imageShapeBound(pos)
    {
        const newPos = {x: pos.x, y: pos.y};

        if (pos.x < 0) {
            newPos.x = 0;
        }

        if (pos.y < 0) {
            newPos.y = 0;
        }

        return newPos;
    }

    function transmit(data, isDebounce = false)
    {
        if (isDebounce) {
            if (typeof window.__sendEventData === 'undefined') {
                window.__sendEventData = _.debounce((_data) => {
                    LaravelEcho.private(ChatChannel).whisper('draw', _data);
                }, 100);
            }

            window.__sendEventData(data);
        } else {
            LaravelEcho.private(ChatChannel).whisper('draw', data);
        }
    }

    function saveDrawState()
    {
        let Tabs = [];

        _.each(Components.TabGroup.Tabs, (tab, key) => {
            Tabs.push({
                id: key,
                label: tab.label
            });
        });

        let data = {
            Stage: Stage.toJSON(),
            Tabs,
            UploadCounter,
            UploadedImages,
            currentLayer: Layers.current().id(),
            currentSelectedTool: Components.ToolBox.getSelectedToolName()
        };

        return axios.post(url('/classroom/drawstate'), {
            id: window.ELOSpeakClassroomID,
            data,
            mode: 'save'
        });
    }

    async function createImageFromUploadedImages(data)
    {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.setAttribute('data-index', data.image.index);
            image.setAttribute('data-node-id', data.node_id);
            image.setAttribute('data-image-id', data.image.id);

            image.onerror = () => {
                reject(false);
            };

            image.onload = () => {
                resolve(image);
            };

            image.src = data.image.src;
        });
    }

    async function initialize()
    {
        init.start();
        
        // Fetch classroom information
        init.setSubheaderText('Fetching classroom information...');
        [ClassroomInfo, Users, ChatChannel] = await fetchClassroomInfo(window.ELOSpeakClassroomID);

        // Start building HTML elements
        init.setSubheaderText('Building components...');
        Components = new ComponentsBuilder(container, Users);

        // Start chatroom
        init.setSubheaderText('Fetching chat messages...');
        const previousChats = await fetchChatMessages(window.ELOSpeakClassroomID);

        init.setSubheaderText('Fetching previous drawstate...');
        PreviousDrawstate = await fetchDrawstate(window.ELOSpeakClassroomID);

        ChatHandler = new Chat({
            messages: previousChats,
            chatBox: Components.chatBox,
            textarea: Components.chatSendMessage,
            channel: ChatChannel,
            classroom: ClassroomInfo
        }, Users.current);

        init.setSubheaderText('Setting up chat server...');
        LaravelEcho = new Echo({
            authEndpoint : process.env.MIX_PUSHER_AUTH_ENDPOINT +'/broadcasting/auth',
            devMode: true,
            broadcaster: 'pusher',
            key: process.env.MIX_PUSHER_APP_KEY,
            cluster: process.env.MIX_PUSHER_APP_CLUSTER,
            //encrypted: true
            wsHost: window.location.hostname,
            wsPort: 6001
        });

        init.setSubheaderText('Listening to chat server...');
        LaravelEcho.private(ChatChannel).listen('NewChat', (chat) => {
            if (Users.current.user_type !== chat.from) {
                ChatHandler.display(chat.message, true);
            }
        });

        if (PreviousDrawstate != null && PreviousDrawstate.Stage.length) {
            isFromPreviousDrawstate = true;

            // Load PreviousDrawstate to Konva.Stage
            init.setSubheaderText('Loading drawing board from previous drawstate');
            Stage = Konva.Node.create(PreviousDrawstate.Stage, Components.drawingBoard);
            

            init.setSubheaderText('Setting up drawing board layers...');
            Layers = new StageLayers(Stage);

            UploadCounter = PreviousDrawstate.UploadCounter;
            UploadedImages = PreviousDrawstate.UploadedImages;

            if (PreviousDrawstate.Tabs.length) {
                init.setSubheaderText('Creating tabs...');
                PreviousDrawstate.Tabs.forEach((tab) => {
                    Components.TabGroup.add({
                        id: tab.id,
                        label: tab.label,
                        active: false
                    });
                });

                init.setSubheaderText('Creating layers...');
                Stage.getLayers().forEach((layer) => {
                    Layers.layers[layer.id()] = layer;
                });
            }

            if (UploadedImages.length) {
                init.setSubheaderText('Getting previous images...');
                UploadedImages.forEach(async (upload) => {
                    const image = await createImageFromUploadedImages(upload);
                    Stage.find(`#${image.getAttribute('data-node-id')}`)[0].image(image);
                    Stage.draw();
                });
            }

            // Use the layer id from PreviousDrawstate.currentLayer
            Layers.use(PreviousDrawstate.currentLayer);
            Components.TabGroup.get(PreviousDrawstate.currentLayer).setActive();
            Components.ToolBox.use(PreviousDrawstate.currentSelectedTool);
        } else {
            isFromPreviousDrawstate = false;

            // Start Konva.Stage
            init.setSubheaderText('Creating drawing board...');
            let dimensions = Components.drawingBoard.getBoundingClientRect();

            Stage = new Konva.Stage({
                container: Components.drawingBoard,
                width: dimensions.width,
                height: dimensions.height
            });

            init.setSubheaderText('Setting up drawing board layers...');
            Layers = new StageLayers(Stage);
        }

        init.setSubheaderText(RandomQuote);
        setTimeout(() => {
            init.end();
        }, 500);
    }

    await initialize();

    function getStageMidPoint(node)
    {
        return {
            x: (Stage.width() / 2) - (node.width() / 2),
            y: Math.abs(Components.drawingBoard.getBoundingClientRect().top) + (window.innerHeight / 2)
        }
    }

    // Mouse clicks
    const LEFT_CLICK = 0, RIGHT_CLICK = 2, CENTER_CLICK = 3;

    Components.TabGroup.bindLayers(Layers);
    Components.TabGroup.switchTransmit = (id) => {
        transmit({
            event: 'tab_switch',
            id
        });
    };

    /**
     * #main may be already initialized, so check
     */
    if (!Stage.find('#main').length) {
        /**
         * Create the first tab, which is 'main'
         */
        Components.TabGroup.add({
            id: 'main',
            label: 'Main'
        });
    }

    if (isFromPreviousDrawstate) {
        Stage.find('.shapes').each((shape) => {
            shape.on('dragstart dragend dragmove', (evt) => {
                const target = evt.type === 'dragstart' ? evt.currentTarget : evt.target;
                const debounce = evt.type == 'dragmove';

                transmit({
                    event: 'node_drag',
                    node: {
                        id: target.id(),
                        x: target.x(),
                        y: target.y()
                    },
                    layer: target.getLayer().id()
                }, debounce);
            });

            shape.on('transfromstart transformend', (evt) => {
                const target = evt.type === 'transformstart' ? evt.currentTarget : evt.target;
                const debounce = evt.type == 'transform';

                transmit({
                    event: 'node_transform',
                    node: {
                        id: target.id(),
                        x: target.x(),
                        y: target.y(),
                        scaleX: target.scaleX(),
                        scaleY: target.scaleY(),
                        rotation: target.rotation()
                    },
                    layer: Layers.current().id()
                }, debounce);
            });

            shape.dragBoundFunc(imageShapeBound);
        });

        Stage.find('.images').each((image) => {
            image.on('dragstart dragend dragmove', (evt) => {
                const target = evt.type === 'dragstart' ? evt.currentTarget : evt.target;
                transmit({
                    event: 'node_drag',
                    node: {
                        id: target.id(),
                        x: target.x(),
                        y: target.y()
                    },
                    layer: target.getLayer().id()
                });
            });

            image.dragBoundFunc(imageShapeBound);
        });

        if (['Brush', 'Eraser', 'Shapes'].indexOf(Components.ToolBox.getSelectedToolName()) >= 0) {
            Stage.find('.images').each((node) => {
                node.draggable(false);
            });
        }
    }
    /**
     * [START] Stage Brush/Eraser event
     */
    let lastLine = null, drawOverTools = ['Brush', 'Eraser'];
    Stage.on('mousedown touchstart', (evt) => {
        
        const toolIndex = drawOverTools.indexOf(Components.ToolBox.getSelectedToolName());

        if (toolIndex >= 0 && evt.evt.button == LEFT_CLICK) {
            console.log('draw');
            const toolName = drawOverTools[toolIndex];
            let color = '#ffffff', globalCompositeOperation = 'destination-out';

            Components.ToolBox.getSelectedTool().isPainting = true;

            if (toolName == 'Brush') {
                color = Components.ToolBox.Tool[toolName].color();
                globalCompositeOperation = 'source-over';
            }

            const currentScale = Stage.scaleX();
            const pointerPosition = Stage.getPointerPosition();
            const mousePointTo = {
                x: pointerPosition.x / currentScale - Stage.x() / currentScale,
                y: pointerPosition.y / currentScale - Stage.y() / currentScale
            };

            const strokeWidth = Components.ToolBox.getSelectedTool().size();

            lastLine = new Konva.Line({
                stroke: color,
                strokeWidth,
                globalCompositeOperation,
                lineCap: 'round',
                points: [mousePointTo.x, mousePointTo.y],
                id: makeid()
            });

            Layers.current().add(lastLine);

            transmit({
                event: 'node_new',
                node: {
                    id: lastLine.id(),
                    def: lastLine.toJSON()
                },
                layer: Layers.current().id()
            })
        }
    });

    Stage.on('mouseup touchend', (evt) => {
        if (drawOverTools.indexOf(Components.ToolBox.getSelectedToolName()) >= 0 && Components.ToolBox.getSelectedTool().isPainting) {
            Components.ToolBox.getSelectedTool().isPainting = false;
        }
    });

    Stage.on('mousemove touchmove', (evt) => {
        if (drawOverTools.indexOf(Components.ToolBox.getSelectedToolName()) >= 0 && Components.ToolBox.getSelectedTool().isPainting) {
            const currentScale = Stage.scaleX();
            const pointerPosition = Stage.getPointerPosition();
            const mousePointTo = {
                x: pointerPosition.x / currentScale - Stage.x() / currentScale,
                y: pointerPosition.y / currentScale - Stage.y() / currentScale
            };
            const newPoints = lastLine.points().concat([mousePointTo.x, mousePointTo.y]);

            lastLine.points(newPoints);
            Layers.current().batchDraw();

            transmit({
                event: 'node_points',
                node: {
                    id: lastLine.id(),
                    points: newPoints
                },
                layer: Layers.current().id()
            }, true);
        }
    });
    /**
     * [END] Stage Brush/Eraser event
     */

    
    /**
     * [START] Clear
     */
    Components.ToolBox.Tool.Clear.button.addEventListener('click', (evt) => {
        evt.preventDefault();

        const deletedNodes = Layers.current().getChildren((child) => {
            return child.getClassName() !== 'Image';
        });

        deletedNodes.each((node) => {
            node.destroy();
        });

        Layers.current().batchDraw();

        transmit({
            event: 'layer_clear',
            layer: Layers.current().id()
        });
    }, false);
    /**
     * [END] Clear
     */
    
    
    
    /**
     * [START] Shapes
     */
    _.each(Components.ToolBox.Tool.Shapes.all(), (shape) => {
        shape.button.addEventListener('click', (evt) => {
            evt.preventDefault();

            const node = shape.use();

            // @TODO Bug. Shapes don't respect dragBoundFunc?
            node.dragBoundFunc(imageShapeBound);

            node.on('dragstart dragmove dragend', (evt) => {
                const target = evt.type === 'dragstart' ? evt.currentTarget : evt.target;

                if (evt.type == 'dragstart') {
                    // @TODO History
                } else if (evt.type == 'dragend') {
                    // @TODO History
                }

                const debounce = evt.type == 'dragmove';

                transmit({
                    event: 'node_drag',
                    node: {
                        id: target.id(),
                        x: target.x(),
                        y: target.y()
                    },
                    layer: target.getLayer().id()
                }, debounce);
            });

            node.on('transformstart transformend', (evt) => {
                const target = evt.type === 'transformstart' ? evt.currentTarget : evt.target;

                if (evt.type == 'transformstart') {
                    // @TODO History
                } else if (evt.type == 'transformend') {
                    // @TODO History
                }

                const debounce = evt.type == 'transform';

                transmit({
                    event: 'node_transform',
                    node: {
                        id: target.id(),
                        x: target.x(),
                        y: target.y(),
                        scaleX: target.scaleX(),
                        scaleY: target.scaleY(),
                        rotation: target.rotation()
                    },
                    layer: Layers.current().id()
                }, debounce);
            });

            const midpoint = getStageMidPoint(node);

            node.x(midpoint.x);
            node.y(midpoint.y);
            node.id(makeid());

            Stage.find('Transformer').destroy();

            const transformer = new Konva.Transformer();
            transformer.attachTo(node);

            Layers.current().add(node);
            Layers.current().add(transformer);
            Layers.current().draw();

            transmit({
                event: 'node_new',
                node: {
                    id: node.id(),
                    def: node.toJSON()
                },
                layer: Layers.current().id()
            });
        }, false);
    });

    let SelectedNode = null;

    // CANVAS RIGHT CLICK
    document.addEventListener('contextmenu', (evt) => {
        if (evt.target.tagName === 'CANVAS') {
            evt.preventDefault();

            Components.ToolBox.use('Select');
            Components.ToolBox.Tool.Select.hideEditBox();
        }
    }, false);

    Stage.on('click tap', (evt) => {
        const tool = Components.ToolBox.Tool.Select;
        const transformers = Stage.find('Transformer');

        if (evt.evt.button == RIGHT_CLICK) {
            evt.evt.preventDefault();

            Components.ToolBox.use('Select');
            tool.hideEditBox();
            transformers.destroy();

            transmit({
                event: 'transformer_remove'
            });

            return;
        }

        
        transformers.destroy();
        transmit({
            event: 'transformer_remove'
        });

        if (evt.target === Stage) {
            SelectedNode = null;

            tool.hideEditBox();
            Layers.current().batchDraw();

            return;
        }

        if (!evt.target.hasName('shapes')) {
            return;
        }

        SelectedNode = evt.target;

        const newTransformer = new Konva.Transformer();
        
        Layers.current().add(newTransformer);
        newTransformer.attachTo(SelectedNode);
        
        Layers.current().batchDraw();

        
        Components.ToolBox.use('Select');
        tool.Pickr.setColor(SelectedNode.stroke());
        tool.showEditBox();

        transmit({
            event: 'transformer_new',
            node: {
                id: SelectedNode.id()
            },
            layer: Layers.current().id()
        });
    });

    Components.ToolBox.Tool.Select.Pickr.on('save', (color, instance) => {
        if (SelectedNode !== null) {
            const colorValue = color.toRGBA().toString();

            SelectedNode.stroke(colorValue);
            instance.hide();

            Layers.current().draw();

            transmit({
                event: 'shape_stroke',
                node: {
                    id: SelectedNode.id(),
                    color: colorValue
                },
                layer: Layers.current().id()
            });
        }
    });

    let CopiedNode = null;

    function copyNode()
    {
        if (SelectedNode !== null) {
            CopiedNode = SelectedNode;
        }
    }

    function pasteNode()
    {
        const transformers = Stage.find('Transformer');
        const PastedNode = CopiedNode.clone();

        PastedNode.id(makeid());

        transformers.detach();
        transformers.attachTo(PastedNode);

        const newX = SelectedNode.x() - 10;
        const newY = SelectedNode.y() - 10;
        
        PastedNode.x(newX);
        PastedNode.y(newY);

        SelectedNode = PastedNode;

        Layers.current().add(PastedNode);
        Layers.current().batchDraw();

        transmit({
            event: 'node_new',
            node: {
                id: SelectedNode.id(),
                def: SelectedNode.toJSON()
            },
            layer: Layers.current().id()
        });
    }

    function deleteNode()
    {
        Stage.find('Transformer').destroy();
        transmit({
            event: 'transformer_remove'
        });

        transmit({
            event: 'node_remove',
            node: {
                id: SelectedNode.id()
            },
            layer: SelectedNode.getLayer().id()
        });

        SelectedNode.destroy();
        Layers.current().batchDraw();

        SelectedNode = null;
        CopiedNode = null;
    }

    document.addEventListener('keyup', (evt) => {
        // CTRL+C
        if (evt.ctrlKey && evt.keyCode === 67) {
            copyNode();
        }


        // CTRL+V
        if (evt.ctrlKey && evt.keyCode === 86) {
            pasteNode();
        }

        // DELETE
        if (evt.keyCode === 46) {
            deleteNode();
        }
    }, false);

    Components.ToolBox.Tool.Select.deleteShapeButton.addEventListener('click', (evt) => {
        evt.preventDefault();
        deleteNode();
    }, false);

    // ZOOM
    Components.ToolBox.Tool.ZoomReset.button.addEventListener('click', (evt) => {
        evt.preventDefault();

        const scale = {
            x: 1, y: 1
        };

        const position = {
            x: 1, y: 1
        };

        Stage.scale(scale);
        Stage.position(position);

        Stage.batchDraw();

        Components.ToolBox.Tool.ZoomReset.zoomValue.innerHTML = '100%';

        transmit({
            event: 'scale',
            scale,
            position
        });
    });

    const scaleBy = 1.3;
    const scaleMinPercent = 12.5;
    const scaleMaxPercent = 800;

    Stage.on('wheel', (e) => {
        e.evt.preventDefault();
        if (e.evt.ctrlKey) {
            const oldScale = Stage.scaleX();

            const mousePointTo = {
                x: Stage.getPointerPosition().x / oldScale - Stage.x() / oldScale,
                y: Stage.getPointerPosition().y / oldScale - Stage.y() / oldScale
            };

            const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
            const scalePercent = newScale * 100;

            // Stop at less than 12.5% scale or greater than 800%
            if (scalePercent < scaleMinPercent || scalePercent > scaleMaxPercent) {
                return;
            }

            Components.ToolBox.Tool.ZoomReset.zoomValue.innerHTML = Math.ceil(scalePercent * 100) / 100 +'%';

            const xyScale = { x: newScale, y: newScale };

            Stage.scale(xyScale);

            const newPos = {
                x: -(mousePointTo.x - Stage.getPointerPosition().x / newScale) * newScale,
                y: -(mousePointTo.y - Stage.getPointerPosition().y / newScale) * newScale
            };

            Stage.position(newPos);
            Stage.batchDraw();

            transmit({
                event: 'scale',
                scale: xyScale,
                position: newPos
            });
        }
    });
    /**
     * [END] Shapes
     */




    
    /**
     * [START] ImageUpload
     */
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((event) => {
        window.addEventListener(event, (evt) => {
            evt.preventDefault();
            evt.stopPropagation();
        }, false);
    });

    ['dragenter', 'dragover'].forEach((event) => {
        window.addEventListener(event, (evt) => {
            Components.ImageImport.showDropZone();
        }, false);
    },);

    ['dragleave', 'drop'].forEach((event) => {
        window.addEventListener(event, (evt) => {
            Components.ImageImport.hideDropZone();
        }, false);
    });

    function uploadImage(evt)
    {
        const files = typeof evt.dataTransfer !== 'undefined' ? evt.dataTransfer.files : evt.target.files;

        Components.ImageImport.showUploadProgress();
        Components.ImageImport.upload.total.innerText = files.length;
        Components.ImageImport.upload.current.innerText = 0;

        _.each(files, async (file) => {
            const data = new FormData();
            data.set('image', file);

            const upload = await axios.post(url('/classroom/image-upload'), data);

            const current = parseInt(Components.ImageImport.upload.current.innerText) + 1;
            const total = parseInt(Components.ImageImport.upload.total.innerText);

            Components.ImageImport.upload.current.innerText = current;
            Components.ImageImport.upload.progress.setAttribute('value', current);

            const promise = await uploadHandler(upload.data);

            if (promise.success) {
                addImageNodeToStage(promise.node, promise.image);
            }

            if (current === total) {
                setTimeout(() => {
                    Components.ImageImport.hideUploadProgress();
                    Components.ToolBox.use('Select');

                    if (!Components.ToolBox.isHidden()) {
                        Components.ToolBox.toggle();
                    }

                    Stage.batchDraw();
                }, 1500);
            }
        });
    }

    async function uploadHandler(data)
    {
        const image = new Image();

        return new Promise((resolve, reject) => {
            const id = makeid();

            image.setAttribute('data-index', UploadCounter);
            image.setAttribute('data-node-id', id);
            image.setAttribute('data-image-id', data.image.id);

            UploadCounter++;

            image.onerror = () => {
                reject({
                    success: false,
                    image_id: data.image.id
                });
            };

            image.onload = () => {
                const node = new Konva.Image({
                    width: image.width,
                    height: image.height,
                    x: 0,
                    y: 0,
                    draggable: true,
                    name: 'images'
                });

                node.id(id);
                node.image(image);
                image.dragBoundFunc(imageShapeBound);

                resolve({
                    success: true,
                    image,
                    node
                });
            };

            image.src = data.image.image_URL;
        });
    }

    function addImageNodeToStage(node, image)
    {
        node.on('dragend dragmove dragstart', (evt) => {
            const target = evt.type === 'dragstart' ? evt.currentTarget : evt.target;

            if (evt.type == 'dragstart') {
                // Save to registry [from]
            } else if (evt.type == 'dragend') {
                // Save to history [to]
            }

            const debounce = evt.type == 'dragmove';

            transmit({
                event: 'node_drag',
                node: {
                    id: target.id(),
                    x: target.x(),
                    y: target.y()
                },
                layer: target.getLayer().id()
            }, debounce);
        });

        const label = `Image ${image.getAttribute('data-index')}`;
        const layerId = makeid();
        Components.TabGroup.add({
            id: layerId,
            label,
            layerAttrs: {
                drawingBoardHeight: image.height
            }
        });

        Layers.get(layerId).add(node);

        UploadedImages.push({
            node_id: node.id(),
            image: {
                id: image.getAttribute('data-image-id'),
                src: image.src,
                index: image.getAttribute('data-index')
            }
        });

        transmit({
            event: 'image_new',
            image: {
                id: image.getAttribute('data-image-id'),
                label
            },
            layer: layerId
        });
    }

    Components.ImageImport.dropZone.addEventListener('drop', (evt) => {
        uploadImage(evt);
    }, false);

    Components.ImageImport.inputField.addEventListener('change', (evt) => {
        uploadImage(evt);
    }, false);

    // [START FIX] Prevent image drag and brush/eraser/shapes from doing the same thing
    Components.ToolBox.Tool.Select.button.addEventListener('click', (evt) => {
        const children = Layers.current().getChildren((node) => {
            return node.getClassName() === 'Image';
        });

        children.draggable(true);
    }, false);

    ['Brush', 'Eraser', 'Shapes'].forEach((tool) => {
        Components.ToolBox.Tool[tool].button.addEventListener('click', (evt) => {
            const children = Layers.current().getChildren((node) => {
                return node.getClassName() === 'Image';
            });

            children.draggable(false);
        }, false);
    });
        
    // [END FIX] Prevent image drag and brush from doing the same thing
    /**
     * [END] ImageUpload
     */


    /**
     * [START] Autosaver
     */
    let autosaver = () => {
        setTimeout(() => {
            const sender = saveDrawState();

            sender.then((resp) => {
                autosaver();
            });
        }, 2000);
    };

    autosaver();
    /**
     * [END] Autosaver
     */


    window.__DebugELO = {
        ClassroomInfo,
        Users,
        Components,
        Layers,
        Stage,
        PreviousDrawstate
    };
})();