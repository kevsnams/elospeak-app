window._ = require('underscore');

window.UIkit = require('uikit');
window.Icons = require('uikit/dist/js/uikit-icons');
window.moment = require('moment');

UIkit.use(Icons);

import Konva from 'konva';
import Echo from 'laravel-echo';

/**
 * Register Pusher
 */
window.Pusher = require('pusher-js');

/**
 * Register Echo
 */
window.Echo = new Echo({
    authEndpoint : process.env.MIX_PUSHER_AUTH_ENDPOINT +'/broadcasting/auth',
    devMode: true,
    broadcaster: 'pusher',
    key: process.env.MIX_PUSHER_APP_KEY,
    cluster: process.env.MIX_PUSHER_APP_CLUSTER,
    //encrypted: true
    wsHost: window.location.hostname,
    wsPort: 6001
});

/**
 * Register AXIOS
 */
window.axios = require('axios');

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

let token = document.head.querySelector('meta[name="csrf-token"]');

if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
}


/**
 * Import classroom modules
 */
import Layers from './Classroom-v2/Layers';
import DrawMode from './Classroom-v2/DrawMode';
import ImportImage from './Classroom-v2/ImportImage';
import Tabs from './Classroom-v2/Tabs';
import History from './Classroom-v2/History';
import Chat from './Classroom-v2/Chat';
import BoardViewer from './Classroom-v2/BoardViewer';
/**
 * Import classroom tools
 */
import Brush from './Classroom-v2/Tools/Brush';
import Eraser from './Classroom-v2/Tools/Eraser';
import Shapes from './Classroom-v2/Tools/Shapes';
import Select from './Classroom-v2/Tools/Select';

/**
 * @var ELOSpeakClassroom The global object for the whole classroom
 */
window.ELOSpeakClassroom = {};

/**
 * This function initializes the ELOSpeakClassroom object
 */
