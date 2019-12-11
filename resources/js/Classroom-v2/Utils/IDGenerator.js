class IDGenerator {
    constructor()
    {
        this.counter = 0;
    }

    create()
    {
        const ts = +new Date();
        return `id-${this.counter}-${ts}`;
    }
}

const UtilsIDGenerator = new IDGenerator();

export default UtilsIDGenerator;