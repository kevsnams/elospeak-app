import _ from 'underscore';
import Konva from 'konva';

import KonvaStage from '../KonvaStage';
import DrawMode from './DrawMode';
import Layers from '../Layers';
import History from '../History';
import Users from '../Users';
import Registry from '../Registry';

import IDGenerator from '../Utils/IDGenerator';

import Brush from './Tools/Brush';
import Eraser from './Tools/Eraser';
import Shapes from './Tools/Shapes';
import Select from './Tools/Select';

class Tools {
    start()
    {
        this.selectedNode = null;

        this.ToolSet = {
            Brush: new Brush('tool-brush'),
            Eraser: new Eraser('tool-eraser'),
            Shapes: new Shapes('tool-shapes'),
            Select: new Select('tool-select')
        };

        this.Brush = this.ToolSet.Brush;
        this.Eraser = this.ToolSet.Eraser;
        this.Shapes = this.ToolSet.Shapes;
        this.Select = this.ToolSet.Select;

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
                this.ToolSet[key].button.addEventListener('click', (evt) => {
                    const mode = evt.target.getAttribute('data-tool');
                    DrawMode.set(mode);
        
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

                    /*
                    this.getLaravelEcho().sendEventData({
                        event: 'newPosition',
                        node_id: evt.currentTarget.id(),
                        layer_id: evt.currentTarget.getLayer().id(),
                        x: evt.currentTarget.x(),
                        y: evt.currentTarget.y()
                    });
                    */
                });
    
                Layers.current().add(shapeObject);
                Layers.current().batchDraw();
    
                History.add('new', {
                    node: shapeObject,
                    node_id: shapeObject.id(),
                    layer_id: Layers.current().id()
                });
                
                /*
                this.getLaravelEcho().sendEventData({
                    event: 'newNode',
                    node: shapeObject.toJSON(),
                    layer_id: Layers.current().id()
                });
                */
            }, false);
        });
    
        /**
         * Shape select event
         */
        KonvaStage.Stage.on('click tap', (evt) => {
            // if click on empty area - remove all transformers
            if (evt.target === KonvaStage.Stage) {
                KonvaStage.Stage.find('Transformer').destroy();
                Layers.current().batchDraw();
    
                return;
            }

            const isLine = evt.target.getClassName() === 'Line';
            const isShape = evt.target.hasName('shapes');
    
            // do nothing if clicked NOT on our rectangles
            if (isShape || isLine) {
                // remove old transformers
                // TODO: we can skip it if current rect is already selected
                KonvaStage.Stage.find('Transformer').destroy();
        
                // create new transformer
                let config = {};
                if (isLine) {
                    config = {
                        resizeEnabled: false,
                        rotateEnabled: false
                    };
                }

                const transformer = new Konva.Transformer(config);
                
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