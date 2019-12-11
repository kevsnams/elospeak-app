import '@simonwep/pickr/dist/themes/nano.min.css';

import ToolButton from './ToolButton';
import Pickr from '@simonwep/pickr';

import Tools from '../Tools';
import DrawMode from '../DrawMode';


import Layers from '../../Layers';
import KonvaStage from '../../KonvaStage';
import Users from '../../Users';
import History from '../../History';

import IDGenerator from '../../Utils/IDGenerator';

export default class Brush extends ToolButton {
    constructor(button)
    {
        super('brush', button);
        
        this.size = 5;
        this.color = '#000000';
        this.minSize = 1;
        this.maxSize = 20;

        this.addControlContent(
            `
            <span class="divider">BRUSH SIZE</span>
            <input type="range" id="brush-size" min="${this.minSize}" max="${this.maxSize}" value="${this.size}" class="uk-range brush-size">
            <div class="uk-grid" uk-grid>
                <div class="uk-width-1-2">
                    <span class="divider">COLOR</span>
                    <div id="brush-pickr"></div>
                </div>
                <div class="uk-width-1-2">
                    <span class="divider">PREVIEW</span>
                    <div id="brush-preview">
                        <div class="dot"></div>
                    </div>
                </div>
            </div>
            `
        );

        const pickr = Pickr.create({
            el: '#brush-pickr',
            theme: 'nano',

            default: this.color,

            components: {
                // Main components
                preview: true,
                opacity: false,
                hue: true,
        
                // Input / output Options
                interaction: {
                    cancel: true,
                    save: true
                }
            }
        });

        const preview = document.getElementById('brush-preview');
        const dot = preview.querySelector('.dot');
        pickr.on('save', (color, instance) => {
            dot.style.backgroundColor = color.toRGBA().toString();
            this.setColor(color.toRGBA().toString());
            pickr.hide();
        });

        const sizer = document.getElementById('brush-size');
        sizer.addEventListener('input', (evt) => {
            dot.style.width = sizer.value +'px';
            dot.style.height = sizer.value +'px';

            this.setSize(parseInt(sizer.value));
        });

        if (Users.current.user_type === 'teacher') {
            this.registerDrawingEvents();
        }
    }

    registerDrawingEvents()
    {
        let lastLine = null;
        KonvaStage.Stage.on('mousedown touchstart', (evt) => {
            if (DrawMode.isPaintingMode() && evt.evt.button !== 2) {
                DrawMode.doPaintMode();
                
                const currentScale = KonvaStage.Stage.scaleX();
                const pointerPosition = KonvaStage.Stage.getPointerPosition();
                const mousePointTo = {
                    x: pointerPosition.x / currentScale - KonvaStage.Stage.x() / currentScale,
                    y: pointerPosition.y / currentScale - KonvaStage.Stage.y() / currentScale
                };
                const strokeWidth = DrawMode.get() === 'brush' ? Tools.Brush.getSize() : Tools.Eraser.getSize();

                lastLine = new Konva.Line({
                    stroke: Tools.Brush.getColor(),
                    strokeWidth,

                    globalCompositeOperation: DrawMode.getPaintOperation(),
                    lineCap: 'round',
                    points: [mousePointTo.x, mousePointTo.y]
                });
                lastLine.id(IDGenerator.create());

                Layers.current().add(lastLine);
            }
        });

        KonvaStage.Stage.on('mouseup touchend', (evt) => {
            if (DrawMode.isPaintingMode()) {
                DrawMode.undoPaintMode();

                History.add('new', {
                    node: lastLine,
                    layer_id: Layers.current().id()
                });
            }
        });

        KonvaStage.Stage.on('mousemove touchmove', (evt) => {
            if (DrawMode.isPaintingMode()) {
                if (!DrawMode.isPainting) {
                    return;
                }

                const currentScale = KonvaStage.Stage.scaleX();
                const pointerPosition = KonvaStage.Stage.getPointerPosition();
                const mousePointTo = {
                    x: pointerPosition.x / currentScale - KonvaStage.Stage.x() / currentScale,
                    y: pointerPosition.y / currentScale - KonvaStage.Stage.y() / currentScale
                };
                const newPoints = lastLine.points().concat([mousePointTo.x, mousePointTo.y]);

                lastLine.points(newPoints);
                Layers.current().batchDraw();

                /*
                this.getLaravelEcho().sendEventData({
                    event: 'newPoints',
                    points: newPoints,
                    node_id: lastLine.id(),
                    layer_id: Layers.current().id()
                }, true);
                */
            }
        });
    }

    setColor(color)
    {
        this.color = color;
    }

    getColor()
    {
        return this.color;
    }

    /**
     * Sets the brush size
     * 
     * @param {*} size Integer The brush size. Min = 1/Max = 20
     * @returns this
     */
    setSize(size)
    {
        if (size <= this.minSize) {
            this.size = this.minSize;
        } else if (size > this.maxSize) {
            this.size = this.maxSize;
        } else {
            this.size = size;
        }

        return this;
    }

    /**
     * Gets the brush size
     * 
     * @returns Integer
     */
    getSize()
    {
        return this.size;
    }
}