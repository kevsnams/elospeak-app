class Users {
    constructor()
    {
        this.current = null;
        this.other = null;
    }

    setCurrent(data)
    {
        this.current = data;
    }

    setOther(data)
    {
        this.other = data;
    }
}

const ELOSpeakUsers = new Users();

export default ELOSpeakUsers;