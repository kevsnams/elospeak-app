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
    return view('welcome', [
        'currentPage' => 'home'
    ]);
});

Route::name('pages.')->group(function () {
    Route::get('/pages/classes', 'PagesController@classes')->name('classes');
    Route::get('/pages/teachers', 'PagesController@teachers')->name('teachers');
    Route::get('/pages/contact', 'PagesController@contact')->name('contact');
    Route::get('/pages/faqs', 'PagesController@faqs')->name('faqs');
    Route::post('/pages/send-message', 'PagesController@sendMessage')->name('send-message');
});

Route::resource('classroom-feedbacks', 'ClassroomFeedbacksController');

Auth::routes();

Route::get('/login', 'Auth\LoginController@showLogin')->name('login');
Route::post('/login/auth', 'Auth\LoginController@authLogin')->name('login.auth');
Route::get('/logout', 'AppController@logout')->name('logout');

Route::name('app.')->group(function() {
    Route::get('/app', 'AppController@index')->name('index');
    Route::post('/app/classrooms', 'AppController@classrooms')->name('classroom.all');
    Route::post('/app/teacher', 'AppController@teacher')->name('teacher');
    Route::post('/app/student', 'AppController@student')->name('student');

    Route::post('/app/classroom/next', 'AppController@nextClassroom')->name('classroom.next');
    Route::post('/app/classroom/end', 'AppController@endClassroom')->name('classroom.end');

    Route::post('/app/settings/details', 'AppController@saveSettingsDetails')->name('settings.details');
    Route::post('/app/settings/password', 'AppController@saveSettingsPassword')->name('settings.password');
    Route::post('/app/settings/photo', 'AppController@saveSettingsUserPhoto')->name('settings.user_photo');
});

Route::name('board.')->group(function () {
    Route::get('/board', 'BoardController@index')->name('index');

    Route::post('/board/classroom', 'BoardController@classroom')->name('classroom');
    Route::post('/board/ping', 'BoardController@ping')->name('ping');
    Route::post('/board/get-images-url', 'BoardController@getImagesURL')->name('get-images-url');
    Route::post('/board/feedback', 'BoardController@feedback')->name('feedback');
    Route::post('/board/close', 'BoardController@close')->name('close');
});

Route::name('teacher.')->group(function() {
    Route::get('/teacher', 'TeacherController@index')->name('index');
});

Route::name('student.')->group(function () {
    Route::get('/student', 'StudentController@index')->name('index');
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
