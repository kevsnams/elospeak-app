@extends('layouts.blank_nolibjs')

@section('pageContent')
    <div id="classroom"></div>
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
    <script src="{{ asset('/dist/js/classroom-v3.js') }}"></script>
@endsection

    <?php /**
@section('pageContent')
    @if ($currentUserType === 'teacher')
        <div id="file-dropZone" class="file-upload" uk-form-custom>
            <input type="file" multiple>
            <div class="dropbox">
                <h3>Drop Files Here</h3>
                <span>Allowed extensions are: jpg/jpeg and png</span>
            </div>
        </div>

        <div id="file-upload-progress">
            <div class="progressbox">
                <h3>Uploading <span class="current"></span> of <span class="total"></span> image(s)</h3>
                <progress class="progress uk-progress" value="" max=""></progress>
            </div>
        </div>
    @endif

    <div id="virtual-room">
        <div id="vr-sidenav">
            <div class="logo"><span class="a">ELO</span><span class="b">Speak</span></div>
            <div id="vr-client">
                <span class="label">You're having a class with:</span>
                <div class="client-card {{ $otherUser->user_type }}">
                    <div class="type">{{ ucfirst($otherUser->user_type) }}</div>
                    <div class="details">
                        <img src="https://usercontent1.hubstatic.com/13400924.png" width="80" height="80" class="uk-border-circle">
                        <div class="full-name">
                            <a href="#">{{ $otherUser->full_name }}</a>
                        </div>
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
                </div>
            </div>
            <span class="info-mute">Press ENTER to send message</span>
        </div>

        <div id="vr-board">
            <div id="vr-tabs"></div>
            <div id="vr-drawingboard" class="vr-drawingboard"></div>
        </div>
    </div>

    @if ($currentUserType === 'teacher')
        <div id="vr-toolbox">
            <a href="#" id="toolbox-toggle"><span id="toolbox-toggle-icon" uk-icon="triangle-down"></span> Tools</a>
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
                            <div class="tools">
                                <a href="#" id="tool-clear" data-tool="brush" class="tool-button">Clear</a>
                            </div>
                            <div class="undo-redo">
                                <span class="divider">HISTORY</span>
                                <div class="tools">
                                    <a href="#" id="history-undo"><span uk-icon="history"></span></a>
                                    <a href="#" id="history-redo"><span uk-icon="future"></span></a>
                                </div>
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

                        <span class="divider">ZOOM</span>
                        <div class="tools">
                            <a href="#" id="zoom-reset">Reset</a>
                            <span id="zoom-value">100%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    @endif
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
<script>
    window.ClassroomDetails = {
        channel: '{{ $chatChannel }}',
        classroom: {!! $classroom->toJson() !!},
        currentUser: {!! $currentUser->toJson() !!},
        otherUser: {!! $otherUser->toJson() !!}
    };
</script>

<script src="{{ asset('/dist/js/classroom-v2.js') }}"></script>

<script>
    <?php /*
    Echo.private('{{ $chatChannel }}').listen('NewChat', (chat) => {
        if (ELOSpeak.currentUserType !== chat.from) {
            ELOSpeakClassroom.Chat.printMessage(chat.message, true);
        }
    });

    @if ($currentUserType === 'student')
        Echo.private('{{ $chatChannel }}').listenForWhisper('draw', (draw) => {
            ELOSpeakClassroom.BoardViewer.drawOnCanvas(draw);
        });
    @else
        window.sendEventData = _.debounce(function() {
            Echo.private('{{ $chatChannel }}').whisper('draw', {
                data: ELOSpeakClassroom.Stage.toDataURL(),
                width: ELOSpeakClassroom.Stage.getWidth(),
                height: ELOSpeakClassroom.Stage.getHeight()
            })
        }, 500);
    @endif
    
</script>
@endsection*/ ?>