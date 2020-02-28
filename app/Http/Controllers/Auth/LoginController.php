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

    public function showLogin()
    {
        return view('auth.login');
    }

    public function authLogin(Request $request)
    {
        $authType = $request->auth_type;

        if (Auth::guard($authType)->attempt([
            'username' => $request->username,
            'password' => $request->password
        ], $request->get('remember_me'))) {
            $request->session()->put('timezone', $request->timezone);

            return response()->json([
                'success' => true
            ]);
        }

        return response()->json([
            'success' => false
        ]);
    }

    public function redirectTo()
    {
        if (Auth::guard('student')->check()) {
            return '/app';
        }

        if (Auth::guard('teacher')->check()) {
            return '/app';
        }

        return '/';
    }
}
