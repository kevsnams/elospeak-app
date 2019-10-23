require("es6-symbol/implement");

import Board from './Classroom/Board';
import BoardHistory from './Classroom/Tools/BoardHistory';
import ColorPicker from './Classroom/Tools/ColorPicker';
import BrushSizes from './Classroom/Tools/BrushSizes';
import ShapeTools from './Classroom/Tools/ShapeTools';
import ImportFile from './Classroom/Tools/ImportFile';

window.ClassroomBoard = new Board('vr-db-0');

ClassroomBoard.ColorPicker = new ColorPicker();
ClassroomBoard.BrushSizes = new BrushSizes();
ClassroomBoard.ShapeTools = new ShapeTools();
ClassroomBoard.ImportFile = new ImportFile();
ClassroomBoard.BoardHistory = new BoardHistory();