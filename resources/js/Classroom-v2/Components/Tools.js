import _ from 'underscore';
import Konva from 'konva';

import KonvaStage from '../KonvaStage';
import DrawMode from './DrawMode';
import Layers from '../Layers';
import History from '../History';
import Users from '../Users';
import Registry from '../Registry';

import DataTransmitter from '../Components/DataTransmitter';

import Classroom from '../Classroom';

import IDGenerator from '../Utils/IDGenerator';

import Brush from './Tools/Brush';
import Eraser from './Tools/Eraser';
import Shapes from './Tools/Shapes';
import Select from './Tools/Select';
import Clear from './Tools/Clear';

class Tools {
    start()
    {
        this.selectedNode = null;

        this.ToolSet = {
            Brush: new Brush('tool-brush'),
            Eraser: new Eraser('tool-eraser'),
            Shapes: new Shapes('tool-shapes'),
            Select: new Select('tool-select'),
            Clear: new Clear('tool-clear')
        };

        this.Brush = this.ToolSet.Brush;
        this.Eraser = this.ToolSet.Eraser;
        this.Shapes = this.ToolSet.Shapes;
        this.Select = this.ToolSet.Select;
        this.Clear = this.ToolSet.Clear;

        // Set Brush as default
        this.ToolSet.Brush.setActive();

        if (Users.current.user_type === 'teacher') {
            this.registerToolsEvents();
            this.registerShapesEvents();
        }
    }

    registerToolsEvents()
    {
        /**
         * Make the tool buttons change the mode onclick. And change mode if selected is an image
         */
        const toggleChildrenImageDraggable = () => {
            const children = Layers.current().getChildren((node) => {
                return node.getClassName() === 'Image';
            });

            if (DrawMode.get() === 'select') {
                children.draggable(true);
            } else {
                children.draggable(false);
            }
        };

        for (let key in this.ToolSet) {
            if (this.ToolSet.hasOwnProperty(key)) {
                let tool = this.ToolSet[key];
                tool.button.addEventListener('click', (evt) => {
                    const mode = evt.target.getAttribute('data-tool');
                    DrawMode.set(mode);

                    if (typeof tool['onClickEvent'] == 'function') {
                        tool.onClickEvent(this.selectedNode);
                    }
        
                    toggleChildrenImageDraggable();
                }, false);
            }
        }

        // Stage right click
        document.addEventListener('contextmenu', (evt) => {
            if (evt.target.tagName === 'CANVAS') {
                evt.preventDefault();
                DrawMode.set('select');
            }
        }, false);
    }

    getSelectedNode()
    {
        return this.selectedNode;
    }

    removeSelectedNode(destroy = true)
    {
        if (this.selectedNode !== null) {
            if (destroy) {
                this.selectedNode.destroy();
            } else {
                this.selectedNode.remove();
            }

            this.selectedNode = null;
        }
    }

    registerShapesEvents()
    {
        _.each(this.ToolSet.Shapes.shapes, (shape) => {
            shape.button.addEventListener('click', (event) => {
                event.preventDefault();
    
                const shapeObject = shape.createShape(KonvaStage.Stage, this.ToolSet.Shapes.getColor());
                shapeObject.id(IDGenerator.create());

                shapeObject.on('click', (evt) => {
                    if (DrawMode.get() === 'select' || DrawMode.get() === 'shapes') {
                        this.selectedNode = evt.target;
                    }

                    DrawMode.set('select');
                });

                shapeObject.on('transformstart transformend', (evt) => {
                    const target = evt.type === 'transformstart' ? evt.currentTarget : evt.target;
                    const regid = `transform-${target.id()}-from`;

                    if (evt.type === 'transformstart') {
                        Registry.set(regid, {
                            x: target.x(),
                            y: target.y(),
                            scaleX: target.scaleX(),
                            scaleY: target.scaleY(),
                            rotation: target.rotation()
                        });
                    } else if (evt.type === 'transformend') {
                        const from = Registry.get(regid);

                        History.add('shapeTransform', {
                            node: target,
                            from: from,
                            to: {
                                x: target.x(),
                                y: target.y(),
                                scaleX: target.scaleX(),
                                scaleY: target.scaleY(),
                                rotation: target.rotation()
                            }
                        });

                        Registry.delete(regid);
                    }

                    DataTransmitter.send({
                        event: 'newSize',
                        node_id: target.id(),
                        x: target.x(),
                        y: target.y(),
                        scaleX: target.scaleX(),
                        scaleY: target.scaleY(),
                        rotation: target.rotation()
                    });
                });
    
                shapeObject.on('dragstart dragend', (evt) => {
                    const target = evt.type === 'dragstart' ? evt.currentTarget : evt.target;
                    const regid = `shape-${target.id()}-from`;

                    if (evt.type === 'dragstart') {
                        Registry.set(regid, {
                            x: target.x(),
                            y: target.y()
                        });
                    } else if (evt.type === 'dragend') {
                        const coords = Registry.get(regid);

                        History.add('move', {
                            node: target,
                            from: coords,
                            to: {
                                x: target.x(),
                                y: target.y()
                            }
                        });

                        Registry.delete(regid);
                    }

                    DataTransmitter.send({
                        event: 'newPosition',
                        node_id: target.id(),
                        layer_id: target.getLayer().id(),
                        x: target.x(),
                        y: target.y()
                    }, true);
                });

                KonvaStage.Stage.find('Transformer').destroy();

                const transformer = new Konva.Transformer();
                
                Layers.current().add(transformer);
                Layers.current().add(shapeObject);

                transformer.attachTo(shapeObject);

                Layers.current().batchDraw();
    
                History.add('new', {
                    node: shapeObject,
                    node_id: shapeObject.id(),
                    layer_id: Layers.current().id()
                });
                

                Classroom.triggerToggleEvent();

                this.selectedNode = shapeObject;
                DrawMode.set('select');

                DataTransmitter.send({
                    event: 'newNode',
                    node: shapeObject.toJSON(),
                    layer_id: Layers.current().id()
                });
            }, false);
        });
    
        /**
         * Shape select event
         */
        KonvaStage.Stage.on('click tap', (evt) => {
            // if click on empty area - remove all transformers
            if (evt.target === KonvaStage.Stage) {

                if (typeof this.ToolSet.Select['onUnSelected'] == 'function') {
                    this.ToolSet.Select.onUnSelected(evt);
                }

                KonvaStage.Stage.find('Transformer').destroy();
                Layers.current().batchDraw();
    
                return;
            }

            const isShape = evt.target.hasName('shapes');
    
            // do nothing if clicked NOT on our rectangles
            if (isShape) {
                // remove old transformers
                // TODO: we can skip it if current rect is already selected
                KonvaStage.Stage.find('Transformer').destroy();

                if (typeof this.ToolSet.Select['onShapeSelect'] == 'function') {
                    this.ToolSet.Select.onShapeSelect(evt);
                }

                const transformer = new Konva.Transformer();
                
                Layers.current().add(transformer);
                transformer.attachTo(evt.target);
        
                Layers.current().draw();
            } else {
                return;
            }
        });
    }
}

const ComponentTools = new Tools();

export default ComponentTools;