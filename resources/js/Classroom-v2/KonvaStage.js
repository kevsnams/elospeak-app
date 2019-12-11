import Konva from 'konva';
import DOMElements from './DOMElements';

class KonvaStage {
    constructor()
    {
        this.drawingboard = DOMElements.drawingboard;

        const clientRect = this.drawingboard.getBoundingClientRect();

        this.Stage = new Konva.Stage({
            container: this.drawingboard,
            width: clientRect.width,
            height: clientRect.height
        });
    }
}

const ELOSpeakStage = new KonvaStage();

export default ELOSpeakStage;