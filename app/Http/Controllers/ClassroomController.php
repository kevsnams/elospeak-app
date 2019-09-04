<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Classroom;

class ClassroomController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:student,auth:teacher');
    }

    public function show(Request $request, $id)
    {
        $classroom = Classroom::findOrFail(381);

        return view('classroom.show', [
            'classroom' => $classroom
        ]);
    }

    public function xteacher(Request $request)
    {
        $classroom = Classroom::findOrFail(381);

        return view('classroom.testTeacher', [
            'classroom' => $classroom
        ]);
    }

    public function chat(Request $request)
    {
        $classroomId = $request->input('id');
        $message = $request->input('message');
        $from = $request->input('from');

        $classroom = Classroom::findOrFail($classroomId);

        event(new \App\Events\ChatNew($message, $from, $classroom->id));

        return response()->json(['success' => true]);
    }
}
