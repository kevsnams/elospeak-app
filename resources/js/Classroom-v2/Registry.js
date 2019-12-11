class Registry {
    constructor()
    {
        this.register = {};
    }

    set(key, value)
    {
        this.register[key] = value;
    }

    get(key)
    {
        if (typeof this.register[key] === 'undefined') {
            return null;
        }

        return this.register[key];
    }

    delete(key)
    {
        if (typeof this.register[key] === 'undefined') {
            return;
        }

        delete this.register[key];
    }
}

const ClassroomRegistry = new Registry();

export default ClassroomRegistry;