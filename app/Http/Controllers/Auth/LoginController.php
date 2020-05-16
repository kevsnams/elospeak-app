<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth as FacadesAuth;
use Illuminate\Foundation\Auth\ThrottlesLogins;

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
        return view('auth.login', [
            'currentPage' => 'login'
        ]);
    }

    public function authLogin(Request $request)
    {
        $authType = $request->auth_type;
        $remember = $request->get('remember_me') === 'on';

        if (FacadesAuth::guard($authType)->attempt([
            'username' => $request->username,
            'password' => $request->password
        ], $remember)) {
            $request->session()->put('timezone', $request->timezone);
            return redirect(route('app.index'));
        }

        return redirect()->back()->withErrors([
            'login' => 'error',
            'auth_type' => $authType
        ]);
    }

    public function redirectTo()
    {
        if (FacadesAuth::guard('student')->check()) {
            return '/app';
        }

        if (FacadesAuth::guard('teacher')->check()) {
            return '/app';
        }

        return '/';
    }
}
