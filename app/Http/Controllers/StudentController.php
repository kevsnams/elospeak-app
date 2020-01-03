<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;
use Session;

class StudentController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:student');
    }

    public function index()
    {
        return view('student.index');
    }

    public function notifications()
    {
        return view('student.notifications');
    }

    public function feedbacks()
    {
        return view('student.feedbacks');
    }

    public function balance()
    {
        return view('student.balance');
    }

    public function logout()
    {
        Auth::guard('student')->logout();
        Session::flush();

        return redirect(route('student.login'));
    }
}
