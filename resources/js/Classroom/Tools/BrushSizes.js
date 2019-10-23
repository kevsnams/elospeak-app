import UIkit from 'uikit';
import _ from 'underscore';

const BrushSizes = (function() {
    const _drop = Symbol();
    const _tool = Symbol();
    const _size = Symbol();
    const _sizes = Symbol();
    const _buttonSelector = Symbol();

    class BrushSizes {
        constructor(defaultSize = 'SMALL') {
            if (typeof ClassroomBoard === 'undefined') {
                throw new Error('BrushSizes: ClassroomBoard has not yet been defined');
            }

            this._SMALL = 5;
            this._MEDIUM = 10;
            this._LARGE = 20;

            this[_sizes] = {
                'SMALL': 'thick-1',
                'MEDIUM': 'thick-2',
                'LARGE': 'thick-3'
            };

            this[_tool] = document.getElementById('thickness-picker-tool');
            this[_drop] = document.getElementById('pen-size-drop');
            this[_buttonSelector] = '.thickness-pick';

            this.size(defaultSize);

            _.each(document.querySelectorAll(this[_buttonSelector]), (e) => {
                e.classList.add(this[_sizes][e.getAttribute('data-size').toUpperCase()]);

                e.addEventListener('click', (evt) => {
                    UIkit.drop(this[_drop]).hide();

                    const size = evt.target.getAttribute('data-size').toUpperCase();

                    const newSize = this[_sizes][size];
                    const oldSize = this[_tool].classList.item(1);

                    this.size(size);

                    this[_tool].classList.remove(oldSize);
                    this[_tool].classList.add(newSize);

                    ClassroomBoard.mode('brush');
                }, false);
            });
        }

        size(size) {
            if (typeof size === 'undefined') {
                return this[_size];
            }

            this[_size] = this[`_${size}`];
        }

        get SMALL() { return this._SMALL; }
        get MEDIUM() { return this._MEDIUM; }
        get LARGE() { return this._LARGE; }
    }

    return BrushSizes;
}());

export default BrushSizes;