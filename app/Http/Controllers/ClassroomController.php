<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ClassroomController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:student,auth:teacher');
    }
    public function show(Request $request, $id)
    {
        return view('classroom.show');
    }
}
