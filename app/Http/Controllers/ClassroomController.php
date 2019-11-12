<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Classroom;
use Auth;

class ClassroomController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:student,teacher');
    }

    public function show(Request $request, $id)
    {
        $classroom = Classroom::with('teacher', 'student')->findOrFail($id);
        $currentAuthModel = Auth::guard()->getProvider()->getModel();
        $currentUserType = $currentUser = $otherUser = null;

        switch ($currentAuthModel) {
            case 'App\Teacher':
                $currentUserType = 'teacher';
                $currentUser = $classroom->teacher;
                $otherUser = $classroom->student;
            break;
            case 'App\Student':
                $currentUserType = 'student';
                $currentUser = $classroom->student;
                $otherUser = $classroom->teacher;
            break;
        }

        $chatChannel = 'classroom.'. $classroom->id .'.chat';

        return view('classroom.show', [
            'classroom' => $classroom,
            'currentUser' => $currentUser,
            'otherUser' => $otherUser,
            'currentUserType' => $currentUserType,
            'chatChannel' => $chatChannel
        ]);
    }

    public function chatSend(Request $request)
    {
        $currentAuthModel = Auth::guard()->getProvider()->getModel();

        $from = null;

        switch ($currentAuthModel) {
            case 'App\Teacher':
                $from = 'teacher';
            break;

            case 'App\Student':
                $from = 'student';
            break;
        }

        $message = $request->message;
        $classroomId = $request->classroom_id;

        event(new \App\Events\NewChat($message, $from, $classroomId));

        return response()->json([
            'message' => $message,
            'classroom_id' => $classroomId
        ]);
    }
}
