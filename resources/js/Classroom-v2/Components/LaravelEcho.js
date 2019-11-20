import Component from "./Component";

export default class LaravelEcho extends Component {
    constructor(Classroom)
    {
        super(Classroom);
    }

    run()
    {
        Echo.private(this.getEchoChannel()).listen('NewChat', (chat) => {
            if (this.getUsers().current.user_type !== chat.from) {
                this.getChat().printMessage(chat.message, true);
            }
        });
    }

    sendEventData(data, isDebounce = false)
    {
        if (this.getUsers().current.user_type === 'teacher') {
            if (isDebounce) {
                if (typeof window.__sendEventData === 'undefined') {
                    window.__sendEventData = _.debounce((_data) => {
                        Echo.private(this.getEchoChannel()).whisper('draw', _data);
                    }, 100);
                }

                window.__sendEventData(data);
            } else {
                Echo.private(this.getEchoChannel()).whisper('draw', data);
            }
        }
    }
}