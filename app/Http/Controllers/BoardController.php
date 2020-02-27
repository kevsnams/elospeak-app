<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;
use Carbon\Carbon;

use App\Classroom;
use App\Student;
use App\Teacher;
use App\UserPhoto;
use App\ClassroomFileUpload;
use App\ClassroomFeedback;

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
        $localizeNow = $this->getCarbonLocalTimeNow();

        // @TODO change this to the actual current board
        $classroom = Classroom::where($column, $request->user()->id)
            ->whereRaw('DATE(start) = ?', [$localizeNow->format('Y-m-d')])
            //->where('id', 37)
            ->where('status', Classroom::STATUS_ACTIVE)->first();
        
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

    public function ping(Request $request)
    {
        $userType = $request->user()->user_type;

        // Update the current user
        $user = $this->getUserORM($request->user()->id, $userType);
        $user->last_active = now()->format('Y-m-d H:i:s');
        $user->save();

        // @TODO Dynamic timezone please
        // Get the other user's last active
        $other = $this->getUserORM($request->other, $userType == 'teacher' ? 'student' : 'teacher');
        $datetime = Carbon::createFromFormat('Y-m-d H:i:s', (
            $other->last_active == null ?
                now()->subDays(3)->format('Y-m-d H:i:s') : $other->last_active
        ));
        $datetime->timezone = 'Asia/Manila';

        return response()->json([
            'datetime' => $datetime->format('Y-m-d H:i:s')
        ]);
    }

    public function getImagesURL(Request $request)
    {
        $images = ClassroomFileUpload::whereIn('node', $request->node_ids)->get()->map(function ($image) {
            return [
                'node' => $image->node,
                'src' => $image->imageURL
            ];
        });
        return response()->json($images->toArray());
    }

    public function close(Request $request)
    {
        $classroom = Classroom::find($request->id);

        $classroom->status = Classroom::STATUS_DONE;
        $classroom->save();

        return response()->json([
            'success' => true
        ]);
    }

    public function feedback(Request $request)
    {
        /**
         * @TODO validation
         */
        $feedback = new ClassroomFeedback();
        $feedback->feedback = $request->message;
        $feedback->from_id = $request->user()->id;
        $feedback->user_type = $request->user()->user_type;
        $feedback->classroom_id = $request->classroom_id;

        $feedback->save();

        return response()->json([
            'success' => true
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