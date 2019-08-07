<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;

use Illuminate\Http\Request;
use Auth;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
        $this->middleware('guest:teachers')->except('logout');
        $this->middleware('guest:students')->except('logout');
    }

    public function username()
    {
        return 'username';
    }

    public function showStudentLogin()
    {
        return view('auth.student.login');
    }

    public function authStudentLogin(Request $request)
    {
        $credentials = [
            'username' => $request->username,
            'password' => $request->password
        ];

        if (Auth::guard('student')->attempt($credentials, $request->get('remember_me'))) {
            return redirect()->intended('/student');
        }

        return back()->with('loginError', 'Username or password is incorrect');
    }

    public function redirectTo()
    {
        if (Auth::guard('student')->check()) {
            return '/student';
        }

        if (Auth::guard('teacher')->check()) {
            return '/teacher';
        }

        return '/';
    }
}
