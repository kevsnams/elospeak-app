<?php
namespace App\Http\Controllers;

use Validator;
use Illuminate\Http\Request;

use App\CustomerMessage;

class PagesController extends Controller
{
    public function classes()
    {
        return view('pages.classes', [
            'currentPage' => 'classes'
        ]);
    }

    public function teachers()
    {
        return view('pages.teachers', [
            'currentPage' => 'teachers'
        ]);
    }

    public function contact()
    {
        return view('pages.contact', [
            'currentPage' => 'contact'
        ]);
    }

    public function sendMessage(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'full_name' => [
                'required',
                'string',
                'max:255'
            ],

            'email' => [
                'required',
                'email'
            ],

            'message' => [
                'required',
                'string',
                'max:65535'
            ],

            'captcha' => [
                'required',
                'captcha'
            ]
        ], [ 'captcha' => 'Incorrect captcha' ]);

        if ($validator->fails()) {
            return redirect(route('pages.contact'))->withErrors($validator)->withInput();
        }

        $customerMessage = new CustomerMessage();
        $customerMessage->full_name = $request->input('full_name');
        $customerMessage->email = $request->input('email');
        $customerMessage->message = $request->input('message');
        $customerMessage->save();

        return redirect(route('pages.contact'))->with('sent', 'Message sent. We will get back to you shortly.');
    }

    public function faqs()
    {
        return view('pages.faqs', [
            'currentPage' => 'faqs'
        ]);
    }

    public function enrollment()
    {
        return view('pages.enrollment', [
            'currentPage' => 'enrollment'
        ]);
    }
}
