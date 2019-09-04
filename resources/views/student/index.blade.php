@extends('layouts.app')

@section('pageTitle', 'Classes')
@section('pageHeader', 'Classes')
@section('vNav-active-classes', 'active')

@section('pageContent')
    <nav id="classroom-nav" uk-switcher="connect: #classroom-switch; animation: uk-animation-slide-left-medium">
        <a href="#"><span>Open</span></a>
        <a href="#"><span>Upcoming</span></a>
        <a href="#"><span>History</span></a>
    </nav>
    <div id="classroom-switch" class="uk-switcher">
        <div>
            <div id="classroom-notif" class="uk-width-expand uk-border-rounded">
                <div class="uk-text-center" style="margin-bottom: 10px;">
                    <h1 class="font-patrick-hand status">Class Started</h1>
                    <span class="uk-text-small">Schedule: 01:00 PM - 01:30 PM</span>
                </div>
                <div class="uk-flex uk-flex-center">
                    <div class="participants">
                        <img class="uk-border-circle uk-box-shadow-xlarge" width="150" height="150" src="https://a.imge.to/2019/08/07/AsQlR.jpg" alt="" /><br>
                        <span>{{ Auth::guard('student')->user()->full_name }}</span>
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
                        <a href="{{ url('/classroom/1') }}" class="uk-width-expand fncy-button fncy-orange font-patrick-hand" id="enter-classroom">Enter Classroom</a>
                    </div>
                </div>
            </div>
        </div>
        
        <div>
            <table class="uk-table uk-table-justify">
                <thead>
                    <tr>
                        <th>Teacher</th>
                        <th class="uk-width-small">Date</th>
                        <th class="uk-width-small">Start</th>
                        <th class="uk-width-small">End</th>
                        <th class="uk-width-small">&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <img class="uk-box-shadow-medium uk-border-circle uk-align-left uk-margin-remove-adjacent" style="margin-right: 20px !important" width="50" height="50" src="https://a.imge.to/2019/08/07/AsKHC.png">
                            <div style="margin-top: 13px !important">
                                <a href="#">Park Ji-hyo</a>
                            </div>
                        </td>
                        <td>
                            <span style="padding-top: 16px; display: block">12 August 2019</span>
                        </td>
                        <td>
                            <span style="padding-top: 16px; display: block">01:00 PM</span>
                        </td>
                        <td>
                            <span style="padding-top: 16px; display: block">01:30 PM</span>
                        </td>
                        <td>
                            <span style="padding-top: 16px; display: block">
                                <a href="#">View Details</a>
                            </span>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <img class="uk-box-shadow-medium uk-border-circle uk-align-left uk-margin-remove-adjacent" style="margin-right: 20px !important" width="50" height="50" src="https://a.imge.to/2019/08/07/AsKHC.png">
                            <div style="margin-top: 13px !important">
                                <a href="#">Park Ji-hyo</a>
                            </div>
                        </td>
                        <td>
                            <span style="padding-top: 16px; display: block">13 August 2019</span>
                        </td>
                        <td>
                            <span style="padding-top: 16px; display: block">01:00 PM</span>
                        </td>
                        <td>
                            <span style="padding-top: 16px; display: block">01:30 PM</span>
                        </td>
                        <td>
                            <span style="padding-top: 16px; display: block">
                                <a href="#">View Details</a>
                            </span>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <img class="uk-box-shadow-medium uk-border-circle uk-align-left uk-margin-remove-adjacent" style="margin-right: 20px !important" width="50" height="50" src="https://a.imge.to/2019/08/07/AsKHC.png">
                            <div style="margin-top: 13px !important">
                                <a href="#">Park Ji-hyo</a>
                            </div>
                        </td>
                        <td>
                            <span style="padding-top: 16px; display: block">14 August 2019</span>
                        </td>
                        <td>
                            <span style="padding-top: 16px; display: block">01:00 PM</span>
                        </td>
                        <td>
                            <span style="padding-top: 16px; display: block">01:30 PM</span>
                        </td>
                        <td>
                            <span style="padding-top: 16px; display: block">
                                <a href="#">View Details</a>
                            </span>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <img class="uk-box-shadow-medium uk-border-circle uk-align-left uk-margin-remove-adjacent" style="margin-right: 20px !important" width="50" height="50" src="https://a.imge.to/2019/08/07/AsKHC.png">
                            <div style="margin-top: 13px !important">
                                <a href="#">Park Ji-hyo</a>
                            </div>
                        </td>
                        <td>
                            <span style="padding-top: 16px; display: block">15 August 2019</span>
                        </td>
                        <td>
                            <span style="padding-top: 16px; display: block">01:00 PM</span>
                        </td>
                        <td>
                            <span style="padding-top: 16px; display: block">01:30 PM</span>
                        </td>
                        <td>
                            <span style="padding-top: 16px; display: block">
                                <a href="#">View Details</a>
                            </span>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <img class="uk-box-shadow-medium uk-border-circle uk-align-left uk-margin-remove-adjacent" style="margin-right: 20px !important" width="50" height="50" src="https://a.imge.to/2019/08/07/AsKHC.png">
                            <div style="margin-top: 13px !important">
                                <a href="#">Park Ji-hyo</a>
                            </div>
                        </td>
                        <td>
                            <span style="padding-top: 16px; display: block">16 August 2019</span>
                        </td>
                        <td>
                            <span style="padding-top: 16px; display: block">01:00 PM</span>
                        </td>
                        <td>
                            <span style="padding-top: 16px; display: block">01:30 PM</span>
                        </td>
                        <td>
                            <span style="padding-top: 16px; display: block">
                                <a href="#">View Details</a>
                            </span>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <img class="uk-box-shadow-medium uk-border-circle uk-align-left uk-margin-remove-adjacent" style="margin-right: 20px !important" width="50" height="50" src="https://a.imge.to/2019/08/07/AsKHC.png">
                            <div style="margin-top: 13px !important">
                                <a href="#">Park Ji-hyo</a>
                            </div>
                        </td>
                        <td>
                            <span style="padding-top: 16px; display: block">17 August 2019</span>
                        </td>
                        <td>
                            <span style="padding-top: 16px; display: block">01:00 PM</span>
                        </td>
                        <td>
                            <span style="padding-top: 16px; display: block">01:30 PM</span>
                        </td>
                        <td>
                            <span style="padding-top: 16px; display: block">
                                <a href="#">View Details</a>
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div>
            <table class="uk-table uk-table-justify">
                <thead>
                    <tr>
                        <th>Teacher</th>
                        <th class="uk-width-small">Date</th>
                        <th class="uk-width-small">Start</th>
                        <th class="uk-width-small">End</th>
                        <th class="uk-width-small">&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <img class="uk-box-shadow-medium uk-border-circle uk-align-left uk-margin-remove-adjacent" style="margin-right: 20px !important" width="50" height="50" src="https://a.imge.to/2019/08/07/AsKHC.png">
                            <div style="margin-top: 13px !important">
                                <a href="#">Park Ji-hyo</a>
                            </div>
                        </td>
                        <td>
                            <span style="padding-top: 16px; display: block">12 August 2019</span>
                        </td>
                        <td>
                            <span style="padding-top: 16px; display: block">01:00 PM</span>
                        </td>
                        <td>
                            <span style="padding-top: 16px; display: block">01:30 PM</span>
                        </td>
                        <td>
                            <span style="padding-top: 16px; display: block">
                                <a href="#">View Details</a>
                            </span>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <img class="uk-box-shadow-medium uk-border-circle uk-align-left uk-margin-remove-adjacent" style="margin-right: 20px !important" width="50" height="50" src="https://a.imge.to/2019/08/07/AsKHC.png">
                            <div style="margin-top: 13px !important">
                                <a href="#">Park Ji-hyo</a>
                            </div>
                        </td>
                        <td>
                            <span style="padding-top: 16px; display: block">13 August 2019</span>
                        </td>
                        <td>
                            <span style="padding-top: 16px; display: block">01:00 PM</span>
                        </td>
                        <td>
                            <span style="padding-top: 16px; display: block">01:30 PM</span>
                        </td>
                        <td>
                            <span style="padding-top: 16px; display: block">
                                <a href="#">View Details</a>
                            </span>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <img class="uk-box-shadow-medium uk-border-circle uk-align-left uk-margin-remove-adjacent" style="margin-right: 20px !important" width="50" height="50" src="https://a.imge.to/2019/08/07/AsKHC.png">
                            <div style="margin-top: 13px !important">
                                <a href="#">Park Ji-hyo</a>
                            </div>
                        </td>
                        <td>
                            <span style="padding-top: 16px; display: block">14 August 2019</span>
                        </td>
                        <td>
                            <span style="padding-top: 16px; display: block">01:00 PM</span>
                        </td>
                        <td>
                            <span style="padding-top: 16px; display: block">01:30 PM</span>
                        </td>
                        <td>
                            <span style="padding-top: 16px; display: block">
                                <a href="#">View Details</a>
                            </span>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <img class="uk-box-shadow-medium uk-border-circle uk-align-left uk-margin-remove-adjacent" style="margin-right: 20px !important" width="50" height="50" src="https://a.imge.to/2019/08/07/AsKHC.png">
                            <div style="margin-top: 13px !important">
                                <a href="#">Park Ji-hyo</a>
                            </div>
                        </td>
                        <td>
                            <span style="padding-top: 16px; display: block">15 August 2019</span>
                        </td>
                        <td>
                            <span style="padding-top: 16px; display: block">01:00 PM</span>
                        </td>
                        <td>
                            <span style="padding-top: 16px; display: block">01:30 PM</span>
                        </td>
                        <td>
                            <span style="padding-top: 16px; display: block">
                                <a href="#">View Details</a>
                            </span>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <img class="uk-box-shadow-medium uk-border-circle uk-align-left uk-margin-remove-adjacent" style="margin-right: 20px !important" width="50" height="50" src="https://a.imge.to/2019/08/07/AsKHC.png">
                            <div style="margin-top: 13px !important">
                                <a href="#">Park Ji-hyo</a>
                            </div>
                        </td>
                        <td>
                            <span style="padding-top: 16px; display: block">16 August 2019</span>
                        </td>
                        <td>
                            <span style="padding-top: 16px; display: block">01:00 PM</span>
                        </td>
                        <td>
                            <span style="padding-top: 16px; display: block">01:30 PM</span>
                        </td>
                        <td>
                            <span style="padding-top: 16px; display: block">
                                <a href="#">View Details</a>
                            </span>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <img class="uk-box-shadow-medium uk-border-circle uk-align-left uk-margin-remove-adjacent" style="margin-right: 20px !important" width="50" height="50" src="https://a.imge.to/2019/08/07/AsKHC.png">
                            <div style="margin-top: 13px !important">
                                <a href="#">Park Ji-hyo</a>
                            </div>
                        </td>
                        <td>
                            <span style="padding-top: 16px; display: block">17 August 2019</span>
                        </td>
                        <td>
                            <span style="padding-top: 16px; display: block">01:00 PM</span>
                        </td>
                        <td>
                            <span style="padding-top: 16px; display: block">01:30 PM</span>
                        </td>
                        <td>
                            <span style="padding-top: 16px; display: block">
                                <a href="#">View Details</a>
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
@endsection

@section('pageJavascript')
@endsection