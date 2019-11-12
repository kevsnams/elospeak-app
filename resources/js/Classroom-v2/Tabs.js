import _ from 'underscore';

export default class Tabs {
    constructor()
    {
        this.container = document.getElementById('vr-tabs');

        this.ul = document.createElement('ul');
        this.container.appendChild(this.ul);

        this.layers = null;

        this.History = null;
    }

    setLayers(layers)
    {
        this.layers = layers;

        return this;
    }

    getLayers()
    {
        return this.layers;
    }

    createTab(id, label, addCloseButton = true, active = true)
    {
        const li = document.createElement('li');
        li.setAttribute('data-tab', id);
        li.innerText = label;

        if (addCloseButton) {
            li.appendChild(this.createCloseButton(id));
        }

        if (active) {
            li.className = 'active';
        }

        this.ul.appendChild(li);

        return this;
    }

    /**
     * Removes the li tab
     * 
     * @param {*} id Integer The tab id
     * @returns this
     */
    remove(id)
    {
        // Remove the li element
        _.each(this.ul.querySelectorAll('li'), (li) => {
            if (li.getAttribute('data-tab') === id) {
                li.remove();
            }
        });

        // Get the last li after removal
        const last = _.last(this.ul.querySelectorAll('li'));

        // Set the last li to active
        this.setActive(last.getAttribute('data-tab'));

        return this;
    }

    /**
     * Creates close button that will be attached to the tab
     * 
     * @param {*} id Integer The tab id
     */
    createCloseButton(id) {
        // Create the close button element
        const button = document.createElement('a');

        // Add the close button details
        button.classList.add('close');
        button.innerHTML = '<span uk-icon="icon: close; ratio: 0.8;"></span>';
        button.setAttribute('data-tab-close', id);

        // Close button event
        button.addEventListener('click', (evt) => {
            evt.preventDefault();
            let target = evt.target, found;

            // Find anchor link
            while (target && !(found = target.tagName === 'A')) {
                target = target.parentElement;
            }

            if (found) {
                const tabId = target.getAttribute('data-tab-close');

                // Remove the layer
                this.getLayers().remove(tabId);

                // Then, remove the tab
                this.remove(tabId);
            }
        }, false);

        return button;
    }

    /**
     * Sets the tab as active/Highlights the tab
     * 
     * @param {*} id Integer The id of the tab which we want to set as active (highlight)
     * @returns this
     */
    setActive(id)
    {
        _.each(this.ul.querySelectorAll('li'), (e) => {
            e.classList.remove('active');

            if (e.getAttribute('data-tab') === id) {
                e.classList.add('active');
            }
        });

        return this;
    }

    setHistory(History)
    {
        this.History = History;
    }

    getHistory()
    {
        return this.History;
    }
}