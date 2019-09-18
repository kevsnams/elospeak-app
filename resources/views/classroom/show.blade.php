@extends('layouts.blank')

@section('pageContent')
    <div id="virtual-room">
        <div id="vr-sidenav">
            <div class="logo"><span class="a">ELO</span><span class="b">Speak</span></div>
            <div id="vr-client">
                <div class="uk-grid" uk-grid>
                    <div><img src="https://usercontent1.hubstatic.com/13400924.png" width="55" height="55" class="uk-border-circle"></div>
                    <div>
                        <span class="full_name">{{ $currentUser->full_name }}</span>
                        <a href="#">View Profile</a>
                    </div>
                </div>
            </div>

            <div id="vr-chats">
                <span class="title">CHATROOM</span>
                <div id="vr-chatbox"></div>
            </div>
            <div id="vr-typebox">
                <div class="wrapper">
                    <textarea class="typebox" id="sender-message"></textarea>
                    <button class="send fncy-button fncy-green" id="send-message-button"><span uk-icon="fa-paper-plane"></span></button>
                </div>
            </div>
        </div>
        <div id="vr-board">
            <div id="vr-db-0" class="vr-drawingboard"></div>
            <div id="vr-board-control">
                <ul class="nav">
                    <li>
                        <div style="padding-top: 5px;">
                            <span class="color-display black" uk-tooltip="Pen Color"></span>
                            <div class="popup" id="color-picker-drop" uk-drop="mode: click; pos: top-center;">
                                <span class="color-pick color-display black"></span>
                                <span class="color-pick color-display white"></span>
                                <span class="color-pick color-display yellow"></span>
                                <span class="color-pick color-display orange"></span>
                                <span class="color-pick color-display red"></span>
                            </div>
                        </div>
                    </li>

                    <li>
                        <div style="padding-top: 5px;">
                            <span uk-icon="icon: fa-pen-s; ratio: .6" class="floating-pen"></span>
                            <span class="thickness thick-1" uk-tooltip="Pen Thickness"></span>
                            <div class="popup" id="pen-size-drop" uk-drop="mode: click; pos: top-center;">
                                <span class="thickness-pick thickness thick-1" data-size="small"></span>
                                <span class="thickness-pick thickness thick-2" data-size="medium"></span>
                                <span class="thickness-pick thickness thick-3" data-size="large"></span>
                            </div>
                        </div>
                    </li>

                    <li>
                        <div>
                            <span uk-icon="icon: fa-shapes-s; ratio: .9" uk-tooltip="Shapes"></span>
                            <div class="popup" id="shapes-drop" uk-drop="mode: click; pos: top-center;">
                                <span data-shape='Square' uk-icon="icon: fa-square"></span>
                                <span data-shape='Star' uk-icon="icon: fa-star"></span>
                                <span data-shape='Circle' uk-icon="icon: fa-circle"></span>
                                <span data-shape='Rectangle' uk-icon="icon: file; ratio: 1.1" style="transform: rotate(90deg)"></span>
                            </div>
                        </div>
                    </li>

                    <li>
                        <span uk-icon="icon: fa-pen-s; ratio: .9" id="brush-tool" uk-tooltip="Brush Tool"></span>
                    </li>

                    <li>
                        <span uk-icon="icon: fa-greater-than-s; ratio: .9" id="select-tool" uk-tooltip="Select Tool" style="transform: rotate(220deg)"></span>
                    </li>

                    <li>
                        <span uk-icon="icon: fa-eraser-s; ratio: .9" id="eraser-tool" uk-tooltip="Eraser"></span>
                    </li>

                    <li>
                        <span uk-icon="icon: fa-file-import-s; ratio: .9" uk-tooltip="Import Lesson"></span>
                    </li>
                    <li>
                        <span uk-icon="icon: fa-cog-s; ratio: .9" uk-tooltip="Settings"></span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
@endsection

@section('pageCss')
<style type="text/css">
::-webkit-scrollbar{width:10px}::-webkit-scrollbar-track{background:#7b7b7b;border-radius:5px}::-webkit-scrollbar-thumb{background:#d8d8d8;border-radius:5px}
</style>
@endsection

@section('pageJavascript')
<script src="{{ asset('/dist/js/classroom.js') }}"></script>
<script>
const board = document.getElementById('vr-board');
const boardcontrol = document.getElementById('vr-board-control');

let crWindowResize = function(wait) {
    return _.debounce(function(evt) {
        let midpos = board.getBoundingClientRect().width / 2;
        let halfboardcontrol = boardcontrol.getBoundingClientRect().width / 2;

        boardcontrol.style.marginLeft = (midpos - halfboardcontrol) +'px';
    }, wait);
};

window.addEventListener('load', function(evt) {
    crWindowResize(0).call(null);
}, false);

window.addEventListener('resize', crWindowResize(200), false);
</script>
@endsection