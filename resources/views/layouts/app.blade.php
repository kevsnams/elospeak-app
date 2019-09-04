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

    <!-- KR Fonts [@TODO if-else] -->
    <!-- link href="https://fonts.googleapis.com/css?family=Jua|Nanum+Gothic:400,700&display=swap&subset=korean" rel="stylesheet" -->

    <!-- Styles -->
    <link href="{{ asset('/dist/css/lib.css') }}" rel="stylesheet">
    <link href="{{ asset('/dist/css/main.css') }}" rel="stylesheet">

    @yield('pageCss')
    
</head>
<body>
    <div id="main-app">
        <div id="left-column">
            <div class="uk-padding">
                <div class="uk-text-center">
                    <img class="uk-border-circle" width="100" height="100" src="https://a.imge.to/2019/08/07/AsQlR.jpg" alt="" />
                    <a href="#" class="student-full-name">
                        <span class="uk-text-small" style="display: block"><?php echo Auth::guard('student')->user()->full_name ?></span>
                    </a>
                </div>
                <hr>
                @include('includes.sideNav', [
                    'id' => 'side-nav',
                    'class' => 'vertical-nav',
                    'items' => [
                        [
                            'text' => 'Classes',
                            'route' => route('student.index'),
                            'icon' => 'fa-chalkboard-teacher-s',
                            'active' => 'classes'
                        ],
                        [
                            'text' => 'Notifications',
                            'route' => route('student.notifications'),
                            'icon' => 'fa-bell',
                            'active' => 'notifications'
                        ],
                        [
                            'text' => 'Feedbacks',
                            'route' => route('student.feedbacks'),
                            'icon' => 'fa-comment-alt',
                            'active' => 'feedbacks'
                        ],
                        [
                            'text' => 'Balance',
                            'route' => route('student.balance'),
                            'icon' => 'fa-money-check-s',
                            'active' => 'balance'
                        ]
                    ]
                ])
            </div>
        </div>

        <div id="right-column">
            <div class="uk-padding">
                <div class="content-header">
                    <div class="uk-grid" uk-grid>
                        <div class="uk-width-expand">
                            @hasSection('pageHeader')
                                <span>@yield('pageHeader')</span>
                            @endif
                        </div>
                        <div class="uk-width-small">
                            <a href="#" class="uk-text-right" style="display: block"><span uk-icon="icon: fa-angle-down-s; ratio: 1.5"></span></a>
                            <div uk-dropdown="mode:click">
                                <ul class="uk-nav uk-dropdown-nav">
                                    <li class="uk-nav-header">Settings</li>
                                    <li><a href="#">Account</a></li>
                                    <li><a href="#">Payment</a></li>
                                    <li><a href="#">Contact Us</a></li>
                                    <li class="uk-nav-divider"></li>
                                    <li><a href="{{ route('student.logout') }}">Logout</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                @yield('pageContent')
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="{{ asset('/dist/js/lib.js') }}"></script>
    <script src="{{ asset('/js/uikit-fa-icons.min.js') }}"></script>
    <script src="{{ asset('js/util.js') }}" defer></script>

    <script>
        window.lego = {
            baseUrl: '<?php echo url('/') ?>'
        };

        function url(path) {
            return lego.baseUrl + path;
        }
    </script>

    @yield('pageJavascript')

</body>
</html>