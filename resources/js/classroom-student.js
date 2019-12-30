window.UIkit = require('uikit');
window.Icons = require('uikit/dist/js/uikit-icons');
UIkit.use(Icons);

import Echo from 'laravel-echo';
window.Pusher = require('pusher-js');

import _ from 'underscore';
import Konva from 'konva';
import axios from 'axios';

import InitLoader from './classroom-v3/InitLoader';
import ComponentsBuilder from './classroom-v3/ComponentsBuilder';
import Chat from './classroom-v3/Chat';
import StageLayers from './classroom-v3/StageLayers';

import {fetchClassroomInfo, fetchChatMessages} from './classroom-v3/functions/fetchers';

(async function () {
    const container = document.getElementById('classroom');
    const init = new InitLoader(container);

    let ClassroomInfo, Users, Components, ChatChannel, ChatHandler, Stage, Layers, LaravelEcho;

    async function initialize()
    {
        init.start();
        
        // Fetch classroom information
        init.setSubheaderText('Fetching classroom information...');
        [ClassroomInfo, Users, ChatChannel] = await fetchClassroomInfo(window.ELOSpeakClassroomID);

        // Start building HTML elements
        init.setSubheaderText('Building components...');
        Components = new ComponentsBuilder(container, Users);

        // Start chatroom
        init.setSubheaderText('Fetching chat messages...');
        const previousChats = await fetchChatMessages(window.ELOSpeakClassroomID);

        ChatHandler = new Chat({
            messages: previousChats,
            chatBox: Components.chatBox,
            textarea: Components.chatSendMessage,
            channel: ChatChannel,
            classroom: ClassroomInfo
        }, Users.current);

        // Start chat server
        init.setSubheaderText('Setting up chat server...');
        LaravelEcho = new Echo({
            authEndpoint : process.env.MIX_PUSHER_AUTH_ENDPOINT +'/broadcasting/auth',
            devMode: true,
            broadcaster: 'pusher',
            key: process.env.MIX_PUSHER_APP_KEY,
            cluster: process.env.MIX_PUSHER_APP_CLUSTER,
            //encrypted: true
            wsHost: window.location.hostname,
            wsPort: 6001
        });

        LaravelEcho.private(ChatChannel).listen('NewChat', (chat) => {
            if (Users.current.user_type !== chat.from) {
                ChatHandler.display(chat.message, true);
            }
        });

        init.end();
    }

    await initialize();

    // Start Konva.Stage
    let dimensions = Components.drawingBoard.getBoundingClientRect();
    Stage = new Konva.Stage({
        container: Components.drawingBoard,
        width: dimensions.width,
        height: dimensions.height
    });

    Layers = new StageLayers(Stage);
    Components.TabGroup.bindLayers(Layers);

    /**
     * Create the first tab, which is 'main'
     */
    Components.TabGroup.add({
        id: 'main',
        label: 'Main'
    });
})();