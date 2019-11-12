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
    Route::post('/classroom/chat/send', 'ClassroomController@chatSend')->name('chat.send');
});
