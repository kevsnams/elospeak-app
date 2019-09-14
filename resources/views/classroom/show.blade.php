@extends('layouts.blank')

@section('pageContent')
    <div id="virtual-room">
        <div id="vr-sidenav">
            <div class="logo"><span class="a">ELO</span><span class="b">Speak</span></div>
            <div id="vr-client">
                <div class="uk-grid" uk-grid>
                    <div><img src="https://usercontent1.hubstatic.com/13400924.png" width="55" height="55" class="uk-border-circle"></div>
                    <div>
                        <span class="full_name">{{ $currentUser->full_name }}</span>
                        <a href="#">View Profile</a>
                    </div>
                </div>
            </div>

            <div id="vr-chats">
                <span class="title">CHATROOM</span>
                <div id="vr-chatbox"></div>
            </div>
            <div id="vr-typebox">
                <div class="wrapper">
                    <textarea class="typebox" id="sender-message"></textarea>
                    <button class="send fncy-button fncy-green" id="send-message-button">Send</button>
                </div>
            </div>
        </div>
        <div id="vr-board">
            <div id="vr-db-0" class="vr-drawingboard"></div>
            <div id="vr-board-control">
                <ul class="nav">
                    <li>
                        <div style="padding-top: 5px;">
                            <span class="color-display black" uk-tooltip="Pen Color"></span>
                            <div class="popup" id="color-picker-drop" uk-drop="mode: click; pos: top-center;">
                                <span class="color-pick color-display black"></span>
                                <span class="color-pick color-display white"></span>
                                <span class="color-pick color-display yellow"></span>
                                <span class="color-pick color-display orange"></span>
                                <span class="color-pick color-display red"></span>
                            </div>
                        </div>
                    </li>

                    <li>
                        <div style="padding-top: 5px;">
                            <span class="thickness thick-1" uk-tooltip="Pen Thickness"></span>
                            <div class="popup" id="pen-size-drop" uk-drop="mode: click; pos: top-center;">
                                <span class="thickness-pick thickness thick-1" data-size="small"></span>
                                <span class="thickness-pick thickness thick-2" data-size="medium"></span>
                                <span class="thickness-pick thickness thick-3" data-size="large"></span>
                            </div>
                        </div>
                    </li>

                    <li>
                        <div>
                            <span uk-icon="icon: fa-shapes-s; ratio: .9" uk-tooltip="Shapes"></span>
                            <div class="popup" uk-drop="mode: click; pos: top-center;">
                                <span data-shape='square' uk-icon="icon: fa-square"></span>
                                <span data-shape='star' uk-icon="icon: fa-star"></span>
                                <span data-shape='circle' uk-icon="icon: fa-circle"></span>
                                <span data-shape='rectangle' uk-icon="icon: file; ratio: 1.1" style="transform: rotate(90deg)"></span>
                            </div>
                        </div>
                    </li>

                    <li>
                        <span uk-icon="icon: fa-eraser-s; ratio: .9" uk-tooltip="Eraser"></span>
                    </li>

                    <li>
                        <span uk-icon="icon: fa-grin-tongue-squint; ratio: .9" uk-tooltip="Emoji"></span>
                    </li>
                    <li>
                        <span uk-icon="icon: fa-file-import-s; ratio: .9" uk-tooltip="Import Lesson"></span>
                    </li>
                    <li>
                        <span uk-icon="icon: fa-cog-s; ratio: .9" uk-tooltip="Settings"></span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
@endsection

@section('pageCss')
<style type="text/css">
::-webkit-scrollbar{width:10px}::-webkit-scrollbar-track{background:#7b7b7b;border-radius:5px}::-webkit-scrollbar-thumb{background:#d8d8d8;border-radius:5px}
</style>
@endsection

@section('pageJavascript')
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
    }
}());

const DrawShapes = (function() {
    /**
     * TODO here
     */
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
}

const board = document.getElementById('vr-board');
const boardcontrol = document.getElementById('vr-board-control');

let crWindowResize = function(wait) {
    return _.debounce(function(evt) {
        let midpos = board.getBoundingClientRect().width / 2;
        let halfboardcontrol = boardcontrol.getBoundingClientRect().width / 2;

        boardcontrol.style.marginLeft = (midpos - halfboardcontrol) +'px';
    }, wait);
};

window.addEventListener('load', function(evt) {
    crWindowResize(0).call(null);

    ColorPicker.init();
    BrushSizes.init();
    DrawingBoards.init();
}, false);

window.addEventListener('resize', crWindowResize(200), false);
</script>
@endsection