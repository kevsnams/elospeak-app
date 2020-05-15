<?php

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/
use App\Classroom;

Broadcast::channel('classroom.{id}.board', function ($user, $id) {
    $classroom = Classroom::findOrFail($id);

    if ($user->user_type === 'student') {
        return $user->id == $classroom->student_id;
    }

    if ($user->user_type === 'teacher') {
        return $user->id == $classroom->teacher_id;
    }

    return false;
}, ['guards' => ['student', 'teacher']]);
