@extends('layouts.front')

@section('title', 'Classes')

@section('content')
<div class="container">
    <div class="d-flex justify-content-center mt-5">
        <div class="text-center" style="width: 30%">
            <img src="{{ asset('/front/img/computer.png') }}">
        </div>
        <div class="ml-5" style="width: 70%">
            <h1 class="header" style="width: 70%;">Interactive Lesson Environment</h1>
            <p>No downloads required. Interact with your teacher directly from you web browser</p>
        </div>
    </div>
    
    <div class="divider mt-5 mb-5"></div>
    <div class="d-flex justify-content-center mt-5">
        <div class="text-center" style="width: 30%">
            <img src="{{ asset('/front/img/lessons.png') }}">
        </div>
        <div class="ml-5" style="width: 70%;">
            <h1 class="header">Personalized Lessons</h1>
            <p>Our tutors focus on their students needs. We tailor fit every lessons for every student</p>
        </div>
    </div>
    
    <div class="divider mb-5"></div>
    <div class="d-flex justify-content-center mt-5">
        <div class="text-center" style="width: 30%">
            <img src="{{ asset('/front/img/chat.png') }}">
        </div>
        <div class="ml-5" style="width: 70%;">
            <h1 class="header">Chat</h1>
            <p>Tutors can suggest phrases or corrections by using our chat features</p>
        </div>
    </div>
</div>

<h1 class="strip-header">
    HOW IT WORKS
</h1>
    
<div class="container mt-3">
    <div class="d-flex justify-content-center steps">
        <div class="step mr-3">
            <span>1</span>
        </div>
        <div class="step-desc">
            <h1>Find Teachers</h1>
            <p>
                Choose the time you want to take a class and select the teacher.
            </p>
        </div>
    </div>
    
    <div class="d-flex justify-content-center steps">
        <div class="step mr-3">
            <span>2</span>
        </div>
        <div class="step-desc">
            <h1>Book a Class</h1>
            <p>
                Once you have chosen your teacher, you can reserve a time slot and wait for your class to start.
            </p>
        </div>
    </div>
    
    <div class="d-flex justify-content-center steps">
        <div class="step mr-3">
            <span>3</span>
        </div>
        <div class="step-desc">
            <h1>Start Learning</h1>
            <p>
                The teacher will contact you via Skype, when it's time for your class. Enjoy your English class live everywhere you go.
            </p>
        </div>
    </div>
    
    <div class="text-center mt-5">
        <h1 class="header">Ready to learn with us?</h1>
        <a href="{{ route('pages.contact') }}" class="enroll-now mt-3">ENROLL NOW</a>
    </div>
</div>
@endsection