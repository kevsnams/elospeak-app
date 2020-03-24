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
                
                <div class="teacher" data-teacher='{"name": "Teacher Audree", "vocaroo": "https://vocaroo.com/embed/fSRWewaCknZ"}'>
                    <img src="{{ asset('/front/img/teachers/audree.png') }}">
                </div>
                
                <div class="teacher" data-teacher='{"name": "Teacher Karen", "vocaroo": "https://vocaroo.com/embed/Vccp4Ebi1wv"}'>
                    <img src="{{ asset('/front/img/teachers/karen.png') }}">
                </div>
                
                <div class="teacher" data-teacher='{"name": "Teacher Rea", "vocaroo": "https://vocaroo.com/embed/75la53WaQuX"}'>
                    <img src="{{ asset('/front/img/teachers/rea.png') }}">
                </div>
                
            </div>
        </div>

        <div class="container mt-5 mb-5">
            <div class="teacher-content">
                <h1 class="header"></h1>
                <div class="mt-5">
                    <iframe class="iframe-voice" width="300" height="60" frameborder="0"></iframe>
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
        teacher.querySelector('.iframe-voice').setAttribute('src', json.vocaroo);
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