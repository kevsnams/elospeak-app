import BaseShape from "./BaseShape";

export default class Rectangle extends BaseShape {
    constructor(canvas)
    {
        super('Rectangle', canvas);

        this.setWidth(300);
        this.setHeight(100);
    }

    createShape(stage, color)
    {
        const midpoint = this.getStageMidPoint(stage);

        return new Konva.Rect({
            x: midpoint.x,
            y: midpoint.y,
            width: this.getWidth(),
            height: this.getHeight(),
            fill: null,
            stroke: color,
            strokeWidth: 4,
            name: this.name,
            draggable: true
        });
    }
}