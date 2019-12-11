import _ from 'underscore';
import Konva from 'konva';

import KonvaStage from './KonvaStage';

const MIN_STAGE_HEIGHT = 1000;

class Layers {
    constructor()
    {
        this.layers = {};
        this.using = null;

        this.start();
    }

    start()
    {
        /**
         * Start off by creating a new layer. This will be the main layer
         */
        this.set('main', new Konva.Layer({
            id: 'main'
        }));

        this.use('main');
    }

    set(id, KonvaLayer, additionalProperties = {})
    {
        KonvaLayer = _.extend(KonvaLayer, additionalProperties);
        this.layers[id] = KonvaLayer;

        KonvaStage.Stage.add(KonvaLayer);

        // @TODO Send event emitter
        if (id !== 'main') {

        }
    }

    get(id)
    {
        return typeof this.layers[id] === 'undefined' ? null : this.layers[id];
    }

    use(id)
    {
        this.using = id;

        _.each(this.layers, (layer) => {
            layer.hide();

            if (layer.id() === this.using) {
                try {
                    if (layer.classroom.height > MIN_STAGE_HEIGHT) {
                        layer.getStage().height(layer.classroom.height);
                    }
                } catch (e) {}

                layer.show();
                layer.draw();
            }
        });
    }

    remove(id, destroy = true)
    {
        if (destroy) {
            // Destroy the layer node
            this.layers[id].destroy();
        } else {
            // Just remove the node
            this.layers[id].remove();
        }

        // Delete the element on layers array
        delete this.layers[id];

        // Get the last id after deleting
        const last = _.last(_.keys(this.layers));

        // Use the the last layer
        this.use(last);

        // Draw the last layer to update canvas
        this.get(last).draw();

        // @TODO Send event emitter
    }

    current()
    {
        return this.get(this.using);
    }
}

const ClassroomLayers = new Layers();

export default ClassroomLayers;