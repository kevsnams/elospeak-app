import Shape from './Shape';

export default class Star extends Shape {
    constructor(width = 100, height = 100) {
        super(width, height);

        const midpoint = this.getStageMidPoint();

        return new Konva.Star({
            x: midpoint.x,
            y: midpoint.y,
            numPoints: 5,
            innerRadius: 20,
            outerRadius: 20,
            fill: null,
            stroke: this.color,
            strokeWidth: 4,
            name: this.name,
            width: this.width,
            height: this.height,
            draggable: true
        });
    }
}