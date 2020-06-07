<?php

namespace App\Http\Controllers;

use App\SignupApplication;
use Validator;
use Illuminate\Http\Request;

class SignupController extends Controller
{
    public function index()
    {
        return view('signup.index', [
            'currentPage' => 'signup'
        ]);
    }

    public function save(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'full_name' => 'required|string|max:100',
            'email' => 'required|string|email|unique:students,email',
            'skype' => 'required|string|max:50',
            'contact_number' => 'nullable|string|max:20',
            'birthday' => 'nullable|date',
            'message' => 'nullable|string',
            'captcha' => 'required|captcha'
        ], [ 'captcha' => 'Incorrect Captcha' ]);

        if ($validator->fails()) {
            return redirect(route('signup.index'))->withErrors($validator)->withInput();
        }

        $data = $request->all();

        if ($data['birthday']) {
            $data['birthday'] = date('Y-m-d', strtotime($data['birthday']));
        }

        unset($data['_token']);
        unset($data['captcha']);

        $application = new SignupApplication();
        $application->data = json_encode($data);
        $application->status = SignupApplication::STATUS_PENDING;
        $application->save();

        return redirect(route('signup.index'))->with('sent', 'Application sent. We will get back to you shortly.');
    }
}
