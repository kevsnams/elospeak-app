import ToolButton from './ToolButton';
import KonvaStage from '../../KonvaStage';

import '@simonwep/pickr/dist/themes/nano.min.css';
import Pickr from '@simonwep/pickr';

import Layers from '../../Layers';
import CopyPasta from '../CopyPasta';

export default class Select extends ToolButton {
    constructor(button)
    {
        super('select', button);

        this.addControlContent(`<div id="select-control-content"></div>`);
        this.selectControlContent = document.getElementById('select-control-content');
    }

    loadControlContent(selectedNode)
    {
        this.selectControlContent.innerHTML = `
            <span class="divider">EDITING SHAPE</span>
            <span class="divider">COLOR</span>
            <div id="shape-color-pickr"></div>
            <span class="divider"></span>
            <div class="tools">
                <a class="tool-button" id="shape-remove">Remove</a>
            </div>
        `;

        const pickr = Pickr.create({
            el: '#shape-color-pickr',
            theme: 'nano',

            default: selectedNode.stroke(),

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
            selectedNode.stroke(color.toRGBA().toString());
            Layers.current().draw();
            pickr.hide();
        });

        document.getElementById('shape-remove').addEventListener('click', (evt) => {
            evt.preventDefault();
            CopyPasta.delete();
        }, false);
    }

    onClickEvent(selectedNode)
    {
        
    }

    onUnSelected(evt)
    {
        this.selectControlContent.innerHTML = '';
    }

    onShapeSelect(evt)
    {
        this.loadControlContent(evt.target);
    }

    onModeSet(selectedNode)
    {
        const transformers = KonvaStage.Stage.find('Transformer');
        // Collection di ay ang yawa

        if (selectedNode !== null && transformers.length > 0) {
            this.loadControlContent(selectedNode);
        } else {
            this.selectControlContent.innerHTML = '';
        }
    }
}