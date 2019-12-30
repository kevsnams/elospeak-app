import '@simonwep/pickr/dist/themes/nano.min.css';

import Pickr from '@simonwep/pickr';
import Tool from './Tool';

export default class Select extends Tool {
    constructor(ToolBox)
    {
        super('select', ToolBox);

        this.setContent(`
            <div class="uk-grid" uk-grid id="edit-shape-box">
                <div class="uk-width-auto@m">
                    <span class="divider">EDIT COLOR</span>
                    <div id="shapes-edit-pickr"></div>
                </div>
                <div class="uk-width-expand@m">
                    <span class="divider">DELETE SHAPE</span>
                    <div class="tools">
                        <a href="#" class="tool-button" id="delete-shape">Delete</a>
                    </div>
                </div>
            </div>
        `);

        this.colorValue = '#000000';
        this.editBox = this.content.querySelector('#edit-shape-box');
        this.deleteShapeButton = this.content.querySelector('#delete-shape');

        const colorPicker = Pickr.create({
            el: '#shapes-edit-pickr',
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

        this.Pickr = colorPicker;

        this.hideEditBox();
    }

    color(color = null)
    {
        if (color === null) {
            return this.colorValue;
        }

        this.colorValue = color;
    }

    hideEditBox()
    {
        this.editBox.style.visibility = 'hidden';
    }

    showEditBox()
    {
        this.editBox.style.visibility = 'visible';
    }
}