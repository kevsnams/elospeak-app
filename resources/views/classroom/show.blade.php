@extends('layouts.blank')

@section('pageContent')
    <div id="file-dropZone" class="file-upload" uk-form-custom>
        <input type="file" multiple>
        <div class="dropbox">
            <h3>Drop Files Here</h3>
            <span>Allowed extensions are: jpg/jpeg and png</span>
        </div>
    </div>

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
            <div id="vr-tabs"></div>
            <div id="vr-db-0" class="vr-drawingboard"></div>
        </div>
    </div>

    <div id="vr-toolbox">
        <a href="#" id="toolbox-toggle"><span uk-icon="triangle-down"></span> Tools</a>
        <div class="toolbox">
            <div class="uk-grid" uk-grid>
                <div class="uk-width-1-3">
                    <div style="padding: 10px;">
                        <span class="divider">MODES</span>
                        <div class="tools">
                            <a href="#" id="tool-brush" data-tool="brush" class="tool-button">Brush</a>
                            <a href="#" id="tool-eraser" data-tool="eraser" class="tool-button">Eraser</a>
                            <a href="#" id="tool-shapes" data-tool="shapes" class="tool-button">Shapes</a>
                            <a href="#" id="tool-select" data-tool="select" class="tool-button">Select</a>
                        </div>
                    </div>
                </div>

                <div class="uk-width-1-3" id="vr-toolbox-controls"></div>

                <div class="uk-width-1-3">
                    <span class="divider">IMPORT IMAGES</span>
                    <form>
                        <div class="uk-margin">
                            <div uk-form-custom>
                                <input type="file" id="file-input" multiple accept="image/*">
                                <button class="uk-button uk-button-default" type="button" style="background-color: #ffffff">Select</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('pageCss')
<style type="text/css">
::-webkit-scrollbar {
    width: 10px;
}

::-webkit-scrollbar-track {
    background:#7b7b7b;
    border-radius:5px;
}

::-webkit-scrollbar-thumb {
    background:#d8d8d8;
    border-radius:5px;
}
</style>
@endsection

@section('pageJavascript')
<script src="{{ asset('/dist/js/classroom-v2.js') }}"></script>
@endsection