@extends('layouts.app')

@section('pageTitle', 'Classes')
@section('pageHeader', 'Classes')
@section('vNav-active-classes', 'active')

@section('pageContent')
    <div id="classroom-notif" class="uk-width-expand uk-border-rounded">
        <div class="uk-text-center" style="margin-bottom: 10px;">
            <h1 class="font-patrick-hand status">Class Started</h1>
            <span class="uk-text-small">Schedule: 01:00 PM - 01:30 PM</span>
        </div>
        <div class="uk-flex uk-flex-center">
            <div class="participants">
                <img class="uk-border-circle uk-box-shadow-xlarge" width="150" height="150" src="https://a.imge.to/2019/08/07/AsQlR.jpg" alt="" /><br>
                <span>{{ Auth::guard('teacher')->user()->full_name }}</span>
            </div>
            <div class="participants">
                <img class="uk-border-circle uk-box-shadow-xlarge" width="150" height="150" src="https://a.imge.to/2019/08/07/AsKHC.png" alt="" />
                <span>Park Ji-hyo</span>
            </div>
        </div>
        <div class="uk-text-center" style="font-weight: 700">
            <p>You may now enter the classroom</p>
        </div>
        <div class="uk-flex uk-flex-center">
            <div class="uk-width-medium uk-text-center">
                <a href="{{ url('/classroom/') }}" class="uk-width-expand fncy-button fncy-orange font-patrick-hand" id="enter-classroom">Enter Classroom</a>
            </div>
        </div>
    </div>
@endsection

@section('pageJavascript')
@endsection