export default class Shape {
    constructor(shapeName, Shapes)
    {
        this.Shapes = Shapes;
        this.name = shapeName;
        this.lcName = shapeName.toLowerCase();

        this.button = document.createElement('a');
        this.button.id = `shape-${this.lcName}`;
        this.button.className = `shapes ${this.lcName}`;
        this.button.innerText = this.name;
    }

    use()
    {
        return this.createKonvaInstance();
    }
}