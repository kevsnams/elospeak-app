import UIkit from 'uikit';
import _ from 'underscore';

const ColorPicker = (function() {
    const _drop = Symbol();
    const _color = Symbol();
    const _colors = Symbol();
    const _buttonSelector = Symbol();
    const _tool = Symbol();

    class ColorPicker {
        constructor(defaultColor = 'black') {
            this[_colors] = {
                'black': '#000000',
                'white': '#ffffff',
                'red': '#ff0033',
                'yellow': '#f6ff00',
                'orange': '#fcb02f'
            };

            this[_drop] = document.getElementById('color-picker-drop');
            this[_buttonSelector] = '.color-pick';
            this[_tool] = document.getElementById('pen-color-tool');

            this.color(defaultColor);
            
            _.each(document.querySelectorAll(this[_buttonSelector]), (e, i) => {

                e.classList.add(e.getAttribute('data-color'));

                e.addEventListener('click', (evt) => {
                    UIkit.drop(this[_drop]).hide();

                    const newColor = evt.target.getAttribute('data-color');
                    const oldColor = this[_tool].classList.item(1);

                    this.color(newColor);
                    
                    this[_tool].classList.remove(oldColor);
                    this[_tool].classList.add(newColor);
                }, false);
            });
        }

        color(color) {
            if (typeof color === 'undefined') {
                return this[_color];
            }

            this[_color] = this[_colors][color];
        }

        colors() {
            return this[_colors];
        }
    }

    return ColorPicker;
}());

export default ColorPicker;