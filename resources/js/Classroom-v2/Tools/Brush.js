import '@simonwep/pickr/dist/themes/nano.min.css';

import ToolButton from './ToolButton';
import Pickr from '@simonwep/pickr';

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

        // Toolbox events
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