export default class TabGroup {
    constructor()
    {
        const container = document.createElement('div');
        container.setAttribute('id', 'vr-tabs');

        this.container = container;
    }

    appendTo(parent)
    {
        this.parent = parent;
        this.parent.appendChild(this.container);
    }
}