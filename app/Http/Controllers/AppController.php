<?php

namespace App\Http\Controllers;

use Image;
use Storage;
use Auth;
use Hash;
use DB;
use Session;
use Carbon\Carbon;
use Illuminate\Http\Request;

use App\Classroom;
use App\Student;
use App\Teacher;
use App\UserPhoto;

class AppController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:student,teacher');
    }

    public function index()
    {
        return view('app', [
            'User' => Auth::user(),
            'ServerTime' => date('Y-m-d H:i:s')
        ]);
    }

    public function classrooms(Request $request)
    {
        $column = $this->getClassroomColumnFromAuthUserType($request);
        $classrooms = Classroom::with(['teacher', 'student'])
            ->where($column, $request->user()->id)
            ->orderBy('start', 'desc')
            ->get();

        return response()->json($classrooms->toArray());
    }

    public function teacher(Request $request)
    {
        $teacher = Teacher::findOrFail($request->id);

        return response()->json($teacher->toArray());
    }

    public function student(Request $request)
    {
        $student = Student::findOrFail($request->id);

        return response()->json($student->toArray());
    }

    public function endClassroom(Request $request)
    {
        $classroom = Classroom::find($request->id);

        $updated = false;
        if ($classroom) {
            $classroom->status = Classroom::STATUS_DONE;
            $classroom->save();
            $updated = true;
        }

        return response()->json([
            'success' => $updated
        ]);
    }

    public function nextClassroom(Request $request)
    {
        $localizeNow = $this->getCarbonLocalTimeNow();

        $column = $this->getClassroomColumnFromAuthUserType($request);
        $classroom = Classroom::with(['teacher', 'student'])
            ->where($column, $request->user()->id)
            ->whereRaw('DATE(start) = ?', [$localizeNow->format('Y-m-d')])
            ->where('status', Classroom::STATUS_ACTIVE)
            ->orderBy('start', 'desc')
            ->first();

        $response = ['success' => false, 'classroom' => null, 'a' => $localizeNow->format('Y-m-d'), 'b' => $localizeNow->format('Y-m-d H:i:s')];

        if ($classroom) {
            $response['success'] = true;
            $response['classroom'] = $classroom->toArray();
        }

        return response()->json($response);
    }

    public function logout(Request $request)
    {
        Auth::guard($request->user()->user_type)->logout();
        Session::flush();

        return redirect(route('login'));
    }

    public function saveSettingsDetails(Request $request)
    {
        $userType = $request->user()->user_type;
        $rules = [
            'full_name' => [
                'present',
                'string',
                'max:100'
            ],

            'personal_contact_number' => [
                'sometimes',
                'nullable',
                'max:20'
            ],

            'skype' => [
                'sometimes',
                'nullable',
                'string',
                'max:30'
            ],

            'birthday' => [
                'sometimes',
                'nullable',
                'date'
            ]
        ];

        if ($userType == 'teacher') {
            $rules['address'] = 'present|string|max:250';
            $rules['nickname'] = 'present|string|max:50';
        }

        $request->validate($rules);

        $user = $this->getUserORM($request->user()->id, $userType);

        foreach (array_keys($rules) as $column) {
            $newValue = $request->{$column};

            if (!empty($newValue)) {
                $user->{$column} = $request->{$column};
            }
        }

        $user->save();

        return response()->json($user->toArray());
    }

    public function saveSettingsPassword(Request $request)
    {
        $request->validate([
            'password' => 'required|same:password_repeat|bail',
            'password_repeat' => 'required|same:password|bail'
        ]);

        $user = $this->getUserORM($request->user()->id, $request->user()->user_type);

        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json([
            'success' => true
        ]);
    }

    public function saveSettingsUserPhoto(Request $request)
    {
        $request->validate([
            'image' => 'mimes:jpeg,jpg,png'
        ]);

        $user = $this->getUserORM($request->user()->id, $request->user()->user_type);

        if ($user->photo) {
            $oldPath = explode('/', $user->photo->path);
            Storage::delete(storage_path('app/public/avatars/'. $oldPath[2]));
        }

        $newFilename = date('Y-m-d') . '_' . time() . '_' . md5($request->user()->id);
        $file = $request->file('image');

        Image::make($file)->fit(512)->save(storage_path('app/public/avatars/'. $newFilename .'.png'));

        $userPhoto = new UserPhoto();
        $userPhoto->path = 'storage/avatars/'. $newFilename .'.png';
        $userPhoto->save();

        $user->user_photo_id = $userPhoto->id;
        $user->save();

        return response()->json([
            'imageURL' => url('storage/avatars/'. $newFilename .'.png')
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
        $carbonDate->timezone = session('timezone');

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
