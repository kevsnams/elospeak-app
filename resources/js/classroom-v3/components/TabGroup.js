import Tab from './Tab';

export default class TabGroup {
    constructor(Components)
    {
        this.Components = Components;

        const container = document.createElement('div');
        container.setAttribute('id', 'vr-tabs');

        this.container = container;
        this.Tabs = {};
        this.Layers = null;

        this.Components.board.appendChild(this.container);
        this.switchTransmit = null;
    }

    add(config)
    {
        const tab = new Tab(config, this);

        this.container.appendChild(tab.button);
        this.Tabs[config.id] = tab;
    }

    get(id)
    {
        if (typeof this.Tabs[id] == 'undefined') {
            return null;
        }

        return this.Tabs[id];
    }

    bindLayers(Layers)
    {
        this.Layers = Layers;
    }

    isLayersBonded()
    {
        return this.Layers !== null;
    }
}