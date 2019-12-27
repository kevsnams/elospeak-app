import Users from '../Users';
import ClassroomInfo from '../ClassroomInfo';
import Echo from 'laravel-echo';
import Chat from '../Components/Chat';


class DataTransmitter {
    constructor()
    {
        this.Pusher = require('pusher-js');
        this.Echo = new Echo({
            authEndpoint : process.env.MIX_PUSHER_AUTH_ENDPOINT +'/broadcasting/auth',
            devMode: true,
            broadcaster: 'pusher',
            key: process.env.MIX_PUSHER_APP_KEY,
            cluster: process.env.MIX_PUSHER_APP_CLUSTER,
            //encrypted: true
            wsHost: window.location.hostname,
            wsPort: 6001
        });
    }

    start()
    {
        this.Echo.private(ClassroomInfo.channel).listen('NewChat', (chat) => {
            if (Users.current.user_type !== chat.from) {
                Chat.printMessage(chat.message, true);
            }
        });
    }

    send(data, isDebounce = false)
    {
        if (Users.current.user_type === 'teacher') {
            if (isDebounce) {
                if (typeof window.__sendEventData === 'undefined') {
                    window.__sendEventData = _.debounce((_data) => {
                        this.Echo.private(ClassroomInfo.channel).whisper('draw', _data);
                    }, 100);
                }

                window.__sendEventData(data);
            } else {
                this.Echo.private(ClassroomInfo.channel).whisper('draw', data);
            }
        }
    }
}

const ELOSpeakDataTransmitter = new DataTransmitter();

export default ELOSpeakDataTransmitter;