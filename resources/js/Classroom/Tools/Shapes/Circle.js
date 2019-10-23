import Shape from './Shape';

export default class Square extends Shape {
    constructor(width = 100, height = 100) {
        super(width, height);

        const midpoint = this.getStageMidPoint();

        return new Konva.Circle({
            x: midpoint.x,
            y: midpoint.y,
            width: this.width,
            height: this.height,
            radius: 40,
            fill: null,
            stroke: this.color,
            strokeWidth: 5,
            name: this.name,
            draggable: true
        });
    }
}