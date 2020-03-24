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
            <form class="contact-form" novalidate>
                <div class="field">
                    <label for="contact-name">Full Name</label>
                    <input type="text" name="full_name" id="contact-name">
                </div>
                
                <div class="field">
                    <label for="contact-email">Email</label>
                    <input type="email" name="email" id="contact-email">
                </div>
                
                <div class="field">
                    <label for="contact-message">Message</label>
                    <textarea id="contact-message" name="message" rows="10"></textarea>
                </div>
                
                <button type="submit" class="btn btn-blue contact-submit">Send Message</button>
                
                <div class="divider mt-5 mb-5"></div>
                <h1 class="header text-center">You can also reach us at</h1>
                
                <div class="d-flex justify-content-center mt-4">
                    <div class="mr-3">
                        Facebook
                    </div>
                    <div class="mr-3">
                        Twitter
                    </div>
                    <div class="mr-3">
                        Instagram
                    </div>
                    <div class="mr-3">
                        Skype
                    </div>
                </div>
                
                <div class="divider mt-3 mb-3"></div>
                <h1 class="header text-center mt-4">Or email us</h1>
                <p class="sub-header text-center">elospeak@gmail.com</p>
            </form>
        </div>
    </div>
</div>
@endsection