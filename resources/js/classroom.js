require("es6-symbol/implement");

import Board from './Classroom/Board';
import ColorPicker from './Classroom/ColorPicker';
import BrushSizes from './Classroom/BrushSizes';
import ShapeTools from './Classroom/ShapeTools';

window.ClassroomBoard = new Board('vr-db-0');

ClassroomBoard.ColorPicker = new ColorPicker();
ClassroomBoard.BrushSizes = new BrushSizes();
ClassroomBoard.ShapeTools = new ShapeTools();