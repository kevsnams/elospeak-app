import '@simonwep/pickr/dist/themes/nano.min.css';

import Pickr from '@simonwep/pickr';
import ToolButton from './ToolButton';

/**
 * Import Shapes
 */
import ShapeCircle from './Shape/Circle';
import ShapeRectangle from './Shape/Rectangle';
import ShapeSquare from './Shape/Square';
import ShapeStar from './Shape/Star';

export default class Shapes extends ToolButton {
    constructor(button, canvas)
    {
        super('shapes', button);

        this.addControlContent(
            `
            <div class="uk-grid" uk-grid>
                <div class="uk-width-expand@m">
                    <span class="divider">SHAPES</span>
                    <div id="shapes-list" class="tools"></div>
                </div>
                <div class="uk-width-auto@m">
                    <span class="divider">COLOR</span>
                    <div id="shapes-pickr"></div>
                </div>
            </div>
            `
        );

        this.color = '#000000';
        this.shapes = [
            new ShapeCircle(canvas),
            new ShapeRectangle(canvas),
            new ShapeSquare(canvas),
            new ShapeStar(canvas)
        ];

        const pickr = Pickr.create({
            el: '#shapes-pickr',
            theme: 'nano',

            default: this.getColor(),

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

        pickr.on('save', (color, instance) => {
            this.setColor(color.toRGBA().toString());
            pickr.hide();
        });
    }

    setColor(color)
    {
        this.color = color;

        return this;
    }

    getColor()
    {
        return this.color;
    }
}