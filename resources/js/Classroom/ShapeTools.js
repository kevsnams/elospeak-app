import UIkit from 'uikit';
import _ from 'underscore';

import Square from './Shapes/Square';
import Rectangle from './Shapes/Rectangle';
import Star from './Shapes/Star';
import Circle from './Shapes/Circle';

const ShapeTools = (function() {
    const _buttonSelector = Symbol();
    const _drop = Symbol();

    class ShapeTools {
        constructor() {
            if (typeof ClassroomBoard === 'undefined') {
                throw new Error('ShapeTools: ClassroomBoard has not yet been defined');
            }

            this[_buttonSelector] = '[data-shape]';
            this[_drop] = document.getElementById('shapes-drop');

            _.each(document.querySelectorAll(this[_buttonSelector]), (e) => {
                e.addEventListener('click', (evt) => {
                    UIkit.drop(this[_drop]).hide();
                    ClassroomBoard.mode('shapes');

                    const type = e.getAttribute('data-shape');
                    let shape = null;

                    switch (type) {
                        case 'Square': shape = new Square(); break;
                        case 'Rectangle': shape = new Rectangle(); break;
                        case 'Star': shape = new Star(); break;
                        case 'Circle': shape = new Circle(); break;
                    }

                    if (shape === null) {
                        throw new Error('ShapeTools: '+ type +' object not found');
                    }

                    ClassroomBoard.layer.add(shape);
                    ClassroomBoard.layer.draw();
                }, false);
            });
        }
    }

    return ShapeTools;
}());

export default ShapeTools;