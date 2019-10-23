import Konva from 'konva';
import _ from 'underscore';
import Tabs from './Tabs';

const Layers = (function() {
    const _layers = Symbol();
    const _current = Symbol();
    const _stage = Symbol();

    class Layers {
        constructor(stage) {
            this[_layers] = {};
            this[_current] = null;
            this[_stage] = stage;

            this.tabs = new Tabs();
        }

        create(id, label, instantShow = true) {
            this[_layers][id] = new Konva.Layer({
                id: id
            });
            this[_current] = id;
            this[_stage].add(this[_layers][id]);

            this.tabs.add(id, label);

            if (instantShow) {
                this.show(id);
            }
        }

        current() {
            return {
                layer: this[_layers][this[_current]],
                index: this[_current]
            };
        }

        get(id) {
            return this[_layers][id];
        }

        show(id) {
            _.each(this.layers, (layer, key) => {
                if (key === id) {
                    this[_current] = id;
                    layer.show();
                } else {
                    layer.hide();
                }
            });
        }

        remove(id) {
            let newCurrent;
            const keys = _.keys(this[_layers]);

            if (keys.length === 1) {
                return;
            }

            let key = keys.indexOf(id);

            if (typeof keys[key - 1] !== 'undefined') {
                newCurrent = keys[key - 1];
            } else if (typeof keys[key + 1] !== 'undefined') {
                newCurrent = keys[key + 1];
            } else {
                newCurrent = null;
            }

            let node = this.current().layer.id(id);
            node.destroy();

            this.show(newCurrent);

            this[_current] = newCurrent;
            delete this[_layers][id];

            this.current().layer.draw();

            this.tabs.setActive(newCurrent);
            this.tabs.removeTab(id);
        }

        get layers() { return this[_layers]; }
    }

    return Layers;
}());

export default Layers;