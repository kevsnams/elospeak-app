window.UIkit = require('uikit');
window.Icons = require('uikit/dist/js/uikit-icons');
UIkit.use(Icons);

import Konva from 'konva';
import axios from 'axios';

import InitLoader from './classroom-v3/InitLoader';
import ComponentsBuilder from './classroom-v3/ComponentsBuilder';
import Chat from './classroom-v3/Chat';
import StageLayers from './classroom-v3/StageLayers';

(async function () {
    const container = document.getElementById('classroom');
    const init = new InitLoader(container);

    let ClassroomInfo, Users, Components, ChatChannel, ChatHandler, Stage, Layers;

    async function fetchClassroomInfo()
    {
        try {
            const fetcher = await axios.post(url('/classroom/info'), {
                id: 381
            });

            return [fetcher.data.classroom, fetcher.data.users, fetcher.data.channel];
        } catch (error) {
            console.log(error);
        }
    }

    async function fetchChatMessages()
    {
        try {
            const fetcher = await axios.post(url('/classroom/chat/load'), {
                id: 381
            });

            return fetcher.data;
        } catch (error) {
            console.log(error);
        }
    }

    async function initialize()
    {
        init.start();

        // Fetch classroom information
        init.setSubheaderText('Fetching classroom information...');
        [ClassroomInfo, Users, ChatChannel] = await fetchClassroomInfo();

        // Start building HTML elements
        init.setSubheaderText('Building components...');
        Components = new ComponentsBuilder(container, Users.current);

        // Start chatroom
        init.setSubheaderText('Fetching chat messages...');
        const previousChats = await fetchChatMessages();

        ChatHandler = new Chat({
            messages: previousChats,
            chatBox: Components.chatBox,
            textarea: Components.chatSendMessage,
            channel: ChatChannel,
            classroom: ClassroomInfo
        }, Users.current);

        init.end();
    }

    await initialize();

    // Start Konva.Stage
    let dimensions = Components.drawingBoard.getBoundingClientRect();
    Stage = new Konva.Stage({
        container: Components.drawingBoard.getAttribute('id'),
        width: dimensions.width,
        height: dimensions.height
    });

    Layers = new StageLayers(Stage);

    window.__DebugELO = {
        ClassroomInfo,
        Users,
        Components
    };
})();