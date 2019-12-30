import Konva from 'konva';
import Shape from './Shape';

export default class Star extends Shape {
    constructor(Shapes)
    {
        super('Star', Shapes);
    }

    createKonvaInstance()
    {
        return new Konva.Star({
            numPoints: 5,
            innerRadius: 40,
            outerRadius: 40,
            fill: null,
            stroke: this.Shapes.color(),
            strokeWidth: 4,
            name: 'shapes',
            width: 200,
            height: 200,
            draggable: true
        });
    }
}