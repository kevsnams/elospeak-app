<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'LEGO') }}</title>

    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css?family=Patrick+Hand|Quicksand:300,400,700&display=swap" rel="stylesheet">

    <!-- KR Fonts [@TODO if-else] -->
    <!-- link href="https://fonts.googleapis.com/css?family=Jua|Nanum+Gothic:400,700&display=swap&subset=korean" rel="stylesheet" -->

    <!-- Styles -->
    <link href="{{ asset('/lib.css') }}" rel="stylesheet">
    <link href="{{ asset('css/main.css') }}" rel="stylesheet">
</head>
<body>
    <div class="d-flex justify-content-center align-items-center" style="width: 100%; height: 100%; position: absolute;">
        <div class="mt-n5 text-center">
            <div>
                <img src="{{ asset('img/elospeak-6-final.png') }}">
            </div>
            <div class="mt-5">
                <a href="{{ url('/login/student') }}" class="btn btn-success">Student Login</a>
                <a href="{{ url('/login/teacher') }}" class="btn btn-primary">Teacher Login</a>
            </div>
            <p class="text-muted mt-5">elospeak.com</p>
        </div>
    </div>
    
</body>
</html>