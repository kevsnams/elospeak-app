export default class Layers {
    constructor()
    {
        /**
         * @var layers The container for all the layers
         */
        this.layers = {};

        /**
         * @var using The id of the current layer being used
         */
        this.using = null;

        /**
         * @var stage The current stage being used
         */
        this.stage = null;
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
    set(id, value)
    {
        this.layers[id] = value;
        this.stage.add(value);

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
                layer.show();
                layer.draw();
            }
        });

        return this;
    }

    /**
     * Removes a layer
     * 
     * @param {*} id Integer The layer ID to remove
     * @returns this
     */
    remove(id)
    {
        // Destroy the layer node
        this.layers[id].destroy();

        // Delete the element on layers array
        delete this.layers[id];

        // Get the last id after deleting
        const last = _.last(_.keys(this.layers));
        
        // Use the the last layer
        this.use(last);

        // Draw the last layer to update canvas
        this.get(last).draw();

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

    setStage(stage)
    {
        this.stage = stage;

        return this;
    }

    getStage()
    {
        return this.stage;
    }
}