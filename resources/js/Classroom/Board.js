import Konva from 'konva';
import Layers from './Layers';

const Board = (function() {

    const _id = Symbol();
    const _stage = Symbol();
    const _layer = Symbol();
    const _mode = Symbol();
    const _layers = Symbol();
    const _target = Symbol();
    const _lastLine = Symbol();
    const _isFreePaint = Symbol();
    const _allowedModes = Symbol();
    const _freePaintModes = Symbol();
    
    const _colorPicker = Symbol();
    const _brushSizes = Symbol();
    const _shapeTools = Symbol();

    class Board {
        constructor(id) {
            this[_id] = id;
            this[_target] = document.getElementById(this[_id]);
    
            const targetBoundingClientRect = this.target.getBoundingClientRect();
    
            this[_stage] = new Konva.Stage({
                container: this[_id],
                width: targetBoundingClientRect.width,
                height: targetBoundingClientRect.height
            });
            
            this[_layers] = new Layers();
            this.layers.create('main');
            this[_layer] = this.layers.current().layer;

            this[_mode] = 'brush';
            this[_lastLine] = null;
            this[_isFreePaint] = false;
            this[_freePaintModes] = ['brush', 'eraser'];
            this[_allowedModes] = ['brush', 'eraser', 'shapes', 'select'];

            this.stage.add(this.layer);

            document.getElementById('brush-tool').addEventListener('click', (evt) => {
                this.mode('brush');
            }, false);

            document.getElementById('select-tool').addEventListener('click', (evt) => {
                this.mode('select');
            }, false);

            document.getElementById('eraser-tool').addEventListener('click', (evt) => {
                this.mode('eraser');
            }, false);

            this.stage.on('mousedown touchstart', (evt) => {
                if (this[_freePaintModes].indexOf(this.mode()) >= 0) {
                    this[_isFreePaint] = true;
    
                    const operation = this.mode() === 'brush' ? 'source-over' : 'destination-out';
                    const pos = this.stage.getPointerPosition();
    
                    this[_lastLine] = new Konva.Line({
                        stroke: this.ColorPicker.color(),
                        strokeWidth: this.BrushSizes.size(),

                        globalCompositeOperation: operation,
                        lineCap: 'round',
                        points: [pos.x, pos.y]
                    });

                    this.layer.add(this[_lastLine]);
                }
            });
    
            this.stage.on('mouseup touchend', (evt) => {
                if (this[_freePaintModes].indexOf(this.mode()) >= 0) {
                    this[_isFreePaint] = false;
                }
            });
    
            this.stage.on('mousemove touchmove', (evt) => {
                if (this[_freePaintModes].indexOf(this.mode()) >= 0) {
                    if (!this[_isFreePaint]) return;
        
                    const pos = this.stage.getPointerPosition();
                    const newPoints = this[_lastLine].points().concat([pos.x, pos.y]);

                    this[_lastLine].points(newPoints);
                    this.layer.batchDraw();
                }
            });
            
            this.stage.on('click tap', (evt) => {
                // if click on empty area - remove all transformers
                if (evt.target === this.stage) {
                    this.stage.find('Transformer').destroy();
                    this.layer.draw();
                    return;
                }
        
                // do nothing if clicked NOT on our rectangles
                if (!evt.target.hasName('shapes')) {
                    return;
                }
        
                // remove old transformers
                // TODO: we can skip it if current rect is already selected
                this.stage.find('Transformer').destroy();
        
                // create new transformer
                var transformer = new Konva.Transformer();
                this.layer.add(transformer);
                transformer.attachTo(evt.target);
    
                this.layer.draw();
            });
            
        }
    
        mode(mode) {
            if (typeof mode === 'undefined') return this[_mode];
            if (this[_allowedModes].indexOf(mode) < 0) return;
    
            this[_mode] = mode;
        }
    
        get target() { return this[_target]; }
        get stage() { return this[_stage]; }
        get layer() { return this[_layer]; }
        get layers() { return this[_layers]; }

        get ColorPicker() { return this[_colorPicker]; }
        set ColorPicker(o) { this[_colorPicker] = o; }

        get BrushSizes() { return this[_brushSizes]; }
        set BrushSizes(o) { this[_brushSizes] = o; }

        get ShapeTools() { return this[_shapeTools]; }
        set ShapeTools(o) { this[_shapeTools] = o; }
    }

    return Board;

}());

export default Board;