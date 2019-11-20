export default class Component {
    constructor(Classroom)
    {
        this.Classroom = Classroom;
    }

    run() {}

    getLaravelEcho()
    {
        return this.Classroom.LaravelEcho;
    }

    getEchoChannel()
    {
        return this.Classroom.Details.channel;
    }

    getClassroomInfo()
    {
        return this.Classroom.Details.Classroom;
    }

    getUsers()
    {
        return this.Classroom.Details.Users;
    }

    getTools()
    {
        return this.Classroom.Tools.ToolSet;
    }

    getClassroom()
    {
        return this.Classroom;
    }

    getStage()
    {
        return this.Classroom.KonvaStage.getStage();
    }

    getTabs()
    {
        return this.Classroom.Tabs;
    }

    getLayers()
    {
        return this.Classroom.Layers;
    }

    getHistory()
    {
        return this.Classroom.History;
    }

    getDrawMode()
    {
        return this.Classroom.DrawMode;
    }

    getImportImage()
    {
        return this.Classroom.ImportImage;
    }

    getChat()
    {
        return this.Classroom.Chat;
    }
}