@extends('layouts.front')

@section('title', 'Contact Us')

@section('content')
<h1 class="header mt-5 text-center">
    CONTACT US
</h1>
<p class="sub-header text-center">Are you ready to start learning? Send us a message.</p>

<div class="trans-pink">
    <div class="trans-blue">
        <div class="container contact">
            <form class="contact-form" method="POST" action="{{ route('pages.send-message') }}">
                {{ csrf_field() }}

                @if (session('sent'))
                    <div class="success">
                        Message sent. We will get back to you shortly.
                    </div>
                @endif

                <div class="field pb-3">
                    <span class="required">*</span> required fields
                </div>

                <div class="field">
                    <label for="contact-name">Full Name <span class="required">*</span></label>
                    <input type="text" required name="full_name" id="contact-name" value="{{ old('full_name') }}">
                    @error('full_name')
                        <div class="error">{{ $message }}</div>
                    @enderror
                </div>

                <div class="field">
                    <label for="contact-email">Email <span class="required">*</span></label>
                    <input type="email" required name="email" id="contact-email" value="{{ old('email') }}">
                    @error('email')
                        <div class="error">{{ $message }}</div>
                    @enderror
                </div>

                <div class="field">
                    <label for="contact-message">Message <span class="required">*</span></label>
                    <textarea id="contact-message" required name="message" rows="10">{{ old('message') }}</textarea>
                    @error('message')
                        <div class="error">{{ $message }}</div>
                    @enderror
                </div>

                <div class="field">
                    <label for="contact-captcha">Captcha <span class="required">*</span></label>
                    <div class="mt-3">{!! captcha_img() !!}</div>
                    <input type="text" required name="captcha" id="contact-captcha" style="width: 240px !important;">
                    @error('captcha')
                        <div class="error">{{ $message }}</div>
                    @enderror
                </div>

                <button type="submit" class="btn btn-blue contact-submit">Send Message</button>

                <div class="divider mt-5 mb-5"></div>
                <h1 class="header text-center">You can also reach us at</h1>

                <div class="d-flex justify-content-center mt-4 cu-socmed">

                    @if (count($socmeds))
                        @foreach ($socmeds as $socmed => $url)
                            @php
                                if ($socmed == 'email') {
                                    continue;
                                }
                            @endphp

                            <div class="soc">
                                <a href="{{ $url }}" class="blue-link">{{ ucfirst($socmed) }}</a>
                            </div>
                        @endforeach
                    @endif

                </div>

                <div class="divider mt-3 mb-3"></div>
                <h1 class="header text-center mt-4">Or email us</h1>
                <p class="sub-header text-center">{{ $socmeds['email'] }}</p>
            </form>
        </div>
    </div>
</div>
@endsection
