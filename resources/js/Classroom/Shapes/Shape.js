export default class Shape {
    constructor(width, height) {
        this._width = width;
        this._height = height;
        this.name = 'shapes';
        this.color = ClassroomBoard.ColorPicker.color();
    }

    getStageMidPoint() {
        if (typeof ClassroomBoard === 'undefined') {
            throw new Error('Shapes/Shape: ClassroomBoard has not yet been defined');
        }

        return {
            x: (ClassroomBoard.stage.width() / 2) - (this.width / 2),
            y: Math.abs(ClassroomBoard.target.getBoundingClientRect().top) + (window.innerHeight / 2)
        };
    }

    get width() { return this._width; }
    set width(w) { this._width = w; }

    get height() { return this._height; }
    set height(h) { this._height = h; }
}