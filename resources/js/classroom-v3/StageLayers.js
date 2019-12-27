import _ from 'underscore';
import Konva from 'konva';

export default class StageLayers {
    constructor(Stage)
    {
        this.Stage = Stage;
        this.current = 'main';
        this.previous = this.current;
        this.layers = {};

        this.create({
            id: this.current
        });

        this.use(this.current);
    }

    create(options)
    {
        this.layers[options.id] = new Konva.Layer(options);

        this.Stage.add(this.layers[options.id]);

        return this.layers[options.id];
    }

    get(id)
    {
        return this.layers[id];
    }

    use(id)
    {
        this.previous = this.current;
        this.current = id;

        _.each(this.layers, (layer) => {
            if (layer.isVisible()) {
                layer.hide();
            }

            if (layer.id() === this.current) {
                layer.show();
                layer.getStage().height(layer.height());
            }
        });

        this.Stage.batchDraw();

        return this.layers[this.current];
    }

    current()
    {
        return this.layers[this.current];
    }

    delete(id)
    {
        const node = this.layers[id];

        node.destroy();

        this.use(this.previous).draw();
    }
}