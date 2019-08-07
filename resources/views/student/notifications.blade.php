@extends('layouts.app')

@section('pageTitle', 'Notifications')
@section('pageHeader', 'Notifications')
@section('vNav-active-notifications', 'active')

@section('pageContent')
<hr>
<div class="notification unread uk-border-rounded">
    <small class="uk-align-right">Just now</small>
    <div class="from uk-clearfix">
        <img src="https://a.imge.to/2019/08/07/AsKHC.png" class="uk-border-circle uk-align-left uk-margin-remove-adjacent" width="50" height="50">
        <a class="person">Park Ji-hyo</a>
    </div>
    <div class="message">
        Our classroom is all set. Let's learning englishness! <a href="#">Go to classroom</a>
    </div>
</div>
<div class="notification uk-border-rounded">
    <small class="uk-align-right">5m ago</small>
    <div class="from uk-clearfix">
        <img src="https://a.imge.to/2019/08/07/AsKHC.png" class="uk-border-circle uk-align-left uk-margin-remove-adjacent" width="50" height="50">
        <a class="person">Park Ji-hyo</a>
    </div>
    <div class="message">
        Your class is about to start in 5 minutes. Be ready!
    </div>
</div>

<div class="notification uk-border-rounded">
    <small class="uk-align-right">10h ago</small>
    <div class="message">
        <i>[SYSTEM]</i>: You have successfully changed your email
    </div>
</div>

<div class="notification uk-border-rounded">
    <small class="uk-align-right">Yesterday 09:30 AM</small>
    <div class="message">
        <i>[SYSTEM]</i>: You added 190,000 KRW to you account
    </div>
</div>
@endsection