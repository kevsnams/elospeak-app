import UIkit from 'uikit';
import _ from 'underscore';

const ColorPicker = (function() {
    const _drop = Symbol();
    const _color = Symbol();
    const _buttonSelector = Symbol();

    class ColorPicker {
        constructor(defaultColor = '#000000') {
            this[_color] = defaultColor;
            this[_drop] = document.getElementById('color-picker-drop');
            this[_buttonSelector] = '.color-pick';

            _.each(document.querySelectorAll(this[_buttonSelector]), (e, i) => {
                e.addEventListener('click', (evt) => {
                    UIkit.drop(this[_drop]).hide();
                    this.color(
                        getComputedStyle(evt.target).getPropertyValue('background-color')
                    );
                }, false);
            });
        }

        color(color) {
            if (typeof color === 'undefined') {
                return this[_color];
            }

            this[_color] = color;
        }
    }

    return ColorPicker;
}());

export default ColorPicker;