import Shape from './Shape';

export default class Rectangle extends Shape {
    constructor(width = 150, height = 50) {
        super(width, height);

        const midpoint = this.getStageMidPoint();

        return new Konva.Rect({
            x: midpoint.x,
            y: midpoint.y,
            width: this.width,
            height: this.height,
            fill: null,
            stroke: this.color,
            strokeWidth: 4,
            name: this.name,
            draggable: true
        });
    }
}