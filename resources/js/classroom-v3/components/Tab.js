import _ from 'underscore';

export default class Tab {
    constructor(configs, TabGroup)
    {
        this.TabGroup = TabGroup;

        const defaults = {
            id: null,
            label: null,
            active: true,
            layerConfig: {},
            layerAttrs: {}
        };

        const config = _.defaults(configs, defaults);

        this.id = config.id;
        this.label = config.label;

        this.button = document.createElement('a');
        this.button.className = 'tab';
        this.button.innerText = this.label;
        this.button.setAttribute('data-tab', this.id);

        if (this.TabGroup.isLayersBonded()) {
            let params = config.layerConfig;
            params['id'] = this.id;

            this.TabGroup.Layers.create(params);
            this.TabGroup.Layers.get(this.id).setAttrs(config.layerAttrs);
        }

        if (config.active && this.TabGroup.isLayersBonded()) {
            this.setActive();
            this.TabGroup.Layers.use(this.id);
        }

        if (this.TabGroup.Components.isTeacher()) {
            this.button.addEventListener('click', (evt) => {
                evt.preventDefault();
                this.setActive();

                const id = evt.target.getAttribute('data-tab');

                if (this.TabGroup.isLayersBonded()) {
                    this.TabGroup.Layers.use(id);
                }

                if ('switchTransmit' in this.TabGroup) {
                    this.TabGroup.switchTransmit(id);
                }
            }, false);
        }
    }

    setActive()
    {
        document.querySelectorAll('[data-tab]').forEach((tab) => {
            if (tab.classList.contains('active')) {
                tab.classList.remove('active');
            }
        });

        this.button.classList.add('active');
    }
}