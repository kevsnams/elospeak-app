import Component from './Component';

export default class History extends Component {
    constructor(Classroom)
    {
        super(Classroom);

        this.actions = [];
        this.current = null;

        this.counter = 0;

        this.unusedLayers = {};

        this.buttonUndo = document.getElementById('history-undo');
        this.buttonRedo = document.getElementById('history-redo');

        this.buttonUndo.addEventListener('click', (evt) => {
            evt.preventDefault();
            this.back();
        });

        this.buttonRedo.addEventListener('click', (evt) => {
            evt.preventDefault();
            this.forward();
        });

        /**
         * Ctrl + Z and Ctrl + Y events
         */
        document.addEventListener('keydown', (evt) => {
            var evtObj = window.event ? event : evt;

            if (evtObj.keyCode === 90 && evtObj.ctrlKey) {
                this.back();
            }

            if (evtObj.keyCode === 89 && evtObj.ctrlKey) {
                this.forward();
            }
        });
    }

    add(action, target)
    {
        let value = null;
        /**
         * Separate switch tab because it will contain a different value
         */
        if (action === 'createtab') {
            value = {
                action,
                target,
            };
        } else if (action === 'move' || action === 'new') {
            /**
             * Other actions will have the same values
             */
            value = {
                action,
                target,
                layer: target.getLayer(),
                params: {}
            };

            switch (action) {
                case 'move':
                    value.params = {
                        x: target.x(),
                        y: target.y()
                    };
                break;

                case 'resize':
                    // Continue later: Resize history for shapes - figure out a way to deal with transformers
                    // knowing that for every shape has different dimensions. FOr example, squares deal with width and height
                    // while circles deal with radius
                break;
            }
        }

        // If on blank state, which is null,
        if (this.current === null) {
            // then set the current to first value which is 0
            this.current = 0;

            // Reset the actions
            this.actions = [];

            // Add the value to actions
            this.actions.push(value);
        } else {
            // Move the current by 1
            this.current++;

            // Add the value to actions
            this.actions.push(value);

            // If the current is moved, splice this.actions so it will override other actions
            if (this.current < this.actions.length - 1) {
                this.actions.splice(this.current);

                // Re-add the action
                this.actions.push(value);

                // Update the current
                this.current = this.actions.length - 1;
            }
        }
    }

    back()
    {
        if (this.current === null) {
            return;
        }

        let current = this.actions[this.current];

        if (current.action === 'new') {
            this.getTabs().setActive(current.layer.id());
            this.getLayers().use(current.layer.id());

            current.target.remove();
            current.layer.draw();
        } else if (current.action === 'move') {
            this.getTabs().setActive(current.layer.id());
            this.getLayers().use(current.layer.id());

            this.current--;
            current = this.actions[this.current];

            current.target.x(current.params.x);
            current.target.y(current.params.y);

            current.layer.draw();
        } else if (current.action === 'resize') {
            // TBD
        } else if (current.action === 'createtab') {
            this.getTabs().setActive(current.target);
            this.getLayers().use(current.target);

            this.getTabs().remove(current.target);
            
            const nodeLayer = this.getLayers().get(current.target);

            this.unusedLayers[current.target] = nodeLayer;
            nodeLayer.remove();

            const allKeys = _.keys(this.getLayers().all());
            const index = _.indexOf(allKeys, current.target);

            if (index - 1 >= 0) {
                const prevLayerKey = allKeys[index - 1];
                this.getLayers().use(prevLayerKey);
            }
        }

        this.current--;

        if (this.current < 0) {
            this.current = null;
        }
    }

    forward()
    {
        if (this.current === null) {
            this.current = 0;
        } else {
            this.current++;
        }

        if (this.current + 1 > this.actions.length) {
            this.current = this.actions.length - 1;
            return;
        }

        let current = this.actions[this.current];

        if (current.action === 'new') {
            this.getTabs().setActive(current.layer.id());
            this.getLayers().use(current.layer.id());

            current.layer.add(current.target);
            current.layer.draw();
        } else if (current.action === 'move') {
            this.getTabs().setActive(current.layer.id());
            this.getLayers().use(current.layer.id());

            this.current++;
            current = this.actions[this.current];

            current.target.x(current.params.x);
            current.target.y(current.params.y);

            current.layer.draw();
        } else if (current.action === 'resize') {
            // TBD
        } else if (current.action === 'createtab') {
            this.getTabs().setActive(current.target);
            this.getLayers().use(current.target);

            let chunks = current.target.split('-');

            this.getTabs().createTab(current.target, `Tab ${chunks[1]}`).setActive(current.target);
            this.getStage().add(this.unusedLayers[current.target]);
            this.getLayers().use(current.target);
        }
    }
    
    createId()
    {
        this.counter++;

        return `history-${this.counter}-${Date.now()}`;
    }
}