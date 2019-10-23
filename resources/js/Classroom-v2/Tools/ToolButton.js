import _ from 'underscore';

export default class ToolButton {
    constructor(mode, button)
    {
        this.mode = mode;
        this.button = document.getElementById(button);
        this.controlbox = document.getElementById('vr-toolbox-controls');

        /**
         * This click event makes the button active when clicked
         */
        this.button.addEventListener('click', (evt) => {
            evt.preventDefault();

            this.setActive();
        }, false);
    }

    /**
     * This sets the button to active and also shows the hidden toolbox controls
     * 
     * @returns this
     */
    setActive()
    {
        _.each(document.querySelectorAll('.tool-button'), (e) => {
            e.classList.remove('active');
        });

        this.button.classList.add('active');

        _.each(document.querySelectorAll('.tool-controls'), (e) => {
            e.classList.add('uk-hidden');
        });

        document.querySelector(`.tool-controls.${this.mode}`).classList.remove('uk-hidden');

        return this;
    }

    /**
     * This function adds HTML template for controls
     * 
     * @param {*} html String the toolbox controls content
     * @returns this
     */
    addControlContent(html)
    {
        const controls = document.createElement('div');
        controls.classList.add('tool-controls');
        controls.classList.add(this.mode);
        controls.classList.add('uk-hidden');

        controls.innerHTML = html;
        this.controlbox.appendChild(controls);

        return this;
    }
}