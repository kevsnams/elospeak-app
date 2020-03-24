@extends('layouts.front')

@section('title', 'FAQs - Frequently Asked Questions')

@section('content')
<h1 class="header mt-5 text-center">
    FREQUENTLY ASKED QUESTIONS
</h1>

<div class="container mt-4">
    <div class="d-flex flex-column faqs">
        <a href="#" class="question faq-1">
            <span></span>
            Are the classes free?
        </a>
        <div class="answer faq-1" hidden>
            We offer a 15-minute free class.
        </div>
        
        
        <a href="#" class="question faq-2">
            <span></span>
            How can the student contact you?
        </a>
        <div class="answer faq-2" hidden>
            For any inquiries the student can contact us on our website. (insert contact info.) Or click the "Contact" page above.
        </div>
        
        
        <a href="#" class="question faq-3">
            <span></span>
            How much does it cost?
        </a>
        <div class="answer faq-3" hidden>
            Rates for 25-minute class and 50-minute class may differ. 25-minute class costs 9,200 won. Weekend classes(50 minutes class) cost 18, 400 won.
        </div>
        
        
        <a href="#" class="question faq-4">
            <span></span>
            What is the duration of each session and how much time per session?
        </a>
        <div class="answer faq-4" hidden>
            We have 25 and 50-minute class (depending on the student requirement). 25 minutes is considered as 1 session and 50 minutes is considered as 2 sessions class.
        </div>
        
        
        <a href="#" class="question faq-5">
            <span></span>
            Can the student start at any date/time?
        </a>
        <div class="answer faq-5" hidden>
            The student can choose from the available time the Systems Administrator will provide.
        </div>
        
        
        <a href="#" class="question faq-6">
            <span></span>
            Does enrollment fee includes textbooks/E-books?
        </a>
        <div class="answer faq-6" hidden>
            Yes, we have free Ebooks and lesson materials available for the students. We provide a wide variety of teaching materials that will suit students in any English communication level (Beginner, Intermediate, Advanced)
        </div>
        
        
        <a href="#" class="question faq-7">
            <span></span>
            Can the student pick the teacher?
        </a>
        <div class="answer faq-7" hidden>
            (Siguro, you may pick if teacher is available???) NO. The Administrator will match a teacher for the student. If there are problems with the teacher, the admin will evaluate and will match the student with another teacher. 
        </div>
        
        
        <a href="#" class="question faq-8">
            <span></span>
            When does the student receive the progress report?
        </a>
        <div class="answer faq-8" hidden>
            Our teachers will give monthly progress report to the student or the parents.
        </div>
        
        
        <a href="#" class="question faq-9">
            <span></span>
            When will the student pay?
        </a>
        <div class="answer faq-9" hidden>
            The student must pay in advance a month’s worth or about 20 classes fee.
        </div>
        
        
        <a href="#" class="question faq-10">
            <span></span>
            What are the acceptable payment methods?
        </a>
        <div class="answer faq-10" hidden>
            We currently accept the following payment methods: WeChat Pay &amp; Bank Transfer. We will add more soon.
        </div>
        
        
        <a href="#" class="question faq-11">
            <span></span>
            What will the students do if he/she needs technical assistance?
        </a>
        <div class="answer faq-11" hidden>
            The student can directly contact the System Administrator via Skype, Kakaotalk, or just dial 123456. Just the one most convenient to you.
        </div>
        
        
        <a href="#" class="question faq-12">
            <span></span>
            What if the student changes his/her mind and want to drop class? 
        </a>
        <div class="answer faq-12" hidden>
            The student can drop the class. However, he/she must pay a cancellation fee. (See terms and conditions) 
        </div>
        
        
        <a href="#" class="question faq-13">
            <span></span>
            Will the student get his/her money back? Is it transferable or refundable?
        </a>
        <div class="answer faq-13" hidden>
            It’s non-refundable but transferable.
        </div>
        
        
        <a href="#" class="question faq-14">
            <span></span>
            How old will the student have to be to enroll?
        </a>
        <div class="answer faq-14" hidden>
            The student should be 6 years old or at least has knowledge in basic English
        </div>
        
        
        <a href="#" class="question faq-15">
            <span></span>
            Can the student customize his/her lesson?
        </a>
        <div class="answer faq-15" hidden>
            Yes
        </div>
        
        
        <a href="#" class="question faq-16">
            <span></span>
            Where will the classes be held?
        </a>
        <div class="answer faq-16" hidden>
            Classes will be held through our Online Virtual Board
        </div>
        
        
        <a href="#" class="question faq-17">
            <span></span>
            Can the student or the parents give evaluation to the teacher?
        </a>
        <div class="answer faq-17" hidden>
            Yes
        </div>
        
        <a href="#" class="question faq-18">
            <span></span>
            How will the students get access to the class materials?
        </a>
        <div class="answer faq-18" hidden>
            The System Administrator will provide the student his/her access to the lesson materials.
        </div>
    </div>
</div>
@endsection

@section('script')

<script type="text/javascript">
    document.querySelectorAll('.question').forEach((question) => {
        question.addEventListener('click', (evt) => {
            evt.preventDefault();
            
            let faq = evt.target.classList.item(1);
            let selected = document.querySelector(`.answer.${faq}`);
            
            document.querySelectorAll('.answer').forEach((answer) => {
                answer.setAttribute('hidden', true);
            });
            
            selected.removeAttribute('hidden');
        }, false);
    });
</script>

@endsection