export default class DrawMode {
    constructor()
    {
        /**
         * @var modes The allowed modes
         */
        this.modes = ['brush', 'eraser', 'shapes', 'select'];

        /**
         * @var using The current mode
         */
        this.using = 'brush';

        /**
         * @var isPainting A flag used to determine if the current mode is 'source-over' or 'destination-out'. Basically, 'brush' or 'eraser' modes respectively.
         */
        this.isPainting = false;

        /**
         * @var paintingModes The painting modes
         */
        this.paintingModes = ['brush', 'eraser'];
    }

    /**
     * Sets the current mode
     * 
     * @param {*} mode String The mode to set
     * @returns this
     */
    set(mode)
    {
        if (this.modes.indexOf(mode) >= 0) {
            this.using = mode;
        }

        return this;
    }

    /**
     * Gets the current mode
     * 
     * @returns String
     */
    get()
    {
        return this.using;
    }

    /**
     * Determines if the current mode is a painting mode
     * 
     * @returns this
     */
    isPaintingMode()
    {
        return this.paintingModes.indexOf(this.get()) >= 0;
    }

    doPaintMode()
    {
        this.isPainting = true;
    }

    undoPaintMode()
    {
        this.isPainting = false;
    }

    getPaintOperation()
    {
        if (this.get() === 'brush') {
            return 'source-over';
        }

        if (this.get() === 'eraser') {
            return 'destination-out';
        }

        return null;
    }
}