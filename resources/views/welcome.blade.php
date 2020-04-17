@extends('layouts.front')

@section('title', 'Welcome! We are an Online English Learning Tutorial website. Learn more about what we offer')

@section('content')
<div class="container">
    <div class="d-flex justify-content-between align-items-center">
        <div class="intro-text mt-4">
            <h1 class="header">LEARN ENGLISH ONLINE</h1>
            <p>Start learning English in an engaging course<br>with a unique teaching approach</p>
            <div class="mt-4">
                <a href="{{ url('/login') }}" class="btn-pink">Student/Teacher Login</a>
            </div>
        </div>
        <div>
            <img src="{{ asset('/front/img/student-teacher.png') }}">
        </div>
    </div>
</div>

<div class="trans-pink">
    <div class="trans-blue">
        <div class="container programs">
            <div class="d-flex justify-content-between">
                <div class="mt-5">
                    <div class="d-flex flex-row r1">
                        <div class="program-card">
                            <h1>BEGINNER</h1>
                            <span>Learn the alphabet and basic expressions. Learn basic sentence structure. Have simple conversations</span>
                        </div>

                        <div class="program-card">
                            <h1>INTERMEDIATE</h1>
                            <span>Learn common expressions. Deal with basic communication problems</span>
                        </div>
                    </div>

                    <div class="d-flex flex-row r2">
                        <div class="program-card">
                            <h1>ADVANCED</h1>
                            <span>Watch English News or video clips without subtitles. Able to have an English conversation in most situations</span>
                        </div>

                        <div class="program-card">
                            <h1>PROFECIENT</h1>
                            <span>Speak English like a native speaker</span>
                        </div>
                    </div>
                </div>
                <div class="programs-desc">
                    <h1 class="header">VERSATILE TEACHING</h1>
                    <p>We provide a wide range of English learning programs to learners across the globe through a single online portal</p>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="container mvc">
    <div class="d-flex">
        <div class="program-card w-1h3">
            <img src="{{ asset('/front/img/mission.png') }}">
            <h1>MISSION</h1>
            <p>To produce proficient English learners and increase access to high-quality education for everyone, everywhere through efficient virtual interaction.</p>
        </div>

        <div class="program-card w-1h3">
            <img src="{{ asset('/front/img/vision.png') }}">
            <h1 class="mt-3">VISION</h1>
            <p>It is our dream to connect the world with the beauty of language by providing opportunities and the confidence for everyone to explore the joy of learning English at a reasonable price and a platform for passionate teachers to apply their craft in teaching.</p>
        </div>

        <div class="program-card w-1h3">
            <img src="{{ asset('/front/img/values.png') }}">
            <h1>CORE VALUES</h1>
            <p>Here in EloSpeak, we value academic excellence as we help you navigate obstacles in learning the English language with critical thinking and resourcefulness. Our classes are facilitated with  mentors who also act as positive role models inspiring students to thrive in every class. We practice high levels of professionalism in our work and reward merit. We utilize competence, positive attitude and effective communication in working towards our mission. We stand by our values and empower one another as we take to heart the wholistic well-being of our students and educators.</p>
        </div>
    </div>
</div>
@endsection