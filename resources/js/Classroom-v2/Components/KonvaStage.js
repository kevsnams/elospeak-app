import Component from './Component';
import Konva from 'konva';

export default class KonvaStage extends Component {
    constructor(Classroom)
    {
        super(Classroom);

        const clientRect = this.getClassroom().container.getBoundingClientRect();

        this.Stage = new Konva.Stage({
            container: this.getClassroom().container,
            width: clientRect.width,
            height: clientRect.height
        });
    }

    run()
    {
        if (this.getUsers().current.user_type === 'teacher') {
            this.registerDrawingEvents();
        }
    }

    getStage()
    {
        return this.Stage;
    }
    
    registerDrawingEvents()
    {
        let lastLine = null;
        this.getStage().on('mousedown touchstart', (evt) => {
            if (this.getDrawMode().isPaintingMode()) {
                this.getDrawMode().doPaintMode();
                
                const currentScale = this.getStage().scaleX();
                const pointerPosition = this.getStage().getPointerPosition();
                const mousePointTo = {
                    x: pointerPosition.x / currentScale - this.getStage().x() / currentScale,
                    y: pointerPosition.y / currentScale - this.getStage().y() / currentScale
                };
                const strokeWidth = this.getDrawMode().get() === 'brush' ? this.getTools().Brush.getSize() : this.getTools().Eraser.getSize();

                lastLine = new Konva.Line({
                    stroke: this.getTools().Brush.getColor(),
                    strokeWidth,

                    globalCompositeOperation: this.getDrawMode().getPaintOperation(),
                    lineCap: 'round',
                    points: [mousePointTo.x, mousePointTo.y]
                });
                lastLine.id(this.getHistory().createId());

                this.getLayers().current().add(lastLine);

                this.getLaravelEcho().sendEventData({
                    event: 'newNode',
                    node: lastLine.toJSON(),
                    layer_id: this.getLayers().current().id()
                });
            }
        });

        this.getStage().on('mouseup touchend', (evt) => {
            if (this.getDrawMode().isPaintingMode()) {
                this.getDrawMode().undoPaintMode();

                this.getHistory().add('new', lastLine);
            }
        });

        this.getStage().on('mousemove touchmove', (evt) => {
            if (this.getDrawMode().isPaintingMode()) {
                if (!this.getDrawMode().isPainting) {
                    return;
                }

                const currentScale = this.getStage().scaleX();
                const pointerPosition = this.getStage().getPointerPosition();
                const mousePointTo = {
                    x: pointerPosition.x / currentScale - this.getStage().x() / currentScale,
                    y: pointerPosition.y / currentScale - this.getStage().y() / currentScale
                };
                const newPoints = lastLine.points().concat([mousePointTo.x, mousePointTo.y]);

                lastLine.points(newPoints);
                this.getLayers().current().batchDraw();

                this.getLaravelEcho().sendEventData({
                    event: 'newPoints',
                    points: newPoints,
                    node_id: lastLine.id(),
                    layer_id: this.getLayers().current().id()
                }, true);
            }
        });
    }
}