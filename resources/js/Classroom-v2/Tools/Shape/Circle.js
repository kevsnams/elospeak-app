import BaseShape from "./BaseShape";

export default class Circle extends BaseShape {
    constructor(canvas)
    {
        super('Circle', canvas);
    }

    createShape(stage, color)
    {
        const midpoint = this.getStageMidPoint(stage);

        return new Konva.Circle({
            x: midpoint.x,
            y: midpoint.y,
            radius: 80,
            fill: null,
            stroke: color,
            strokeWidth: 5,
            name: this.name,
            draggable: true
        });
    }
}