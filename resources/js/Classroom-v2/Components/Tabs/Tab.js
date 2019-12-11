import _ from 'underscore';

export default class Tab {
    constructor(id, label, options)
    {
        this.id = id;
        this.label = label;

        const defaults = {
            closeButton: true,
            active: true,
            onClick: function (evt) {},
            onClose: function (evt) {}
        };

        this.options = _.defaults(options, defaults);

        this.element = this.createElement();
    }

    createElement()
    {
        const li = document.createElement('li');
        li.setAttribute('data-tab', this.id);
        li.innerText = this.label;

        if (this.options.closeButton) {
            li.appendChild(this.createCloseButton());
        }

        if (this.options.active) {
            li.className = 'active';
        }

        li.addEventListener('click', this.options.onClick, false);

        return li;
    }

    createCloseButton() {
        // Create the close button element
        const button = document.createElement('a');

        // Add the close button details
        button.classList.add('close');
        button.innerHTML = '<span uk-icon="icon: close; ratio: 0.8;"></span>';
        button.setAttribute('data-tab-close', this.id);

        // Close button event
        button.addEventListener('click', this.options.onClose, false);

        return button;
    }

    removeElement()
    {
        this.element.parentElement.removeChild(this.element);
    }

    setActive()
    {
        _.each(this.element.parentNode.children, (li) => {
            li.classList.remove('active');

            if (li.getAttribute('data-tab') === this.id) {
                li.classList.add('active');
            }
        });
    }
}