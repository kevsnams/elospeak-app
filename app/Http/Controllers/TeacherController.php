<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;

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

        return redirect(route('teacher.login'));
    }
}
