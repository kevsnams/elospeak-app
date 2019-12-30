import Konva from 'konva';
import Shape from './Shape';

export default class Rectangle extends Shape {
    constructor(Shapes)
    {
        super('Rectangle', Shapes);
    }

    createKonvaInstance()
    {
        return new Konva.Rect({
            width: 300,
            height: 100,
            fill: null,
            stroke: this.Shapes.color(),
            strokeWidth: 4,
            name: 'shapes',
            draggable: true
        });
    }
}