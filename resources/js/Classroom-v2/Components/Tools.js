import Component from './Component';

import Konva from 'konva';

import Brush from '../Tools/Brush';
import Eraser from '../Tools/Eraser';
import Shapes from '../Tools/Shapes';
import Select from '../Tools/Select';

export default class Tools extends Component {
    constructor(Classroom)
    {
        super(Classroom);

        this.ToolSet = {
            Brush: new Brush('tool-brush'),
            Eraser: new Eraser('tool-eraser'),
            Shapes: new Shapes('tool-shapes', this.getClassroom().container),
            Select: new Select('tool-select')
        };
    }

    run()
    {
        // Set Brush as default
        this.ToolSet.Brush.setActive();

        this.registerToolsEvents();
        this.registerShapesEvents();
    }

    registerToolsEvents()
    {
        /**
         * Make the tool buttons change the mode onclick. And change mode if selected is an image
         */
        const toggleChildrenImageDraggable = () => {
            const children = this.getLayers().current().getChildren((node) => {
                return node.getClassName() === 'Image';
            });

            if (this.getDrawMode().get() === 'select') {
                children.draggable(true);
            } else {
                children.draggable(false);
            }
        };

        for (let key in this.ToolSet) {
            if (this.ToolSet.hasOwnProperty(key)) {
                this.ToolSet[key].button.addEventListener('click', (evt) => {
                    const mode = evt.target.getAttribute('data-tool');
                    this.getDrawMode().set(mode);
        
                    toggleChildrenImageDraggable();
                }, false);
            }
        }
    }

    registerShapesEvents()
    {
        _.each(this.ToolSet.Shapes.shapes, (shape) => {
            shape.button.addEventListener('click', (event) => {
                event.preventDefault();
    
                const shapeObject = shape.createShape(this.getStage(), this.ToolSet.Shapes.getColor());
                shapeObject.id(this.getHistory().createId());
    
                /**
                 * NO RESIZE HISTORY YET
                 */
                shapeObject.on('transformstart transformend', (evt) => {
                    // const target = evt.type === 'transformstart' ? evt.currentTarget : evt.target;
                    // this.getHistory().add('resize', target, shape.shapeName);
                });
    
                shapeObject.on('dragstart dragend', (evt) => {
                    const target = evt.type === 'dragstart' ? evt.currentTarget : evt.target;
                    this.getHistory().add('move', evt.currentTarget);

                    this.getLaravelEcho().sendEventData({
                        event: 'newPosition',
                        node_id: evt.currentTarget.id(),
                        layer_id: evt.currentTarget.getLayer().id(),
                        x: evt.currentTarget.x(),
                        y: evt.currentTarget.y()
                    });
                });
    
                this.getLayers().current().add(shapeObject);
                this.getLayers().current().batchDraw();
    
                this.getHistory().add('new', shapeObject);
                this.getLaravelEcho().sendEventData({
                    event: 'newNode',
                    node: shapeObject.toJSON(),
                    layer_id: this.getLayers().current().id()
                });
            }, false);
        });
    
        /**
         * Shape select event
         */
        this.getStage().on('click tap', (evt) => {
            // if click on empty area - remove all transformers
            if (evt.target === this.getStage()) {
                this.getStage().find('Transformer').destroy();
                this.getLayers().current().batchDraw();
    
                return;
            }
    
            // do nothing if clicked NOT on our rectangles
            if (!evt.target.hasName('shapes')) {
                return;
            }
    
            // remove old transformers
            // TODO: we can skip it if current rect is already selected
            this.getStage().find('Transformer').destroy();
    
            // create new transformer
            var transformer = new Konva.Transformer();
            this.getLayers().current().add(transformer);
            transformer.attachTo(evt.target);
    
            this.getLayers().current().draw();
        });
    }
}