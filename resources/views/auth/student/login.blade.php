@extends('layouts.blank')
@section('pageTitle', 'Login')

@section('pageContent')
    <div class="uk-flex uk-flex-center">
        <div class="uk-width-large uk-border-rounded uk-box-shadow-large" id="login-container">
            <span class="uk-text-center font-patrick-hand login-header">Student Login</span>

            <form class="uk-form-stacked uk-padding uk-padding-remove-top" action="<?php echo route('student.auth') ?>" method="POST" autocomplete="off">
                @csrf

                @if(session('loginError'))
                    <div class="uk-alert-danger" uk-alert>
                        <a class="uk-alert-close" uk-close></a>
                        <p>{{ session('loginError') }}</p>
                    </div>
                @endif

                <div class="uk-margin">
                    <label class="uk-form-label" for="login-username">Username</label>
                    <div class="uk-inline uk-width-expand">
                        <span class="uk-form-icon" uk-icon="icon: lock"></span>
                        <input class="uk-input uk-width-expand uk-border-rounded" id="login-username" name="username" type="text">
                    </div>
                </div>

                <div class="uk-margin">
                    <label class="uk-form-label" for="login-password">Password</label>
                    <div class="uk-inline uk-width-expand">
                        <span class="uk-form-icon" uk-icon="icon: lock"></span>
                        <input class="uk-input uk-width-expand uk-border-rounded" id="login-password" name="password" type="password">
                    </div>
                </div>

                <div class="uk-grid-small" uk-grid>
                    <div class="uk-margin">
                        <button class="fncy-button fncy-orange" type="submit">Login</button>
                    </div>
                    <div class="uk-width-expand" style="padding-top: 10px;">
                        <label><input class="uk-checkbox" name="remember_me" type="checkbox"> Remember</label>
                    </div>
                </div>

                <div class="uk-margin uk-text-center">
                    <hr>
                    Start learning english!
                </div>
            </form>
        </div>
    </div>
@endsection

@section('pageCss')
<style>

.login-header {
    font-size: 4em;
    display: block;
    color: rgba(0, 0, 0, 0.5);
}
body {
    background: url('{{ asset('/img/green-bg.png') }}') repeat scroll;
}

#login-container {
    background: #fff;
    margin-top: 40px;
}
</style>
@endsection