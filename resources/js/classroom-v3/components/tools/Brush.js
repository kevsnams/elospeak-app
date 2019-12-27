import '@simonwep/pickr/dist/themes/nano.min.css';

import Pickr from '@simonwep/pickr';
import Tool from './Tool';

export default class Brush extends Tool {
    constructor(ToolBox)
    {
        super(ToolBox);

        this.name = 'brush';
        this.button = this.ToolBox.wrapper.querySelector(`[data-tool="${this.name}"]`);

        this.minSize = 5;
        this.maxSize = 20;
        this.sizeValue = this.minSize;

        this.colorValue = '#000000';

        this.isPainting = false;

        this.content = document.createElement('div');
        this.content.setAttribute('data-tool-content', this.name);
        this.content.style.display = 'none';
        this.content.innerHTML = `
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
        `;

        this.ToolBox.controls.appendChild(this.content);

        const dot = this.content.querySelector('.dot');
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

    use()
    {
        this.ToolBox.tools.forEach((tool) => {
            tool.classList.remove('active');
        });

        this.button.classList.add('active');

        this.displayContent();
    }

    color(color = null)
    {
        if (color === null) {
            return this.colorValue;
        } else {
            this.colorValue = color;
        }
    }

    size(size = null)
    {
        if (size === null) {
            return this.sizeValue;
        } else {
            this.sizeValue = size;
        }
    }
}