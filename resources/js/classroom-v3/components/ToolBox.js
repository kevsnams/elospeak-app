import _ from 'underscore';

import Brush from './tools/Brush';
import Eraser from './tools/Eraser';
import Shapes from './tools/Shapes';
import Select from './tools/Select';
import Clear from './tools/Clear';
import ZoomReset from './tools/ZoomReset';
import HistoryUndo from './tools/HistoryUndo';
import HistoryRedo from './tools/HistoryRedo';

export default class ToolBox {
    constructor(Components)
    {
        this.Components = Components;

        const wrapper = document.createElement('div');
        wrapper.setAttribute('id', 'vr-toolbox');
        
        this.Components.container.insertAdjacentElement('afterend', wrapper);
        this.wrapper = wrapper;

        const toggler = document.createElement('a');
        toggler.setAttribute('id', 'toolbox-toggle');
        toggler.innerHTML = `<span id="toolbox-toggle-icon" uk-icon="triangle-down"></span> Tools`;

        this.wrapper.appendChild(toggler);
        this.toggler = toggler;

        const toolbox = document.createElement('div');
        toolbox.className = 'toolbox';

        toolbox.innerHTML = `
            <div class="toolbox">
                <div class="uk-grid" uk-grid>
                    <div class="uk-width-1-3">
                        ${this.templateLeft()}
                    </div>

                    <div class="uk-width-1-3" id="vr-toolbox-controls"></div>

                    <div class="uk-width-1-3">
                        ${this.templateRight()}
                    </div>
                </div>
            </div>
        `;

        this.wrapper.appendChild(toolbox);
        this.controls = this.wrapper.querySelector('#vr-toolbox-controls');

        this.togglerEvent();
        this.adjustToolBoxEvent();

        this.registerTools();

        this.use('brush');
    }

    use(tool)
    {
        const splitClassName = tool.split('-');
        let className = '';

        splitClassName.forEach((word) => {
            className += word.charAt(0).toUpperCase() + word.slice(1);
        });

        this.selectedTool = className;
        this.Tool[className].use();
    }

    getSelectedTool()
    {
        return this.Tool[this.selectedTool];
    }

    getSelectedToolName()
    {
        return this.getSelectedTool().className;
    }

    registerTools()
    {
        this.selectedTool = null;
        this.Tool = {
            Brush: new Brush(this),
            Eraser: new Eraser(this),
            Shapes: new Shapes(this),
            Select: new Select(this),
            Clear: new Clear(this),
            ZoomReset: new ZoomReset(this),
            HistoryUndo: new HistoryUndo(this),
            HistoryRedo: new HistoryRedo(this)
        };

        this.tools = this.wrapper.querySelectorAll('[data-tool]');
        this.tools.forEach((element) => {
            element.addEventListener('click', (evt) => {
                this.use(element.getAttribute('data-tool'));
            }, false);
        });
    }

    adjustToolBoxEvent()
    {
        const adjustToolbox = (evt) => {
            const dim = this.Components.board.getBoundingClientRect();
            this.wrapper.style.left = (dim.x  + ((dim.width / 2) - (this.wrapper.scrollWidth / 2))) + 'px';
        };

        adjustToolbox();
        window.addEventListener('resize', _.debounce(adjustToolbox, 200), false);
    }

    togglerEvent()
    {
        this.toggle();
        this.toggler.addEventListener('click', (evt) => {
            evt.preventDefault();
            evt.stopPropagation();

            this.toggle();
        }, false);
    }

    isHidden()
    {
        return getComputedStyle(this.wrapper).bottom != '0px'
    }

    toggle()
    {
        const icon = document.getElementById('toolbox-toggle-icon');

        const toolboxStyles = getComputedStyle(this.wrapper);
        const toolboxHeight = parseFloat((toolboxStyles.height).replace('px', ''));

        const toolboxTogglerStyles = getComputedStyle(this.toggler);
        const togglerHeight = parseFloat((toolboxTogglerStyles.height).replace('px', '')) + 10;

        if (toolboxStyles.bottom === '0px') {
            this.wrapper.style.bottom = -(toolboxHeight - togglerHeight) +'px';
            icon.setAttribute('uk-icon', 'triangle-up');
        } else {
            this.wrapper.style.bottom = '0px';
            icon.setAttribute('uk-icon', 'triangle-down');
        }
    }

    templateLeft()
    {
        return `
            <div style="padding: 10px;">
                <span class="divider">MODES</span>
                <div class="tools">
                    <a href="#" data-tool="brush" class="tool-button">Brush</a>
                    <a href="#" data-tool="eraser" class="tool-button">Eraser</a>
                    <a href="#" data-tool="shapes" class="tool-button">Shapes</a>
                    <a href="#" data-tool="select" class="tool-button">Select</a>
                </div>
                <div class="tools">
                    <a href="#" data-tool="clear" class="tool-button">Clear</a>
                </div>
                <div class="undo-redo">
                    <span class="divider">HISTORY</span>
                    <div class="tools">
                        <a href="#" data-tool="history-undo" class="tool-button"><span uk-icon="history"></span></a>
                        <a href="#" data-tool="history-redo" class="tool-button"><span uk-icon="future"></span></a>
                    </div>
                </div>
            </div>
        `;
    }

    templateRight()
    {
        return `
            <span class="divider">IMPORT IMAGES</span>
            <form>
                <div class="uk-margin">
                    <div uk-form-custom>
                        <input type="file" id="file-input" multiple accept="image/*">
                        <button class="uk-button uk-button-default" type="button" style="background-color: #ffffff">Select</button>
                    </div>
                </div>
            </form>

            <span class="divider">ZOOM</span>
            <div class="tools">
                <a href="#" data-tool="zoom-reset">Reset</a>
                <span id="zoom-value">100%</span>
            </div>
        `;
    }
}