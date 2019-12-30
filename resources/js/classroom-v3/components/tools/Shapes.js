import '@simonwep/pickr/dist/themes/nano.min.css';

import _ from 'underscore';
import Pickr from '@simonwep/pickr';
import Tool from './Tool';

import Circle from './shapes/Circle';
import Square from './shapes/Square';
import Rectangle from './shapes/Rectangle';
import Star from './shapes/Star';

export default class Shapes extends Tool {
    constructor(ToolBox)
    {
        super('shapes', ToolBox);

        this.colorValue = '#000000';
        this.setContent(`
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
        `);

        const colorPicker = Pickr.create({
            el: '#shapes-pickr',
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
            this.color(color.toRGBA().toString());
            colorPicker.hide();
        });

        this.Pickr = colorPicker;

        this.shapesList = this.content.querySelector('#shapes-list');

        this.ShapesDef = {
            Circle: new Circle(this),
            Square: new Square(this),
            Rectangle: new Rectangle(this),
            Star: new Star(this)
        };

        _.each(this.ShapesDef, (shape) => {
            this.shapesList.appendChild(shape.button);
        });
    }

    all()
    {
        return this.ShapesDef;
    }

    color(color = null)
    {
        if (color === null) {
            return this.colorValue;
        }

        this.colorValue = color;
    }
}