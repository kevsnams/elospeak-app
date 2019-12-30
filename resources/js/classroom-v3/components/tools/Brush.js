import '@simonwep/pickr/dist/themes/nano.min.css';

import Pickr from '@simonwep/pickr';
import Tool from './Tool';

export default class Brush extends Tool {
    constructor(ToolBox)
    {
        super('brush', ToolBox);

        this.minSize = 5;
        this.maxSize = 20;
        this.sizeValue = this.minSize;

        this.colorValue = '#000000';

        this.isPainting = false;

        this.setContent(`
            <span class="divider">BRUSH SIZE</span>
            <input type="range" id="brush-size" min="${this.minSize}" max="${this.maxSize}" value="${this.size()}" class="uk-range brush-size">
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
        `);
        
        const dot = this.content.querySelector('#brush-preview .dot');
        const sizer = this.content.querySelector('#brush-size');

        sizer.addEventListener('input', (evt) => {
            dot.style.width = sizer.value +'px';
            dot.style.height = sizer.value +'px';

            this.size(parseInt(sizer.value));
        });

        this.sizer = sizer;

        const colorPicker = Pickr.create({
            el: document.getElementById('brush-pickr'),
            theme: 'nano',

            default: this.color(),

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

        colorPicker.on('save', (color, instance) => {
            dot.style.backgroundColor = color.toRGBA().toString();
            this.color(color.toRGBA().toString());
            colorPicker.hide();
        });

        this.Pickr = colorPicker;
    }

    color(color = null)
    {
        if (color === null) {
            return this.colorValue;
        }
        
        this.colorValue = color;
    }

    size(size = null)
    {
        if (size === null) {
            return this.sizeValue;
        }

        this.sizeValue = size;
    }
}