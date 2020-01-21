@extends('layouts.blank_nolibjs')

@section('pageContent')
    <div id="classroom"></div>
@endsection

@section('pageCss')
    <style type="text/css">
        ::-webkit-scrollbar {
            width: 10px;
        }

        ::-webkit-scrollbar-track {
            background:#7b7b7b;
            border-radius:5px;
        }

        ::-webkit-scrollbar-thumb {
            background:#d8d8d8;
            border-radius:5px;
        }
    </style>
@endsection

@section('pageJavascript')
    <script>
        window.ELOSpeakClassroomID = {{ $classroom->id }};
    </script>
    @if ($currentUserType === 'teacher')
        <script src="{{ asset('/dist/js/classroom-teacher.js') }}"></script>
    @else
        <script src="{{ asset('/dist/js/classroom-student.js') }}"></script>
    @endif
@endsection