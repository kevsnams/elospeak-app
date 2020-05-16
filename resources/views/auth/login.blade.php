@extends('layouts.front')

@section('title', 'Login Portal')

@section('content')
    <h1 class="header mt-5 text-center">
        Login
    </h1>
    <p class="sub-header text-center">Let's start learning English!</p>

    <div class="trans-pink">
        <div class="trans-blue">
            <div class="container login">
                <form class="white-form" method="POST" action="{{ route('login.auth') }}">
                    <div class="d-flex justify-content-center mb-3 login-switcher">
                        <div class="switch switch-active" data-auth-type="student">
                            I am a Student
                        </div>

                        <div class="switch" data-auth-type="teacher">
                            I am a Teacher
                        </div>
                    </div>

                    <input type="hidden" name="auth_type" id="login-auth_type">

                    {{ csrf_field() }}

                    @error('login')
                        <div class="box-error">Incorrect Username or Password. Please try again.</div>
                    @enderror

                    <div class="field">
                        <label for="login-username">Username</label>
                        <input type="text" required name="username" id="login-username">
                    </div>

                    <div class="field">
                        <label for="login-password">Password</label>
                        <input type="password" required name="password" id="login-password">
                    </div>

                    <div class="row">
                        <div class="col-auto">
                            <button type="submit" class="btn btn-blue bluepink-button">Login</button>
                        </div>
                        <div class="col-auto">
                            <div class="pt-3">
                                <input type="checkbox" name="remember_me" id="login-remember">
                                <label for="login-remember">Remember Login</label>
                            </div>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    </div>
@endsection

@section('script')
    <script>

        @error('auth_type')
            const returnedAuthType = '{{ $message }}';
        @enderror

        function setAuthType(type)
        {
            const loginAuthType = document.getElementById('login-auth_type');
            loginAuthType.value = type;

            document.querySelector('.switch.switch-active').classList.remove('switch-active');
            document.querySelector('[data-auth-type="'+ type +'"]').classList.add('switch-active');
        }

        const initAuth = typeof returnedAuthType === 'undefined' ? 'student' : returnedAuthType;
        setAuthType(initAuth);

        document.querySelectorAll('.switch').forEach((element) => {
            element.addEventListener('click', (evt) => {
                setAuthType(evt.target.getAttribute('data-auth-type'));
            });
        });
    </script>
@endsection

