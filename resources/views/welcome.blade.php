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
    <link href="{{ asset('/uikit-3.1.6/css/uikit.min.css') }}" rel="stylesheet">
    <link href="{{ asset('css/main.css') }}" rel="stylesheet">
</head>
<body>
    <div class="uk-grid" uk-grid>
        <div class="uk-text-center uk-width-expand">
            <img src="{{ asset('/splash.png') }}">
            <h1 style="font-family: 'Patrick Hand', sans-seriff; font-weight: 700; color: rgba(0, 0, 0, 0.5)">Home Page - Coming Soon</h1>
            <a href="{{ url('/login/student') }}" class="uk-button uk-button-default" style="font-family: 'Quicksand', sans-seriff;">Student Login</a>
            &nbsp;
            <a href="{{ url('/login/teacher') }}" class="uk-button uk-button-default" style="font-family: 'Quicksand', sans-seriff;">Teacher Login</a>
            <!-- a class="uk-button uk-button-default" style="font-family: 'Quicksand', sans-seriff;">Teacher Login</a -->
        </div>
    </div>
    <!-- Scripts -->
    <script src="{{ asset('/uikit-3.1.6/js/uikit.min.js') }}"></script>
    <script src="{{ asset('/uikit-3.1.6/js/uikit-icons.min.js') }}"></script>
    <script src="{{ asset('js/underscore-1.9.1.min.js') }}"></script>
    <script src="{{ asset('js/axios.min.js') }}"></script>
    <script src="{{ asset('js/moment-2.24.0.min.js') }}"></script>
    <script src="{{ asset('js/util.js') }}" defer></script>
</body>
</html>