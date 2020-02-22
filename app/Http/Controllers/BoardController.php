<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;

use App\Classroom;
use App\Student;
use App\Teacher;
use App\UserPhoto;

class BoardController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:student,teacher');
    }

    public function index()
    {
        return view('board');
    }

    public function classroom(Request $request)
    {
        $column = $this->getClassroomColumnFromAuthUserType($request);
        $otherUserType = $request->user()->user_type == 'teacher' ? 'student' : 'teacher';
        
        // @TODO change this to the actual current board
        $classroom = Classroom::where($column, $request->user()->id)->where('id', 37)->first();
        
        $currentUser = $request->user();
        $otherUser = $this->getUserORM($classroom->{$otherUserType .'_id'}, $otherUserType);
        
        return response()->json([
            'Classroom' => $classroom->toArray(),
            'Users' => [
                'Current' => $currentUser->toArray(),
                'Other' => $otherUser->toArray()
            ]
        ]);
    }

    private function getClassroomColumnFromAuthUserType($request)
    {
        return $request->user()->user_type  == 'teacher' ? 'teacher_id' : 'student_id';
    }

    private function getCarbonLocalTimeNow()
    {
        $carbonDate = new Carbon('now');

        /**
         * @TODO set this dynamically
         */
        $carbonDate->timezone = 'Asia/Manila';

        return $carbonDate;
    }

    private function getUserORM($id, $userType)
    {
        if ($userType == 'teacher') {
            return Teacher::find($id);
        }

        if ($userType == 'student') {
            return Student::find($id);
        }

        return null;
    }
}