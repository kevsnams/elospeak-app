import BaseShape from "./BaseShape";

export default class Square extends BaseShape {
    constructor(canvas)
    {
        super('Square', canvas);

        this.setWidth(200);
        this.setHeight(200);
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