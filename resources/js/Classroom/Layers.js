import Konva from 'konva';

const Layers = (function() {
    const _layers = Symbol();
    const _current = Symbol();

    class Layers {
        constructor() {
            this[_layers] = {};
            this[_current] = null;
        }

        create(id) {
            const layerId = 'layer-'+ id;
            this[_layers][layerId] = new Konva.Layer();

            if (this[_current] === null) {
                this[_current] = layerId;
            }
        }

        current() {
            return {
                layer: this[_layers][this[_current]],
                index: this[_current]
            };
        }

        get layers() { return this[_layers]; }
    }

    return Layers;
}());

export default Layers;