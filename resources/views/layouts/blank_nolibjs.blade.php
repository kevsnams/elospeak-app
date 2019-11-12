<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'LEGO') }} &#8212; @yield('pageTitle', '')</title>

    <!-- Font Pre-fetch -->
    <link rel="dns-prefetch" href="//fonts.gstatic.com">

    <!-- KR Fonts [@TODO if-else] -->
    <!-- link href="https://fonts.googleapis.com/css?family=Jua|Nanum+Gothic:400,700&display=swap&subset=korean" rel="stylesheet" -->

    <!-- Styles -->
    <link href="{{ asset('/dist/css/lib.css') }}" rel="stylesheet">
    <link href="{{ asset('/dist/css/main.css') }}" rel="stylesheet">

    @yield('pageCss')
    
</head>
<body>
    @yield('pageContent')

    <!-- Scripts -->
    <script src="{{ asset('/js/uikit-fa-icons.min.js') }}"></script>
    <script src="{{ asset('js/util.js') }}" defer></script>

    <script>
        window.ELOSpeak = {
            baseUrl: '<?php echo url('/') ?>'
        };

        function url(path) {
            return ELOSpeak.baseUrl + path;
        }
    </script>

    @yield('pageJavascript')

</body>
</html>