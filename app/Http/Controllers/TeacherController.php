<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;
use Session;

class TeacherController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:teacher');
    }

    public function index()
    {
        return view('teacher.index');
    }

    public function logout()
    {
        Auth::guard('teacher')->logout();
        Session::flush();

        return redirect(route('teacher.login'));
    }
}
