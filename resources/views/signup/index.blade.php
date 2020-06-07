@extends('layouts.front')

@section('title', 'Signup Form')

@section('style')
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/pikaday/css/pikaday.css">
@endsection

@section('script')
    <script src="https://cdn.jsdelivr.net/npm/pikaday/pikaday.js"></script>
    <script>
        var now = new Date();
        var picker = new Pikaday({
            field: document.getElementById('signup-birthday'),
            yearRange: [now.getFullYear() - 100, now.getFullYear()],
            maxDate: now
        });
    </script>
@endsection

@section('content')
<h1 class="header mt-5 text-center">
    Signup Form
</h1>
<p class="sub-header text-center">
    Please fill up the form below so we can get you started
</p>

<div class="trans-pink">
    <div class="trans-blue">
        <div class="container pt-5">
            <form class="white-form" method="POST" action="{{ route('signup.save') }}">
                {{ csrf_field() }}

                @if (session('sent'))
                    <div class="box-success">
                        {{ session('sent') }}
                    </div>
                @endif

                <div class="field pb-3">
                    <span class="required">*</span> required fields
                </div>

                <div class="field">
                    <label for="signup-name">Full Name <span class="required">*</span></label>
                    <input type="text" required name="full_name" id="signup-name" value="{{ old('full_name') }}">
                    @error('full_name')
                        <div class="error">{{ $message }}</div>
                    @enderror
                </div>

                <div class="field">
                    <label for="signup-email">Email <span class="required">*</span></label>
                    <input type="email" required name="email" id="signup-email" value="{{ old('email') }}">
                    @error('email')
                        <div class="error">{{ $message }}</div>
                    @enderror
                </div>

                <div class="row mb-3">
                    <div class="col-4">
                        <div class="field">
                            <label for="signup-skype">Skype <span class="required">*</span></label>
                            <input type="text" id="signup-skype" required name="skype" value="{{ old('skype') }}">
                            @error('skype')
                                <div class="error">{{ $message }}</div>
                            @enderror
                        </div>
                    </div>

                    <div class="col-4">
                        <div class="field">
                            <label for="signup-contact-number">Contact No</label>
                            <input type="text" id="signup-contact-number" name="contact_number" value="{{ old('contact_number') }}">
                            @error('contact_number')
                                <div class="error">{{ $message }}</div>
                            @enderror
                        </div>
                    </div>

                    <div class="col-4">
                        <div class="field">
                            <label for="signup-birthday">Birthday</label>
                            <input type="text" id="signup-birthday" name="birthday" value="{{ old('birthday') }}">
                            @error('birthday')
                                <div class="error">{{ $message }}</div>
                            @enderror
                        </div>
                    </div>
                </div>

                <div class="field">
                    <label for="signup-message">Message</label>
                    <small>If you have any recommendations/suggestions for us, let us know.</small>
                    <textarea id="signup-message" name="message" rows="10">{{ old('message') }}</textarea>
                    @error('message')
                        <div class="error">{{ $message }}</div>
                    @enderror
                </div>

                <div class="field">
                    <label for="signup-captcha">Captcha <span class="required">*</span></label>
                    <div class="mt-3">{!! captcha_img() !!}</div>
                    <input type="text" required name="captcha" id="signup-captcha" style="width: 240px !important;">
                    @error('captcha')
                        <div class="error">{{ $message }}</div>
                    @enderror
                </div>

                <button type="submit" class="btn btn-blue bluepink-button mx-auto mt-4">Submit Application</button>
            </form>
        </div>
    </div>
</div>
@endsection
