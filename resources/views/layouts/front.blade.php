<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <link rel="dns-prefetch" href="//fonts.gstatic.com">

    <meta charset="utf-8">
    {{--- <meta name="viewport" content="width=device-width, initial-scale=1"> ---}}
    <meta name="viewport" content="width=1024">
    <link rel="shortcut icon" type="image/x-icon" href="{{ asset('/favicon.ico') }}">
    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'ELOSpeak') }} &#8212; @yield('title', '')</title>

    <link href="https://fonts.googleapis.com/css?family=Open+Sans|Roboto+Slab:400,700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('/front/css/normalize.css') }}">
    <link rel="stylesheet" href="{{ asset('/front/css/bootstrap-grid.min.css') }}">
    <link rel="stylesheet" href="{{ asset('/front/css/main.css') }}">

    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-164284958-1"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'UA-164284958-1');
    </script>
</head>
<body>
<div class="container">
    <div class="d-flex justify-content-between align-items-center">
        <div class="logo">
            <a href="{{ url('/') }}">
                <img class="mt-3" src="{{ asset('/front/img/logo-small.png') }}" alt="ELOSpeak Logo">
            </a>
        </div>

        <div class="nav">
            <nav>
                <ul>
                    <li>
                        <a href="{{ url('/') }}" <?php echo $currentPage == 'home' ? 'class="active"' : '' ?>>HOME</a>
                    </li>
                    <li>
                        <a href="{{ route('pages.classes') }}" <?php echo $currentPage == 'classes' ? 'class="active"' : '' ?>>CLASSES</a>
                    </li>
                    <li>
                        <a href="{{ route('pages.teachers') }}" <?php echo $currentPage == 'teachers' ? 'class="active"' : '' ?>>OUR TEACHERS</a>
                    </li>
                    <li>
                        <a href="{{ route('pages.contact') }}" class="cta">CONTACT</a>
                    </li>
                    <li>
                        <a href="{{ route('pages.faqs') }}" <?php echo $currentPage == 'faqs' ? 'class="active"' : '' ?>>FAQs</a>
                    </li>

                    <li>
                        <a href="{{ route('login') }}" class="cta-blue <?php echo $currentPage == 'login' ? 'active' : '' ?>">LOGIN</a>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</div>

@yield('content')

<div class="container">
    <div class="divider mt-5 mb-5"></div>

    <footer class="d-flex align-items-center mb-5">
        <div class="mr-2">Follow Us</div>


        @if (count($socmeds))
            @if (isset($socmeds['facebook']))
                <a href="{{ $socmeds['facebook'] }}">
                    <img src="{{ url('/front/img/fb.png') }}">
                </a>
            @endif

            @if (isset($socmeds['instagram']))
                <a href="{{ $socmeds['instagram'] }}">
                    <img src="{{ url('/front/img/ig.png') }}">
                </a>
            @endif


            @if (isset($socmeds['skype']))
                <a href="{{ $socmeds['skype'] }}">
                    <img src="{{ url('/front/img/skype.png') }}">
                </a>
            @endif

            @if (isset($socmeds['twitter']))
                <a href="{{ $socmeds['twitter'] }}">
                    <img src="{{ url('/front/img/twitter.png') }}">
                </a>
            @endif
        @endif
    </footer>
</div>

@yield('script')

</body>
</html>
