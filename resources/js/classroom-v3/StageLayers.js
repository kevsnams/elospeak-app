import _ from 'underscore';
import Konva from 'konva';

export default class StageLayers {
    constructor(Stage)
    {
        this.Stage = Stage;
        this.currentLayer = null;
        this.previous = this.currentLayer;
        this.layers = {};
    }

    create(options)
    {
        const layer = new Konva.Layer(options);
        layer.name('layers');

        this.layers[options.id] = layer;

        this.Stage.add(layer);

        return this.layers[layer];
    }

    get(id)
    {
        return this.layers[id];
    }

    use(id)
    {
        this.previous = this.currentLayer;
        this.currentLayer = id;

        _.each(this.layers, (layer) => {
            if (layer.isVisible()) {
                layer.hide();
            }

            if (layer.id() === this.currentLayer) {
                const drawingBoardHeight = layer.getAttr('drawingBoardHeight');

                if (drawingBoardHeight <= 1000) {
                    this.Stage.height(1000);
                }

                if (drawingBoardHeight > 1000) {
                    this.Stage.height(drawingBoardHeight);
                }

                layer.show();
            }
        });

        this.Stage.batchDraw();
    }

    current()
    {
        return this.layers[this.currentLayer];
    }

    delete(id)
    {
        const node = this.layers[id];

        node.destroy();

        this.use(this.previous);
    }
}