class ClassroomInfo {
    constructor()
    {
        this.channel = null;
        this.classroom = null;
    }

    setChannel(channel)
    {
        this.channel = channel;
    }

    setClassroom(classroom)
    {
        this.classroom = classroom;
    }
}

const ELOSpeakClassroomInfo = new ClassroomInfo();

export default ELOSpeakClassroomInfo;