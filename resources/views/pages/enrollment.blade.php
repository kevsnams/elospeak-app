@extends('layouts.front')

@section('title', 'Enrollment Form')

@section('content')
<h1 class="header mt-5 text-center">
    ENROLLMENT PLAN
</h1>
<p class="sub-header text-center">Ready to get started with us? Plan your classes using this form</p>

<div class="trans-pink">
    <div class="trans-blue">
        <div class="container enrollment">
            <div x-data="enrollment">
                <div x-show="step == 0">
                    <div class="white-form d-flex justify-content-center mt-3">
                        <div class="plan starter mr-3">
                            <h3 class="header text-center">STARTER</h3>

                            <div class="price">
                                <span class="currency">$</span>
                                <span class="money">5</span>
                                <span style="font-weight: normal; font-size: 1.5rem;">/class</span>

                                <p class="text-center mb-0" style="font-weight: normal">For the<br>casual learners</p>
                            </div>

                            <p class="text-center">
                                25-minute class
                            </p>

                            <button class="btn-gs btn-starter" @click="type = 1; nextStep()">Get started</button>
                        </div>

                        <div class="plan pro">
                            <h3 class="header text-center">PRO</h3>

                            <div class="price">
                                <span class="currency">$</span>
                                <span class="money">10</span>
                                <span style="font-weight: normal; font-size: 1.5rem;">/class</span>

                                <p class="text-center mb-0" style="font-weight: normal">For the<br>enthusiastic learners</p>
                            </div>

                            <p class="text-center">
                                50-minute class
                            </p>

                            <button class="btn-gs btn-pro" @click="type = 2; nextStep()">Get started</button>
                        </div>
                    </div>
                </div>

                <div x-show="step == 1">
                    <div class="white-form d-flex justify-content-center mt-3">
                        <div>
                            <div class="text-center">
                                <h3 class="header">Step 1: Classes</h3>
                                <span class="sub-header">How many classes do you want?</span>
                            </div>

                            <div class="mt-3">
                                <input type="text" x-ref="e_num_class">
                            </div>

                            <div class="mt-3">
                                <button class="btn btn-blue bluepink-button" @click="num_class = parseInt($refs.e_num_class.value); nextStep()">Next Step: Preferred Teacher</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div x-show="step == 2">
                    <div class="white-form d-flex justify-content-center mt-3">
                        <div>
                            <div class="text-center">
                                <h3 class="header">Step 2: Preferred Teacher</h3>
                                <span class="sub-header">Which teacher do you prefer?</span>
                            </div>

                            <select x-ref="e_teacher">
                                <option value="teacher_a">
                                    Teacher A
                                </option>

                                <option value="teacher_b">
                                    Teacher B
                                </option>
                            </select>

                            <div class="mt-3">
                                <button class="btn btn-blue bluepink-button" @click="teacher = $refs.e_teacher.value; nextStep()">Next Step: Personal Information</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div x-show="step == 3">
                    <div class="white-form d-flex justify-content-center mt-3">
                        <div>
                            <div class="text-center">
                                <h3 class="header">Step 3: Personal Information</h3>
                                <span class="sub-header">Let us know who you are :)</span>
                            </div>

                            <form id="test">
                                Name: <input type="text" x-ref="e_student_info_name">
                            </form>

                            <div class="mt-3">
                                <button class="btn btn-blue bluepink-button"
                                    @click="
                                        num_class = $refs.e_teacher.value; nextStep()
                                ">Submit Application</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

@endsection

@section('script')
<script type="module" src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js"></script>
<script nomodule src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine-ie11.min.js" defer></script>
<script>
    let enrollment = {
        step: 0,
        type: null,
        num_class: 0,
        teacher: null,
        student_info: {
            name: null
        }
    };

    function nextStep()
    {
        enrollment.step += 1;
    }
</script>
@endsection

@section('style')
    <style>
        .btn-gs {
            display: block;
            background: #fff;
            padding: 1rem;
            margin: 0 auto;
            font-weight: bold;
            border-radius: 1rem;
            cursor: pointer;
            padding: .5rem 1.5rem;
            font-size: .8rem;
            font-weight: normal;
        }
        .btn-starter {
            border: 1px solid #fc719f;
            color: #fc719f;
            transition-duration: 1s;
            transition-property: background, color, border;
        }
        .btn-starter:hover {
            background: #fc719f;
            color: #fff;
            border: 1px solid #b36880
            transition-duration: 1s;
            transition-property: background, color, border;
        }

        .btn-pro {
            border: 1px solid #92c2fd;
            color: #92c2fd;
            transition-duration: 1s;
            transition-property: background, color, border;
        }
        .btn-pro:hover {
            background: #92c2fd;
            color: #fff;
            border: 1px solid #8fb1db;
            transition-duration: 1s;
            transition-property: background, color, border;
        }

        .enrollment .white-form {
            width: 80%;
        }
        .plan {
            padding: 1rem;
            border-radius: .355rem;
            background: #fff;
        }

        .plan.starter .price {
            text-align: center;
            padding: 2rem;
            background: linear-gradient(50deg, rgba(146,194,253,1) 0%,
            rgba(194,158,211,0.633473457742472) 50%,
            rgba(252,113,159,1) 100%);
            color: #fff;
            font-weight: bold;
            margin-top: 1rem;
            text-shadow: 0px 1px #20436f;
        }

        .plan.pro .price {
            text-align: center;
            padding: 2rem;
            background: #92c2fda8;
            color: #3d4d62;
            font-weight: bold;
            margin-top: 1rem;
        }

        .plan .price {
            border-radius: .355rem;
        }
        .plan .price .currency {
            font-size: 2.5rem;
            display: block;
            float: left;
        }
        .plan .price .money {
            font-size: 4rem;
            letter-spacing: -4px;
        }
    </style>
@endsection
