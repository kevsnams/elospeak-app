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
Route::get('/login/student', 'Auth\LoginController@showStudentLogin');
//Route::get('/login/teacher', 'Auth\LoginController@showTeacherLogin');

Route::post('/login/student', 'Auth\LoginController@authStudentLogin');
//Route::post('/login/teacher', 'Auth\LoginController@teacherLogin');

/*
Route::view('/home', 'home')->middleware('auth');
Route::view('/admin', 'admin');
Route::view('/writer', 'writer');
*/