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
        
        $currentUserRel = $otherUserRel = $chatEventListener = $chatChannel = null;
        $chatChannel = 'classroom.'. $classroom->id;

        switch ($currentAuthModel) {
            case 'App\Teacher':
                $currentUserRel = 'teacher';
                $otherUserRel = 'student';
                $chatEventListener = 'TeacherChatNew';
                $chatChannel .= '.teacher';
            break;
            case 'App\Student':
                $currentUserRel = 'student';
                $otherUserRel = 'teacher';
                $chatEventListener = 'StudentChatNew';
                $chatChannel .= '.student';
            break;
        }
        
        $currentUser = $classroom->{$currentUserRel};
        $otherUser = $classroom->{$otherUserRel};

        return view('classroom.show', [
            'classroom' => $classroom,
            'currentUser' => $currentUser,
            'otherUser' => $otherUser,
            'currentUserType' => $currentUserRel,
            'chatEventListener' => $chatEventListener,
            'chatChannel' => $chatChannel
        ]);
    }

    public function chat(Request $request)
    {
        $classroomId = $request->input('id');
        $message = $request->input('message');
        $from = $request->input('from');

        $classroom = Classroom::findOrFail($classroomId);

        if ($from == 'student') {
            event(new \App\Events\TeacherChatNew($message, $from, $classroom->id));
        } else if ($from == 'teacher') {
            event(new \App\Events\StudentChatNew($message, $from, $classroom->id));
        }

        return response()->json(['success' => true]);
    }
}
