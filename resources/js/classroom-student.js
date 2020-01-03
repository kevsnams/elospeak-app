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

    const dispatchDef = {
        'node_new': (data) => {
            const node = Konva.Node.create(data.node.def);
            node.id(data.node.id);

            Layers.get(data.layer).add(node);
            Layers.get(data.layer).batchDraw();
        },

        'node_points': (data) => {
            const node = Stage.find(`#${data.node.id}`);
            node.points(data.node.points);

            Layers.get(data.layer).draw();
        },

        'node_drag': (data) => {
            const node = Stage.find(`#${data.node.id}`);
            node.x(data.node.x);
            node.y(data.node.y);

            Layers.get(data.layer).draw();
        },

        'node_transform': (data) => {
            const node = Stage.find(`#${data.node.id}`);
            node.x(data.node.x);
            node.y(data.node.y);
            node.scaleX(data.node.scaleX);
            node.scaleY(data.node.scaleY);
            node.rotation(data.node.rotation);
            
            Layers.get(data.layer).draw();
        },

        'node_remove': (data) => {
            const node = Stage.find(`#${data.node.id}`);
            node.destroy();

            Layers.get(data.layer).draw();
        },

        'shape_stroke': (data) => {
            const node = Stage.find(`#${data.node.id}`);
            node.stroke(data.node.color);

            Layers.get(data.layer).draw();
        },

        'transformer_remove': (data) => {
            Stage.find('Transformer').destroy();
        },

        'transformer_new': (data) => {
            const node = Stage.find(`#${data.node.id}`);
            const transformer = new Konva.Transformer();

            Layers.get(data.layer).add(transformer);
            transformer.attachTo(node);

            Layers.get(data.layer).batchDraw();
        },

        'image_new': async (data) => {
            const fetchImageURL = await axios.post(url('/classroom/image'), {
                id: data.image.id
            });
            const imageURL = fetchImageURL.data.url;
            const imageNode = await createImage(imageURL, data);

            if (imageNode.success) {
                Components.TabGroup.add({
                    id: data.layer,
                    label: data.image.label,
                    layerAttrs: {
                        drawingBoardHeight: imageNode.image.height
                    }
                });

                Layers.get(data.layer).add(imageNode.node);
                Layers.get(data.layer).batchDraw();
            }
        },

        'tab_switch': (data) => {
            Layers.use(data.id);
            Components.TabGroup.get(data.id).setActive();
        },

        'layer_clear': (data) => {
            const deletedNodes = Layers.get(data.layer).getChildren((child) => {
                return child.getClassName() !== 'Image';
            });
    
            deletedNodes.each((node) => {
                node.destroy();
            });

            Layers.get(data.layer).batchDraw();
        },

        'scale': (data) => {
            Stage.scale(data.scale);
            Stage.position(data.position);

            Stage.batchDraw();
        }
    };

    function createImage(imageURL, data)
    {
        return new Promise((resolve, reject) => {
            const image = new Image();

            image.onerror = () => {
                reject({
                    success: false,
                    image_id: data.image.id
                });
            };

            image.onload = () => {
                const node = new Konva.Image({
                    width: image.width,
                    height: image.height,
                    x: 0,
                    y: 0,
                    draggable: true,
                    name: 'images',
                    id: data.layer
                });
                node.image(image);

                resolve({
                    success: true,
                    image,
                    node
                });
            };
    
            image.src = imageURL;
        });
    }

    function dispatcher(data)
    {
        dispatchDef[data.event](data);
    }

    LaravelEcho.private(ChatChannel).listenForWhisper('draw', (data) => {
        dispatcher(data);
    });
})();