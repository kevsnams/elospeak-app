<script src="{{ asset('/dist/js/Konva.js') }}"></script>
<script>
"use strict";
const DrawingBoardLayer = (function() {
    let layers = [];
    let current = 0;

    return {
        current: function () {
            return {
                index: current,
                layer: layers[current]
            };
        },

        add: function () {
            layers.push(new Konva.Layer());
        }
    }
}());

const DrawingBoards = (function() {
    let boards = [];
    let current = 0;

    return {
        init: function () {
            boards[current] = new DrawingBoard('vr-db-'+ current);
        },

        current: function() {
            return boards[current];
        },

        add: function () {
            boards.push(new DrawingBoard('vr-db-'+ boards.length));
        },

        show: function (i) {
            current = i;
        }
    };
}());

const DrawShapes = (function() {
    const selector = '[data-shape]';

    function getStageMidPoint(w, h) {
        return {
            x: (DrawingBoards.current().stage.width() / 2) - (w / 2),
            y: Math.abs(DrawingBoards.current().target.getBoundingClientRect().top) + (window.innerHeight / 2)
        };
    }

    const shapesObject = {
        square: function () {
            const width = 100, height = 100;
            const midpoint = getStageMidPoint(width, height);
            return new Konva.Rect({
                x: midpoint.x,
                y: midpoint.y,
                width: width,
                height: height,
                fill: 'green',
                stroke: 'black',
                strokeWidth: 4,
                name: 'shapes',
                draggable: true
            });
        },

        rectangle: function() {
            const width = 150, height = 50;
            const midpoint = getStageMidPoint(width, height);
            return new Konva.Rect({
                x: midpoint.x,
                y: midpoint.y,
                width: width,
                height: height,
                fill: 'green',
                stroke: 'black',
                strokeWidth: 4,
                name: 'shapes',
                draggable: true
            });
        },

        star: function () {
            const width = 100, height = 100;
            const midpoint = getStageMidPoint(width, height);
            return new Konva.Star({
                x: midpoint.x,
                y: midpoint.y,
                numPoints: 5,
                innerRadius: 20,
                outerRadius: 20,
                fill: 'red',
                stroke: 'black',
                strokeWidth: 4,
                name: 'shapes',
                width: width,
                height: height,
                draggable: true
            });
        }
    };

    return {
        init: function() {
            _.each(document.querySelectorAll(selector), function (e) {
                e.addEventListener('click', function (evt) {
                    DrawingBoards.current().mode('shapes');

                    const type = e.getAttribute('data-shape');
                    const shape = shapesObject[type]();

                    DrawingBoards.current().layer.add(shape);
                    DrawingBoards.current().layer.draw();
                }, false);
            });
        }
    };
}());

const BrushSizes = (function() {
    const SMALL = 5;
    const MEDIUM = 10;
    const LARGE = 20;

    let selector = '.thickness-pick';
    let drop, size;

    function set(v) {
        size = v;
    }

    function get() {
        return size;
    }

    return {
        SMALL: SMALL,
        MEDIUM: MEDIUM,
        LARGE: LARGE,

        drop: drop,

        set: set,
        get: get,

        init: function () {
            drop = document.getElementById('pen-size-drop');
            _.each(document.querySelectorAll(selector), function (e, i) {
                if (i === 0) {
                    set(BrushSizes[e.getAttribute('data-size').toUpperCase()]);
                }

                e.addEventListener('click', function (evt) {
                    UIkit.drop(drop).hide();
                    let s = BrushSizes[evt.target.getAttribute('data-size').toUpperCase()];
                    set(s);

                    DrawingBoards.current().mode('brush');
                }, false);
            });
        }
    }
}());

const ColorPicker = (function () {
    let drop = null;
    let selector = '.color-pick';
    let color;

    function set(v) {
        color = v;
    }

    function get() {
        return color;
    }

    return {
        set: set,
        get: get,
        drop: drop,
        init: function () {
            drop = document.getElementById('color-picker-drop');

            _.each(document.querySelectorAll(selector), function (e, i) {
                if (i === 0) {
                    const style = getComputedStyle(e);
                    set(style.getPropertyValue('background-color'));
                }

                e.addEventListener('click', function (evt) {
                    UIkit.drop(drop).hide();
                    const style = getComputedStyle(evt.target);
                    set(style.getPropertyValue('background-color'));
                }, false);
            });
        }
    }
}());

function DrawingBoard(id) {
    this.id = id;
    this.target = document.getElementById(id);

    this.stage = new Konva.Stage({
        container: this.id,
        width: this.target.getBoundingClientRect().width,
        height: this.target.getBoundingClientRect().height
    });

    DrawingBoardLayer.add();
    this.layer = DrawingBoardLayer.current().layer;

    /**
     * This part right here sets the mode for the drawing board
     * Current supported modes:
     * - brush
     * - eraser
     * - shapes
     * default: brush
     * 
     * Usage:
     * .mode('brush') sets the mode to 'brush'
     * .mode() gets the current mode
     * if parameter value is not in allowedModes, then it doesn't change anything
     */
    this._mode = 'brush';
    let allowedModes = ['brush', 'eraser', 'shapes'];
    this.mode = function(v) {
        if (typeof v === 'undefined') {
            return this._mode;
        }

        if (allowedModes.indexOf(v) === -1) {
            return;
        }

        this._mode = v;
    };

    this.stage.add(this.layer);

    /**
     * Stage events
     */

    // Reference this so we can use it inside event definitions
    let self = this;

    // Flag for determining if free painting has started
    this._isFreePaint = false;

    // This private variable is only used on brush mode
    this._lastLine;

    const freePaintModes = ['brush', 'eraser'];

    this.stage.on('mousedown touchstart', function(e) {
        if (freePaintModes.indexOf(self.mode()) >= 0) {
            let operation = self.mode() === 'brush' ? 'source-over' : 'destination-out';

            self._isFreePaint = true;

            const pos = self.stage.getPointerPosition();

            self._lastLine = new Konva.Line({
                stroke: ColorPicker.get(),
                strokeWidth: BrushSizes.get(),
                globalCompositeOperation: operation,
                lineCap: 'round',
                points: [pos.x, pos.y]
            });

            self.layer.add(self._lastLine);
        }
    });

    this.stage.on('mouseup touchend', function() {
        if (freePaintModes.indexOf(self.mode()) >= 0) {
            self._isFreePaint = false;
        }
    });

    this.stage.on('mousemove touchmove', function() {
        if (freePaintModes.indexOf(self.mode()) >= 0) {
            if (!self._isFreePaint) return;

            const pos = self.stage.getPointerPosition();
            let newPoints = self._lastLine.points().concat([pos.x, pos.y]);

            self._lastLine.points(newPoints);
            self.layer.batchDraw();
        }
    });

    this.stage.on('click tap', function (evt) {
        // if click on empty area - remove all transformers
        if (evt.target === self.stage) {
            self.stage.find('Transformer').destroy();
            self.layer.draw();
            return;
        }

        // do nothing if clicked NOT on our rectangles
        if (!evt.target.hasName('shapes')) {
            return;
        }

        // remove old transformers
        // TODO: we can skip it if current rect is already selected
        self.stage.find('Transformer').destroy();

        // create new transformer
        var tr = new Konva.Transformer();
        self.layer.add(tr);
        tr.attachTo(evt.target);
        self.layer.draw();
    });
}
</script>