export default class BaseShape {
    constructor(shapeName, canvas)
    {
        this.shapeName = shapeName;
        this.lcShapeName = shapeName.toLowerCase();

        this.button = document.createElement('a');
        this.button.id = `shape-${this.lcShapeName}`;
        this.button.className = `shapes ${this.lcShapeName}`;
        this.button.innerText = this.shapeName;

        document.getElementById('shapes-list').appendChild(this.button);

        this.name = 'shapes';

        this.width = 0;
        this.height = 0;

        this.canvas = canvas;
    }

    getStageMidPoint(stage)
    {
        return {
            x: (stage.width() / 2) - (this.getWidth() / 2),
            y: Math.abs(this.canvas.getBoundingClientRect().top) + (window.innerHeight / 2)
        };
    }

    setWidth(width)
    {
        this.width = width;

        return this;
    }

    getWidth()
    {
        return this.width;
    }

    setHeight(height)
    {
        this.height = height;

        return this;
    }

    getHeight(height)
    {
        return this.height;
    }
}