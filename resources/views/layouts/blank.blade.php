<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'LEGO') }} &#8212; @yield('pageTitle', '')</title>

    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css?family=Patrick+Hand|Quicksand:300,400,700&display=swap" rel="stylesheet">

    <!-- KR Fonts [@TODO if-else] -->
    <!-- link href="https://fonts.googleapis.com/css?family=Jua|Nanum+Gothic:400,700&display=swap&subset=korean" rel="stylesheet" -->

    <!-- Styles -->
    <link href="{{ asset('/uikit-3.1.7/css/uikit.min.css') }}" rel="stylesheet">
    <link href="{{ asset('css/main.css') }}" rel="stylesheet">

    @yield('pageCss')
    
</head>
<body>
    @yield('pageContent')

    <!-- Scripts -->
    <script src="{{ asset('/uikit-3.1.7/js/uikit.min.js') }}"></script>
    <script src="{{ asset('/uikit-3.1.7/js/uikit-icons.min.js') }}"></script>
    <script src="{{ asset('/js/uikit-fa-icons.min.js') }}"></script>
    <script src="{{ asset('js/underscore-1.9.1.min.js') }}"></script>
    <script src="{{ asset('js/axios.min.js') }}"></script>
    <script src="{{ asset('js/moment-2.24.0.min.js') }}"></script>
    <script src="{{ asset('js/util.js') }}" defer></script>

    <script>
        window.lego = {
            baseUrl: '<?php echo url('/') ?>'
        };

        axios.defaults.headers.common = {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        }

        function url(path) {
            return lego.baseUrl + path;
        }
    </script>

    @yield('pageJavascript')

</body>
</html>