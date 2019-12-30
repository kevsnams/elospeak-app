import Tool from './Tool';

export default class Eraser extends Tool {
    constructor(ToolBox)
    {
        super('eraser', ToolBox);

        this.minSize = 5;
        this.maxSize = 20;
        this.sizeValue = this.minSize;
        this.isPainting = false;

        this.setContent(`
            <span class="divider">ERASER SIZE</span>
            <input type="range" id="eraser-size" min="${this.minSize}" max="${this.maxSize}" value="${this.size()}" class="uk-range brush-size">
            <div class="uk-grid" uk-grid>
                <div class="uk-width-1-1">
                    <span class="divider">PREVIEW</span>
                    <div id="eraser-preview">
                        <div class="dot"></div>
                    </div>
                </div>
            </div>
        `);

        const dot = this.content.querySelector('#eraser-preview .dot');
        const sizer = this.content.querySelector('#eraser-size');

        sizer.addEventListener('input', (evt) => {
            dot.style.width = sizer.value +'px';
            dot.style.height = sizer.value +'px';

            this.size(parseInt(sizer.value));
        });

        this.sizer = sizer;
    }

    size(size = null)
    {
        if (size === null) {
            return this.sizeValue;
        }

        this.sizeValue = size;
    }
}