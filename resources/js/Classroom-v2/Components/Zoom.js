import Component from './Component';

export default class Zoom extends Component {
    constructor(Classroom)
    {
        super(Classroom);

        this.scaleBy = 2;
        this.zoomValue = document.getElementById('zoom-value');
        this.zoomReset = document.getElementById('zoom-reset');

        this.minScalePercent = 12.5;
        this.maxScalePercent = 800;
    }

    run()
    {
        this.registerZoomEvents();
    }

    registerZoomEvents()
    {
        this.zoomReset.addEventListener('click', (evt) => {
            evt.preventDefault();

            const scale = {
                x: 1, y: 1
            };

            const position = {
                x: 1, y: 1
            };

            this.getStage().scale(scale);
            this.getStage().position(position);
    
            this.getStage().batchDraw();

            this.getLaravelEcho().sendEventData({
                event: 'setScale',
                scale,
                position
            });

            this.zoomValue.innerHTML = '100%';
        });

        this.getStage().on('wheel', (e) => {
            e.evt.preventDefault();
            if (e.evt.ctrlKey) {
                const oldScale = this.getStage().scaleX();
    
                const mousePointTo = {
                    x: this.getStage().getPointerPosition().x / oldScale - this.getStage().x() / oldScale,
                    y: this.getStage().getPointerPosition().y / oldScale - this.getStage().y() / oldScale
                };
    
                const newScale = e.evt.deltaY > 0 ? oldScale * this.scaleBy : oldScale / this.scaleBy;
                const scalePercent = newScale * 100;
    
                // Stop at less than 12.5% scale or greater than 800%
                if (scalePercent < this.minScalePercent || scalePercent > this.maxScalePercent) {
                    return;
                }
    
                this.zoomValue.innerHTML = scalePercent +'%';

                const xyScale = { x: newScale, y: newScale };

                this.getStage().scale({ x: newScale, y: newScale });
    
                const newPos = {
                    x: -(mousePointTo.x - this.getStage().getPointerPosition().x / newScale) * newScale,
                    y: -(mousePointTo.y - this.getStage().getPointerPosition().y / newScale) * newScale
                };
    
                this.getStage().position(newPos);
                this.getStage().batchDraw();

                this.getLaravelEcho().sendEventData({
                    event: 'setScale',
                    scale: xyScale,
                    position: newPos
                });
            }
        });
    }
}