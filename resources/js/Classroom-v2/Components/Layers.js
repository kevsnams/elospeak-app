import Component from './Component';

export default class Layers extends Component {
    constructor(Classroom)
    {
        super(Classroom);
        
        /**
         * @var layers The container for all the layers
         */
        this.layers = {};

        /**
         * @var using The id of the current layer being used
         */
        this.using = null;

        // @TODO Instead of saying this.stage, use this.getStage()
        this.stage = this.getStage();
        

        this.MIN_STAGE_HEIGHT = 1000;

        /**
         * Start off by creating a new layer. This will be the main layer
         */
        this.set('main', new Konva.Layer({
            id: 'main'
        })).use('main');
    }

    /**
     * Returns all the layers
     * return Object
     */
    all()
    {
        return this.layers;
    }

    /**
     * Get the layer by id
     * 
     * @param {*} id String Unique Identifier
     * @return Konva.Layer
     */
    get(id)
    {
        return typeof this.layers[id] === 'undefined' ? null : this.layers[id];
    }

    /**
     * Creates a new layer
     * 
     * @param {*} id String Unique Identifier
     * @param {*} value Object Konva.Layer instance
     * @returns this
     */
    set(id, value, additionalProperties = null)
    {
        const newObject = additionalProperties === null ? value : _.extend(value, additionalProperties);

        this.layers[id] = newObject;
        this.stage.add(newObject);

        // Do not create 'main' layer as it is already created on constructor
        if (id !== 'main') {
            this.getLaravelEcho().sendEventData({
                event: 'setLayer',
                layer: newObject.toJSON(),
                additional_properties: additionalProperties
            });
        }

        return this;
    }

    /**
     * Selects which layer id to use
     * 
     * @param {*} id String Unique Identifier to use as a current Layer
     * @returns this
     */
    use(id)
    {
        this.using = id;

        _.each(this.layers, (layer) => {
            layer.hide();

            if (layer.id() === this.using) {
                try {
                    if (layer.classroom.height > this.MIN_STAGE_HEIGHT) {
                        layer.getStage().height(layer.classroom.height);
                    }
                } catch (e) {}

                layer.show();
                layer.draw();
            }
        });

        this.getLaravelEcho().sendEventData({
            event: 'useLayer',
            layer_id: id
        });

        return this;
    }

    /**
     * Removes a layer
     * 
     * @param {*} id Integer The layer ID to remove
     * @returns this
     */
    remove(id, destroy = true)
    {
        if (destroy) {
            // Destroy the layer node
            this.layers[id].destroy();

            // Delete the element on layers array
            delete this.layers[id];
        } else {
            // Just remove the node
            this.layers[id].remove();
        }

        // Get the last id after deleting
        const last = _.last(_.keys(this.layers));
        
        // Use the the last layer
        this.use(last);

        // Draw the last layer to update canvas
        this.get(last).draw();

        this.getLaravelEcho().sendEventData({
            event: 'removeLayer',
            layer_id: id,
            destroy
        });

        return this;
    }

    /**
     * Returns the current layer being used
     * 
     * @return Object Konva.Layer Instance
     */
    current()
    {
        return this.using === null ? null : this.layers[this.using];
    }
}