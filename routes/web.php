<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();
Route::get('/login/student', 'Auth\LoginController@showStudentLogin')->name('student.login');
Route::get('/login/teacher', 'Auth\LoginController@showTeacherLogin')->name('teacher.login');

Route::post('/login/student', 'Auth\LoginController@authStudentLogin')->name('student.auth');
Route::post('/login/teacher', 'Auth\LoginController@authTeacherLogin')->name('teacher.auth');

Route::name('app.')->group(function() {
    Route::get('/app', 'AppController@index')->name('index');
    Route::post('/app/classrooms', 'AppController@classrooms')->name('app.classroom.all');
    Route::post('/app/teacher', 'AppController@teacher')->name('app.teacher');
    Route::post('/app/student', 'AppController@student')->name('app.student');
    
    Route::post('/app/classroom/next', 'AppController@nextClassroom')->name('app.classroom.next');
    Route::post('/app/classroom/end', 'AppController@endClassroom')->name('app.classroom.end');

    Route::post('/app/settings/details', 'AppController@saveSettingsDetails')->name('app.settings.details');
    Route::post('/app/settings/password', 'AppController@saveSettingsPassword')->name('app.settings.password');
    Route::post('/app/settings/photo', 'AppController@saveSettingsUserPhoto')->name('app.settings.user_photo');
});

Route::name('board.')->group(function () {
    Route::get('/board', 'BoardController@index')->name('index');

    Route::post('/board/classroom', 'BoardController@classroom')->name('classroom');
});

Route::name('teacher.')->group(function() {
    Route::get('/teacher', 'TeacherController@index')->name('index');
    Route::get('/teacher/logout', 'TeacherController@logout')->name('logout');
});

Route::name('student.')->group(function () {
    Route::get('/student', 'StudentController@index')->name('index');
    Route::get('/student/logout', 'StudentController@logout')->name('logout');
    Route::get('/student/notifications', 'StudentController@notifications')->name('notifications');
    Route::get('/student/feedbacks', 'StudentController@feedbacks')->name('feedbacks');
    Route::get('/student/balance', 'StudentController@balance')->name('balance');
});

Route::name('classroom.')->group(function() {
    Route::get('/classroom/{id}', 'ClassroomController@show')->name('show');
    Route::post('/classroom/info', 'ClassroomController@info')->name('info');
    Route::post('/classroom/image', 'ClassroomController@imageURL')->name('imageURL');
    Route::post('/classroom/chat/send', 'ClassroomController@chatSend')->name('chat.send');
    Route::post('/classroom/chat/load', 'ClassroomController@chatLoad')->name('chat.load');
    Route::post('/classroom/drawstate', 'ClassroomController@drawstate')->name('drawstate');
    Route::post('/classroom/image-upload', 'ClassroomController@imageUpload')->name('image.upload');
});
