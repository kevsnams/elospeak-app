import UIkit from 'uikit';
import _ from 'underscore';

const BrushSizes = (function() {
    const _drop = Symbol();
    const _size = Symbol();
    const _buttonSelector = Symbol();

    class BrushSizes {
        constructor(defaultSize = 5) {
            if (typeof ClassroomBoard === 'undefined') {
                throw new Error('BrushSizes: ClassroomBoard has not yet been defined');
            }

            this._SMALL = 5;
            this._MEDIUM = 10;
            this._LARGE = 20;

            this[_size] = defaultSize;
            this[_drop] = document.getElementById('pen-size-drop');
            this[_buttonSelector] = '.thickness-pick';

            _.each(document.querySelectorAll(this[_buttonSelector]), (e) => {
                e.addEventListener('click', (evt) => {
                    UIkit.drop(this[_drop]).hide();
                    
                    this.size(
                        this[evt.target.getAttribute('data-size').toUpperCase()]
                    );

                    ClassroomBoard.mode('brush');
                }, false);
            });
        }

        size(size) {
            if (typeof size === 'undefined') {
                return this[_size];
            }

            this[_size] = size;
        }

        get SMALL() { return this._SMALL; }
        get MEDIUM() { return this._MEDIUM; }
        get LARGE() { return this._LARGE; }
    }

    return BrushSizes;
}());

export default BrushSizes;