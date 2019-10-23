import _ from 'underscore';

const Tabs = (function() {
    const _tabsContainer = Symbol();
    const _tabsUL = Symbol();

    class Tabs {
        constructor() {
            this[_tabsContainer] = document.getElementById('vr-tabs');

            const ul = document.createElement('ul');
            this[_tabsContainer].appendChild(ul);

            this[_tabsUL] = this[_tabsContainer].querySelector('ul');

            this[_tabsUL].addEventListener('click', (evt) => {
                evt.preventDefault();
                
                if (evt.target.tagName === 'LI') {
                    const tabId = evt.target.getAttribute('data-tab');

                    this.setActive(tabId);
                    ClassroomBoard.layers.show(tabId);
                }
            }, false);
        }

        add(id, label, active = true) {
            this[_tabsUL].appendChild(this.createTab(id, label, active));

            if (this.count() && active) {
                this.setActive(id);
            }
        }

        createTab(id, label, active) {
            const tab = document.createElement('li');
            const tabClose = this.__createCloseButton(id);

            if (active) {
                tab.classList.add('active');
            }

            tab.setAttribute('data-tab', id);
            tab.innerText = label;
            tab.appendChild(tabClose);

            return tab;
        }

        __createCloseButton(id) {
            const button = document.createElement('a');

            button.classList.add('close');
            button.innerHTML = '<span uk-icon="icon: close; ratio: 0.8;"></span>';
            button.setAttribute('data-tab-close', id);

            button.addEventListener('click', this.__closeButtonEvent, false);

            return button;
        }

        __closeButtonEvent(evt) {
            evt.preventDefault();
            evt.stopPropagation();
            let target = evt.target, found;

            // Find anchor link
            while (target && !(found = target.tagName === 'A')) {
                target = target.parentElement;
            }

            if (found) {
                const tabId = target.getAttribute('data-tab-close');
                ClassroomBoard.layers.remove(tabId);
            }
        }

        setActive(id) {
            _.each(this[_tabsUL].querySelectorAll('li'), (e) => {
                e.classList.remove('active');

                if (e.getAttribute('data-tab') === id) {
                    e.classList.add('active');
                }
            });
        }

        removeTab(id) {
            this[_tabsUL].querySelector('[data-tab="'+ id +'"]').remove();
        }

        count() {
            return this[_tabsUL].querySelectorAll('li').length;
        }
    }

    return Tabs;
}());

export default Tabs;