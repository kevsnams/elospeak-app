<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

use App\Classroom;
use App\ClassroomFileUpload;
use App\ChatLog;
use App\ClassroomDrawstate;

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

    public function info(Request $request)
    {
        $classroom = Classroom::with('teacher', 'student')->findOrFail($request->id);
        $currentAuthModel = Auth::guard()->getProvider()->getModel();
        $currentUser = $otherUser = null;

        switch ($currentAuthModel) {
            case 'App\Teacher':
                $currentUser = $classroom->teacher;
                $otherUser = $classroom->student;
            break;
            case 'App\Student':
                $currentUser = $classroom->student;
                $otherUser = $classroom->teacher;
            break;
        }

        $classroomTrimmed = $classroom->toArray();
        unset($classroomTrimmed['teacher']);
        unset($classroomTrimmed['student']);
        
        $chatChannel = 'classroom.'. $classroom->id .'.chat';

        return response()->json([
            'classroom' => $classroomTrimmed,
            'users' => [
                'current' => $currentUser,
                'other' => $otherUser
            ],
            'channel' => $chatChannel
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

    public function imageUpload(Request $request)
    {
        $file = $request->file('image');

        $classroomFileUpload = new ClassroomFileUpload();

        $newFilename = implode('_', [
            md5(microtime()),
            date('Y_m_d_H_i_s'),
            Auth::guard('teacher')->id()
        ]);

        $classroomFileUpload->filename = $newFilename;
        $classroomFileUpload->path = ClassroomFileUpload::UPLOAD_DIR;
        $classroomFileUpload->node = $request->node;
        $classroomFileUpload->save();

        $classroomFileUpload->filename = $classroomFileUpload->filename . '_'. $classroomFileUpload->id .'.'. $file->extension();
        $classroomFileUpload->save();

        $response = [
            'success' => false
        ];

        if ($file->storeAs($classroomFileUpload->path, $classroomFileUpload->filename)) {
            $classroomFileUpload->md5_hash = md5_file(storage_path('app/'. $classroomFileUpload->path .'/'. $classroomFileUpload->filename));
            $classroomFileUpload->save();

            $response['success'] = true;
            $response['image'] = $classroomFileUpload->toArray();
        }

        return response()->json($response);
    }

    public function imageURL(Request $request)
    {
        $file = ClassroomFileUpload::findOrFail($request->id);

        return response()->json([
            'url' => $file->image_URL
        ]);
    }

    public function chatLoad(Request $request)
    {
        $chatLogs = ChatLog::where('classroom_id', $request->id)->orderBy('created_at', 'ASC')->get();

        return response()->json($chatLogs);
    }

    public function drawstate(Request $request)
    {
        $classroom = ClassroomDrawstate::where('classroom_id', $request->id)->first();
        $response = [
            'data' => null,
            'success' => false
        ];

        if (!$classroom) {
            $classroom = new ClassroomDrawstate();
            $classroom->classroom_id = $request->id;
            $classroom->json = '';
            $classroom->save();
        }

        if ($request->mode == 'save' && $classroom->json != $request->data) {
            $classroom->json = json_encode($request->data);
            $classroom->save();

            $response['success'] = true;
        }

        if ($request->mode == 'fetch') {
            $response['success'] = true;
            $response['data'] = json_decode($classroom->json);
        }

        return response()->json($response);
    }
}
