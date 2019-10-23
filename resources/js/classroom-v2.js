import _ from 'underscore';
import Konva from 'konva';

import Layers from './Classroom-v2/Layers';
import DrawMode from './Classroom-v2/DrawMode';
import ImportImage from './Classroom-v2/ImportImage';
import Tabs from './Classroom-v2/Tabs';

/**
 * Tools
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

        Tools: {
            Brush: new Brush('tool-brush'),
            Eraser: new Eraser('tool-eraser'),
            Shapes: new Shapes('tool-shapes', targetElement),
            Select: new Select('tool-select')
        },

        targetElement,
    };

    /**
     * Introduce stage to layers
     */
    ELOSpeakClassroom.Layers.setStage(ELOSpeakClassroom.Stage);

    /**
     * Introduce layers to tabs
     */
    ELOSpeakClassroom.Tabs.setLayers(ELOSpeakClassroom.Layers);

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
    toolbox.style.bottom = '-152.5px';
    toolboxToggle.addEventListener('click', (evt) => {
        evt.preventDefault();
        evt.stopPropagation();

        const style = window.getComputedStyle(toolbox);

        if (style.bottom === '0px') {
            toolbox.style.bottom = '-152.5px';
        } else {
            toolbox.style.bottom = '0px';
        }
    }, false);

    /**
     * [START] DRAWING EVENTS
     */
    let lastLine = null;
    ELOSpeakClassroom.Stage.on('mousedown touchstart', (evt) => {
        if (ELOSpeakClassroom.DrawMode.isPaintingMode()) {
            ELOSpeakClassroom.DrawMode.doPaintMode();

            const pointerPosition = ELOSpeakClassroom.Stage.getPointerPosition();
            const strokeWidth = ELOSpeakClassroom.DrawMode.get() === 'brush' ? ELOSpeakClassroom.Tools.Brush.getSize() : ELOSpeakClassroom.Tools.Eraser.getSize();

            lastLine = new Konva.Line({
                stroke: ELOSpeakClassroom.Tools.Brush.getColor(),
                strokeWidth,

                globalCompositeOperation: ELOSpeakClassroom.DrawMode.getPaintOperation(),
                lineCap: 'round',
                points: [pointerPosition.x, pointerPosition.y]
            });

            ELOSpeakClassroom.Layers.current().add(lastLine);
        }
    });

    ELOSpeakClassroom.Stage.on('mouseup touchend', (evt) => {
        if (ELOSpeakClassroom.DrawMode.isPaintingMode()) {
            ELOSpeakClassroom.DrawMode.undoPaintMode();
        }
    });

    ELOSpeakClassroom.Stage.on('mousemove touchmove', (evt) => {
        if (ELOSpeakClassroom.DrawMode.isPaintingMode()) {
            if (!ELOSpeakClassroom.DrawMode.isPainting) {
                return;
            }

            const pointerPosition = ELOSpeakClassroom.Stage.getPointerPosition();
            const newPoints = lastLine.points().concat([pointerPosition.x, pointerPosition.y]);

            lastLine.points(newPoints);
            ELOSpeakClassroom.Layers.current().batchDraw();
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

        console.log(ELOSpeakClassroom.DrawMode.get());

        if (ELOSpeakClassroom.DrawMode.get() === 'select') {
            children.draggable(true);
        } else {
            children.draggable(false);
        }
    }

    for (let key in ELOSpeakClassroom.Tools) {
        if (ELOSpeakClassroom.Tools.hasOwnProperty(key)) {
            ELOSpeakClassroom.Tools[key].button.addEventListener('click', function (evt) {
                const mode = this.getAttribute('data-tool');
                ELOSpeakClassroom.DrawMode.set(mode);

                toggleChildrenImageDraggable();
            }, false);
        }
    }

    /**
     * Add shape event
     */
    _.each(ELOSpeakClassroom.Tools.Shapes.shapes, (shape) => {
        shape.button.addEventListener('click', (evt) => {
            evt.preventDefault();

            const shapeObject = shape.createShape(ELOSpeakClassroom.Stage, ELOSpeakClassroom.Tools.Shapes.getColor());
            ELOSpeakClassroom.Layers.current().add(shapeObject);
            ELOSpeakClassroom.Layers.current().batchDraw();
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
        }
    }, false);

    /**
     * Import images event
     */
    function imagesToKonva(pic) {
        const id = `image-${pic.image.getAttribute('data-index')}`;

        ELOSpeakClassroom.Layers.set(id, new Konva.Layer({
            id
        })).use(id).get(id).add(pic.kImage);

        ELOSpeakClassroom.Layers.current().draw();
        ELOSpeakClassroom.Tabs.createTab(id, `Tab ${pic.image.getAttribute('data-index')}`).setActive(id);
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
}

init();