import Konva from 'konva';
import Shape from './Shape';

export default class Square extends Shape {
    constructor(Shapes)
    {
        super('Square', Shapes);
    }

    createKonvaInstance()
    {
        return new Konva.Rect({
            width: 200,
            height: 200,
            fill: null,
            stroke: this.Shapes.color(),
            strokeWidth: 4,
            name: 'shapes',
            draggable: true
        });
    }
}