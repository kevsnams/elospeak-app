import _ from 'underscore';
import Layers from '../Layers';
import History from '../History';
import Tab from './Tabs/Tab';

class Tabs {
    constructor()
    {
        this.container = document.getElementById('vr-tabs');

        this.tabs = [];

        this.ul = document.createElement('ul');
        this.container.appendChild(this.ul);
    }

    start()
    {
        /**
         * Start off by creating the main tab, without close and set to active
         */
        this.create('main', 'Main', false);
    }

    create(id, label, addCloseButton = true, active = true)
    {
        const tab = new Tab(id, label, {
            closeButton: addCloseButton,
            active,

            onClick: (evt) => {
                evt.preventDefault();

                let target = evt.target, found;

                const previousTab = this.getActive();

                // Find anchor link
                while (target && !(found = target.tagName === 'LI')) {
                    target = target.parentElement;
                }

                if (found) {
                    const tabId = target.getAttribute('data-tab');

                    this.get(tabId).setActive();
                    Layers.use(tabId);

                    History.add('tabSwitch', {
                        from: previousTab.getAttribute('data-tab'),
                        to: tabId
                    });
                }
            },

            onClose: (evt) => {
                evt.preventDefault();

                let target = evt.target, found;

                // Find anchor link
                while (target && !(found = target.tagName === 'A')) {
                    target = target.parentElement;
                }

                if (found) {
                    const tabId = target.getAttribute('data-tab-close');
                    
                    Layers.remove(tabId, false);
                    this.remove(tabId);

                    Layers.current().draw();
                }
            }
        });

        this.ul.appendChild(tab.element);
        this.tabs.push(tab);
        
        return tab;
    }

    /**
     * Removes the li tab
     * 
     * @param {*} id Integer The tab id
     * @returns this
     */
    remove(id, setActiveLast = true)
    {
        _.each(this.tabs, (tab, index) => {
            if (tab.id === id) {
                tab.removeElement();

                this.tabs[index] = null;
            }
        });

        this.tabs = this.tabs.filter((tab) => {
            return tab !== null;
        });

        if (setActiveLast) {
            const last = _.last(this.tabs);
            last.setActive();
        }
    }

    getActive()
    {
        return _.find(this.ul.querySelectorAll('li'), (li) => {
            return li.className === 'active';
        });
    }

    get(id)
    {
        return _.find(this.tabs, (tab) => {
            return tab.id === id;
        });
    }
}

const ClassroomTabs = new Tabs();

export default ClassroomTabs;