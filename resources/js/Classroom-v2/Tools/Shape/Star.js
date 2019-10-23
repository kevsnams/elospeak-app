import BaseShape from "./BaseShape";

export default class Star extends BaseShape {
    constructor(canvas)
    {
        super('Star', canvas);

        this.setWidth(200);
        this.setHeight(200);
    }

    createShape(stage, color)
    {
        const midpoint = this.getStageMidPoint(stage);

        return new Konva.Star({
            x: midpoint.x,
            y: midpoint.y,
            numPoints: 5,
            innerRadius: 40,
            outerRadius: 40,
            fill: null,
            stroke: color,
            strokeWidth: 4,
            name: this.name,
            width: this.getWidth(),
            height: this.getHeight(),
            draggable: true
        });
    }
}