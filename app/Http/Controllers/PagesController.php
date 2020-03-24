<?php
namespace App\Http\Controllers;

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

    public function faqs()
    {
        return view('pages.faqs', [
            'currentPage' => 'faqs'
        ]);
    }
}