function init() {
    /**
     * The target element details
     */
    const targetElementID = 'vr-db-0';
    const targetElement = document.getElementById(targetElementID);
    const targetClientRect = targetElement.getBoundingClientRect();

    /**
     * The elements involved in toolbox
     */
    const toolbox = document.getElementById('vr-toolbox');
    const toolboxToggle = document.getElementById('toolbox-toggle');

    /**
     * The whole drawing board element
     */
    const board = document.getElementById('vr-board');

    /**
     * This function adjusts the toolbox to it's drawing board center
     */
    function adjustToolbox() {
        const dim = board.getBoundingClientRect();
        toolbox.style.left = (dim.x  + ((dim.width / 2) - (toolbox.scrollWidth / 2))) + 'px';
    }

    /**
     * Initilize the global ELOSpeakClassroom variable
     */
    ELOSpeakClassroom = {
        Layers: new Layers(),
        Stage: new Konva.Stage({
            container: targetElementID,
            width: targetClientRect.width,
            height: targetClientRect.height
        }),
        DrawMode: new DrawMode(),
        Tabs: new Tabs(),
        ImportImage: new ImportImage(),
        History: new History(),

        Tools: {
            Brush: new Brush('tool-brush'),
            Eraser: new Eraser('tool-eraser'),
            Shapes: new Shapes('tool-shapes', targetElement),
            Select: new Select('tool-select')
        },

        Chat: new Chat(),

        targetElement,
    };

    /**
     * Introduce Tabs to History
     */
    ELOSpeakClassroom.History.setTabs(ELOSpeakClassroom.Tabs);

    /**
     * Introduce Layers to History
     */
    ELOSpeakClassroom.History.setLayers(ELOSpeakClassroom.Layers);

    /**
     * Introduce Stage to History
     */
    ELOSpeakClassroom.History.setStage(ELOSpeakClassroom.Stage);

    /**
     * Introduce stage to layers
     */
    ELOSpeakClassroom.Layers.setStage(ELOSpeakClassroom.Stage);

    /**
     * Introduce layers to tabs
     */
    ELOSpeakClassroom.Tabs.setLayers(ELOSpeakClassroom.Layers);

    /**
     * Introduce History to Tabs
     */
    ELOSpeakClassroom.Tabs.setHistory(ELOSpeakClassroom.History);

    /**
     * Start off by creating a new layer. This will be the main layer
     */
    ELOSpeakClassroom.Layers.set('main', new Konva.Layer({
        id: 'main'
    })).use('main');

    /**
     * Add the newly created layer to the stage
     */
    ELOSpeakClassroom.Stage.add(ELOSpeakClassroom.Layers.get('main'));

    /**
     * Start off by selecting brush mode
     */
    ELOSpeakClassroom.DrawMode.set('brush');
    ELOSpeakClassroom.Tools.Brush.setActive();

    /**
     * Start off by creating the main tab, without close and set to active
     */
    ELOSpeakClassroom.Tabs.createTab('main', 'Main', false);

    /**
     * Register events
     */

    /**
     * Toolbox toggle button
     */
    function toggleToolbox()
    {
        const toolboxToggleIcon = document.getElementById('toolbox-toggle-icon');

        const toolboxStyles = window.getComputedStyle(toolbox);
        const toolboxHeight = parseFloat((toolboxStyles.height).replace('px', ''));

        const toolboxTogglerStyles = window.getComputedStyle(toolboxToggle);
        const togglerHeight = parseFloat((toolboxTogglerStyles.height).replace('px', '')) + 10;

        if (toolboxStyles.bottom === '0px') {
            toolbox.style.bottom = -(toolboxHeight - togglerHeight) +'px';
            toolboxToggleIcon.setAttribute('uk-icon', 'triangle-up');
        } else {
            toolbox.style.bottom = '0px';
            toolboxToggleIcon.setAttribute('uk-icon', 'triangle-down');
        }
    }

    toggleToolbox();
    toolboxToggle.addEventListener('click', (evt) => {
        evt.preventDefault();
        evt.stopPropagation();

        toggleToolbox();
    }, false);

    /**
     * [START] DRAWING EVENTS
     */
    let lastLine = null;
    ELOSpeakClassroom.Stage.on('mousedown touchstart', (evt) => {
        if (ELOSpeakClassroom.DrawMode.isPaintingMode()) {
            ELOSpeakClassroom.DrawMode.doPaintMode();
            
            const currentScale = ELOSpeakClassroom.Stage.scaleX();
            const pointerPosition = ELOSpeakClassroom.Stage.getPointerPosition();
            const mousePointTo = {
                x: pointerPosition.x / currentScale - ELOSpeakClassroom.Stage.x() / currentScale,
                y: pointerPosition.y / currentScale - ELOSpeakClassroom.Stage.y() / currentScale
            };
            const strokeWidth = ELOSpeakClassroom.DrawMode.get() === 'brush' ? ELOSpeakClassroom.Tools.Brush.getSize() : ELOSpeakClassroom.Tools.Eraser.getSize();

            lastLine = new Konva.Line({
                stroke: ELOSpeakClassroom.Tools.Brush.getColor(),
                strokeWidth,

                globalCompositeOperation: ELOSpeakClassroom.DrawMode.getPaintOperation(),
                lineCap: 'round',
                points: [mousePointTo.x, mousePointTo.y]
            });
            lastLine.id(ELOSpeakClassroom.History.createId());

            ELOSpeakClassroom.Layers.current().add(lastLine);

            sendEventData();
        }
    });

    ELOSpeakClassroom.Stage.on('mouseup touchend', (evt) => {
        if (ELOSpeakClassroom.DrawMode.isPaintingMode()) {
            ELOSpeakClassroom.DrawMode.undoPaintMode();

            ELOSpeakClassroom.History.add('new', lastLine);

            sendEventData();
        }
    });

    ELOSpeakClassroom.Stage.on('mousemove touchmove', (evt) => {
        if (ELOSpeakClassroom.DrawMode.isPaintingMode()) {
            if (!ELOSpeakClassroom.DrawMode.isPainting) {
                return;
            }

            const currentScale = ELOSpeakClassroom.Stage.scaleX();
            const pointerPosition = ELOSpeakClassroom.Stage.getPointerPosition();
            const mousePointTo = {
                x: pointerPosition.x / currentScale - ELOSpeakClassroom.Stage.x() / currentScale,
                y: pointerPosition.y / currentScale - ELOSpeakClassroom.Stage.y() / currentScale
            };
            const newPoints = lastLine.points().concat([mousePointTo.x, mousePointTo.y]);

            lastLine.points(newPoints);
            ELOSpeakClassroom.Layers.current().batchDraw();

            sendEventData();
        }
    });
    /**
     * [END] DRAWING EVENTS
     */

    
    /**
     * Toolbox adjustment to center on vr-board
     */
    adjustToolbox();
    window.addEventListener('resize', (evt) => {
        _.debounce(adjustToolbox, 200);
    }, false);

    /**
     * Make the tool buttons change the mode onclick. And change mode if selected is an image
     */
    function toggleChildrenImageDraggable() {
        const children = ELOSpeakClassroom.Layers.current().getChildren((node) => {
            return node.getClassName() === 'Image';
        });

        if (ELOSpeakClassroom.DrawMode.get() === 'select') {
            children.draggable(true);
        } else {
            children.draggable(false);
        }
    }

    function toolButtonClickEvent(evt) {
        const mode = this.getAttribute('data-tool');
        ELOSpeakClassroom.DrawMode.set(mode);

        toggleChildrenImageDraggable();
    }

    for (let key in ELOSpeakClassroom.Tools) {
        if (ELOSpeakClassroom.Tools.hasOwnProperty(key)) {
            ELOSpeakClassroom.Tools[key].button.addEventListener('click', toolButtonClickEvent, false);
        }
    }

    /**
     * Add shape event
     */
    _.each(ELOSpeakClassroom.Tools.Shapes.shapes, (shape) => {
        shape.button.addEventListener('click', (event) => {
            event.preventDefault();

            const shapeObject = shape.createShape(ELOSpeakClassroom.Stage, ELOSpeakClassroom.Tools.Shapes.getColor());
            shapeObject.id(ELOSpeakClassroom.History.createId());

            /**
             * NO RESIZE HISTORY YET
             */
            shapeObject.on('transformstart transformend', (evt) => {
                // const target = evt.type === 'transformstart' ? evt.currentTarget : evt.target;
                // ELOSpeakClassroom.History.add('resize', target, shape.shapeName);
                sendEventData();
            });

            shapeObject.on('dragstart dragend', (evt) => {
                const target = evt.type === 'dragstart' ? evt.currentTarget : evt.target;
                ELOSpeakClassroom.History.add('move', evt.currentTarget);

                sendEventData();
            });

            ELOSpeakClassroom.Layers.current().add(shapeObject);
            ELOSpeakClassroom.Layers.current().batchDraw();

            ELOSpeakClassroom.History.add('new', shapeObject);

            sendEventData();
        }, false);
    });

    /**
     * Shape select event
     */
    ELOSpeakClassroom.Stage.on('click tap', (evt) => {
        // if click on empty area - remove all transformers
        if (evt.target === ELOSpeakClassroom.Stage) {
            ELOSpeakClassroom.Stage.find('Transformer').destroy();
            ELOSpeakClassroom.Layers.current().batchDraw();

            sendEventData();

            return;
        }

        // do nothing if clicked NOT on our rectangles
        if (!evt.target.hasName('shapes')) {
            return;
        }

        // remove old transformers
        // TODO: we can skip it if current rect is already selected
        ELOSpeakClassroom.Stage.find('Transformer').destroy();

        // create new transformer
        var transformer = new Konva.Transformer();
        ELOSpeakClassroom.Layers.current().add(transformer);
        transformer.attachTo(evt.target);

        ELOSpeakClassroom.Layers.current().draw();

        sendEventData();
    });

    /**
     * Tabs events
     */
    ELOSpeakClassroom.Tabs.ul.addEventListener('click', (evt) => {
        evt.preventDefault();
        
        if (evt.target.tagName === 'LI') {
            const tabId = evt.target.getAttribute('data-tab');

            ELOSpeakClassroom.Tabs.setActive(tabId);
            ELOSpeakClassroom.Layers.use(tabId);

            sendEventData();
        }
    }, false);

    /**
     * Import images event
     */
    function imagesToKonva(pic) {
        const id = `image-${pic.image.getAttribute('data-index')}`;

        pic.kImage.id(id);

        pic.kImage.on('dragend dragstart', (evt) => {
            const target = evt.type === 'dragstart' ? evt.currentTarget : evt.target;
            ELOSpeakClassroom.History.add('move', evt.target);

            sendEventData();
        });

        ELOSpeakClassroom.Layers.set(id, new Konva.Layer({
            id
        }))
        .use(id)
        .get(id)
        .add(pic.kImage);

        ELOSpeakClassroom.Tabs.createTab(id, `Tab ${pic.image.getAttribute('data-index')}`).setActive(id);
        ELOSpeakClassroom.History.add('createtab', id);

        ELOSpeakClassroom.Layers.current().draw();
        ELOSpeakClassroom.History.add('new', pic.kImage);

        sendEventData();
    }

    function importImageEvent(evt) {
        const files = typeof evt.dataTransfer !== 'undefined' ? evt.dataTransfer.files : evt.target.files;

        ELOSpeakClassroom.ImportImage.processImages(files, (image) => {
            imagesToKonva(image);
        });

        ELOSpeakClassroom.DrawMode.set('select');
        ELOSpeakClassroom.Tools.Select.setActive();
    }

    ELOSpeakClassroom.ImportImage.fileDropZone.addEventListener('drop', importImageEvent, false);
    ELOSpeakClassroom.ImportImage.fileInput.addEventListener('change', importImageEvent, false);


    /**
     * Zoom event
     */
    const scaleBy = 2;
    const zoomValue = document.getElementById('zoom-value');
    const zoomReset = document.getElementById('zoom-reset');

    zoomReset.addEventListener('click', (evt) => {
        evt.preventDefault();

        ELOSpeakClassroom.Stage.scale({
            x: 1,
            y: 1
        });

        ELOSpeakClassroom.Stage.position({
            x: 1,
            y: 1
        });

        ELOSpeakClassroom.Stage.batchDraw();
        zoomValue.innerHTML = '100%';
    });

    ELOSpeakClassroom.Stage.on('wheel', (e) => {
        e.evt.preventDefault();
        if (e.evt.ctrlKey) {
            const oldScale = ELOSpeakClassroom.Stage.scaleX();

            const mousePointTo = {
                x: ELOSpeakClassroom.Stage.getPointerPosition().x / oldScale - ELOSpeakClassroom.Stage.x() / oldScale,
                y: ELOSpeakClassroom.Stage.getPointerPosition().y / oldScale - ELOSpeakClassroom.Stage.y() / oldScale
            };

            const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
            const scalePercent = newScale * 100;

            // Stop at less than 12.5% scale or greater than 800%
            if (scalePercent < 12.5 || scalePercent > 800) {
                return;
            }

            zoomValue.innerHTML = scalePercent +'%';
            ELOSpeakClassroom.Stage.scale({ x: newScale, y: newScale });

            const newPos = {
                x: -(mousePointTo.x - ELOSpeakClassroom.Stage.getPointerPosition().x / newScale) * newScale,
                y: -(mousePointTo.y - ELOSpeakClassroom.Stage.getPointerPosition().y / newScale) * newScale
            };

            ELOSpeakClassroom.Stage.position(newPos);
            ELOSpeakClassroom.Stage.batchDraw();

            sendEventData();
        }
    });
}

if (ELOSpeak.currentUserType === 'teacher') {
    init();
} else {
    ELOSpeakClassroom = {
        BoardViewer: new BoardViewer(),
        Chat: new Chat()
    };
}