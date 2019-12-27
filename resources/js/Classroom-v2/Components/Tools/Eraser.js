import ToolButton from "./ToolButton";

export default class Eraser extends ToolButton {
    constructor(button)
    {
        super('eraser', button);

        this.size = 5;

        this.minSize = 1;
        this.maxSize = 20;

        this.addControlContent(
            `
            <span class="divider">ERASER SIZE</span>
            <input type="range" id="eraser-size" min="${this.minSize}" max="${this.maxSize}" value="${this.size}" class="uk-range eraser-size">
            <div>
                <span class="divider">PREVIEW</span>
                <div id="eraser-preview">
                    <div class="dot"></div>
                </div>
            </div>
            `
        );

        const preview = document.getElementById('eraser-preview');
        const dot = preview.querySelector('.dot');
        const sizer = document.getElementById('eraser-size');
        
        sizer.addEventListener('input', (evt) => {
            dot.style.width = sizer.value +'px';
            dot.style.height = sizer.value +'px';

            this.setSize(parseInt(sizer.value));
        });
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