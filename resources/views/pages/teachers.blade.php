@extends('layouts.front')

@section('title', 'Our Teachers')

@section('content')
<h1 class="header mt-5 text-center">
    MEET OUR TEACHERS
</h1>

<div class="trans-pink">
    <div class="trans-blue">
        <div class="container teachers">
            <div class="d-flex justify-content-center pt-5">
                
                <div class="teacher" data-teacher='{"name": "Teacher Audree", "src": "{{ asset('/front/voice/audree.mp3') }}"}'>
                    <img src="{{ asset('/front/img/teachers/audree.png') }}">
                </div>
                
                <div class="teacher" data-teacher='{"name": "Teacher Karen", "src": "{{ asset('/front/voice/karen.mp3') }}"}'>
                    <img src="{{ asset('/front/img/teachers/karen.png') }}">
                </div>
                
                <div class="teacher" data-teacher='{"name": "Teacher Rea", "src": "{{ asset('/front/voice/rea.mp3') }}"}'>
                    <img src="{{ asset('/front/img/teachers/rea.png') }}">
                </div>
                
            </div>
        </div>

        <div class="container mt-5 mb-5">
            <div class="teacher-content">
                <h1 class="header"></h1>
                <div class="mt-5">
                    <audio controls id="player">
                        <source id="teacher-voice" type="audio/mpeg">
                        Your browser does not support the audio element.
                    </audio>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@section('script')

<script>
    const teachers = document.querySelectorAll('.teacher');
    const teacher = document.querySelector('.teacher-content');
    const voiceSrc = document.getElementById('teacher-voice');
    const player = document.getElementById('player');
    
    function clearActiveTeachers()
    {
        teachers.forEach((t) => {
            t.classList.remove('active');
        });
    }
    
    function printTeacherContent(element)
    {
        const data = element.getAttribute('data-teacher');
        const json = JSON.parse(data);
        
        element.classList.add('active');
        
        teacher.querySelector('.header').innerHTML = json.name;
        voiceSrc.src = json.src;
        player.load();
    }
    
    window.addEventListener('load', () => {
        teachers.forEach((e) => {
            e.addEventListener('click', (evt) => {
                clearActiveTeachers();
                printTeacherContent(e);
            }, false);
        });
        
        printTeacherContent(teachers[0]);
    });
</script>

@endsection