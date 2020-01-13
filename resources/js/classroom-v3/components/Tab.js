import _ from 'underscore';

export default class Tab {
    constructor(configs, TabGroup)
    {
        this.TabGroup = TabGroup;

        const defaults = {
            id: null,
            label: null,
            active: true,
            createLayer: true,
            layerConfig: {},
            layerAttrs: {},
            addCloseButton: true
        };

        const config = _.defaults(configs, defaults);
        this.config = config;

        this.id = config.id;
        this.label = config.label;

        this.button = document.createElement('a');
        this.button.className = 'tab';
        this.button.innerText = this.label;
        this.button.setAttribute('data-tab', this.id);

        if (config.addCloseButton) {
            this.buttonClose = document.createElement('a');
            this.buttonClose.innerHTML = '&#10006;';
            this.buttonClose.setAttribute('data-tab-close', this.id);
            this.buttonClose.className = 'tab-close';
            this.buttonClose.style.visibility = 'hidden';
            this.button.insertAdjacentElement('beforeend', this.buttonClose);
        }

        if (config.createLayer) {
            let params = config.layerConfig;
            params['id'] = this.id;

            this.TabGroup.Layers.create(params);
            this.TabGroup.Layers.get(this.id).setAttrs(config.layerAttrs);
        }

        if (config.active) {
            this.setActive();
            this.TabGroup.Layers.use(this.id);
        }

        if (this.TabGroup.Components.isTeacher()) {
            this.button.addEventListener('click', (evt) => {
                evt.stopPropagation();
                evt.preventDefault();
                console.log('fired switch');

                this.setActive();

                const id = evt.target.getAttribute('data-tab');

                this.TabGroup.Layers.use(id);

                if ('switchTransmit' in this.TabGroup) {
                    this.TabGroup.switchTransmit(id);
                }
            }, false);

            if (this.config.addCloseButton) {
                this.buttonClose.addEventListener('click', (evt) => {
                    evt.stopPropagation();
                    evt.preventDefault();

                    const id = evt.target.getAttribute('data-tab-close');

                    this.TabGroup.Layers.delete(id);
                    delete this.TabGroup.Tabs[id];

                    this.remove();

                    this.TabGroup.get(this.TabGroup.Layers.current().id()).setActive();
                    this.TabGroup.removeTransmit({
                        currentLayer: id,
                        previousLayer: this.TabGroup.Layers.current().id()
                    });
                });
            }
        }
    }

    remove()
    {
        this.button.remove();
        

        if (this.config.addCloseButton) {
            this.buttonClose.remove();
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

        document.querySelectorAll('[data-tab-close]').forEach((close) => {
            close.style.visibility = 'hidden';
        });

        if (this.config.addCloseButton) {
            this.buttonClose.style.visibility = 'visible';
        }
    }
}