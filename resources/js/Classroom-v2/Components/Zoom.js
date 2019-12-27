import Users from '../Users';
import KonvaStage from '../KonvaStage';
import DataTransmitter from '../Components/DataTransmitter';

class Zoom {
    constructor()
    {
        this.scaleBy = 2;
        this.zoomValue = document.getElementById('zoom-value');
        this.zoomReset = document.getElementById('zoom-reset');

        this.minScalePercent = 12.5;
        this.maxScalePercent = 800;
    }

    start()
    {
        if (Users.current.user_type === 'teacher') {
            this.registerZoomEvents();
        }
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

            KonvaStage.Stage.scale(scale);
            KonvaStage.Stage.position(position);
    
            KonvaStage.Stage.batchDraw();

            DataTransmitter.send({
                event: 'setScale',
                scale,
                position
            });

            this.zoomValue.innerHTML = '100%';
        });

        KonvaStage.Stage.on('wheel', (e) => {
            e.evt.preventDefault();
            if (e.evt.ctrlKey) {
                const oldScale = KonvaStage.Stage.scaleX();
    
                const mousePointTo = {
                    x: KonvaStage.Stage.getPointerPosition().x / oldScale - KonvaStage.Stage.x() / oldScale,
                    y: KonvaStage.Stage.getPointerPosition().y / oldScale - KonvaStage.Stage.y() / oldScale
                };
    
                const newScale = e.evt.deltaY > 0 ? oldScale * this.scaleBy : oldScale / this.scaleBy;
                const scalePercent = newScale * 100;
    
                // Stop at less than 12.5% scale or greater than 800%
                if (scalePercent < this.minScalePercent || scalePercent > this.maxScalePercent) {
                    return;
                }
    
                this.zoomValue.innerHTML = scalePercent +'%';

                const xyScale = { x: newScale, y: newScale };

                KonvaStage.Stage.scale({ x: newScale, y: newScale });
    
                const newPos = {
                    x: -(mousePointTo.x - KonvaStage.Stage.getPointerPosition().x / newScale) * newScale,
                    y: -(mousePointTo.y - KonvaStage.Stage.getPointerPosition().y / newScale) * newScale
                };
    
                KonvaStage.Stage.position(newPos);
                KonvaStage.Stage.batchDraw();

                DataTransmitter.send({
                    event: 'setScale',
                    scale: xyScale,
                    position: newPos
                });
            }
        });
    }
}

const ComponentZoom = new Zoom();

export default ComponentZoom;