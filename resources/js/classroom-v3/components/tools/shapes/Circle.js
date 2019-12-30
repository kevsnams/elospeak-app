import Konva from 'konva';
import Shape from './Shape';

export default class Circle extends Shape {
    constructor(Shapes)
    {
        super('Circle', Shapes);
    }

    createKonvaInstance()
    {
        return new Konva.Circle({
            radius: 80,
            fill: null,
            stroke: this.Shapes.color(),
            strokeWidth: 5,
            name: 'shapes',
            draggable: true
        });
    }
}