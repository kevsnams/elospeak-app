import _ from 'underscore';
import Konva from 'konva';

export default class StageLayers {
    constructor(Stage)
    {
        this.Stage = Stage;
        this.currentLayer = null;
        this.previous = this.currentLayer;
        this.layers = {};
        this.widthHeight = {};
    }

    create(options)
    {
        const width = options.width;
        const height = options.height;

        delete options.width;
        delete options.height;

        this.layers[options.id] = new Konva.Layer(options);
        this.widthHeight[options.id] = {width, height};

        this.Stage.add(this.layers[options.id]);

        return this.layers[options.id];
    }

    get(id)
    {
        return this.layers[id];
    }

    use(id)
    {
        this.previous = this.currentLayer;
        this.currentLayer = id;

        const widthHeight = this.widthHeight[id];

        _.each(this.layers, (layer) => {
            if (layer.isVisible()) {
                layer.hide();
            }

            if (layer.id() === this.currentLayer) {
                if (widthHeight.height) {
                    this.Stage.height(widthHeight.height);
                }

                if (widthHeight.width) {
                    this.Stage.height(widthHeight.width);
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

        this.use(this.previous).draw();
    }
}