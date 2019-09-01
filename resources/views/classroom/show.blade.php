@extends('layouts.blank')

@section('pageContent')
    <div id="virtual-room">
        <div id="vr-sidenav">
            <div class="logo"><span class="a">ELO</span><span class="b">Speak</span></div>
            <div id="vr-client">
                <div class="uk-grid" uk-grid>
                    <div><img src="https://usercontent1.hubstatic.com/13400924.png" width="75" height="75" class="uk-border-circle"></div>
                    <div>
                        <span class="full_name">Aileen Violon</span>
                        <a href="#">View Profile</a>
                    </div>
                </div>
            </div>

            <div id="vr-chats">
                <span class="title">CHATROOM</span>
                <div id="vr-chatbox">
                    <div class="chat-left"><span>Teacher, english na ta!</span></div>
                    <div class="chat-right"><span>English di ay kag imo!</span></div>
                </div>
            </div>
            <div id="vr-typebox">
                <div class="wrapper">
                    <textarea class="typebox" id="sender-message"></textarea>
                    <button class="send fncy-button fncy-green" id="send-message-button">Send</button>
                </div>
            </div>
        </div>
        <div id="vr-board">
            <div id="vr-drawingboard">
                <canvas id="vr-canvas"></canvas>
            </div>
        </div>

        <div id="vr-tools">
            <ul class="tool-nav">
                <li>
                    <a href="#" uk-toggle="target: #vr-files">
                        <span uk-icon="icon: file-text; ratio: 3" class="icon"></span>
                        <span class="text">Files</span>
                    </a>
                </li>
                <li>
                    <a href="#">
                        <span uk-icon="icon: star; ratio: 3" class="icon star"></span>
                        <span class="text">Cheer!</span>
                    </a>
                </li>
                <li>
                    <a href="#" uk-toggle="target: #vr-emojis">
                        <span uk-icon="icon: happy; ratio: 3" class="icon emoji"></span>
                        <span class="text">Emoji</span>
                    </a>
                </li>
            </ul>
        </div>

        <div id="vr-person">
            <div class="uk-flex" uk-grid>
                <div><img src="https://images-na.ssl-images-amazon.com/images/I/414uEP5qtwL._SY355_.jpg" width="75" height="75" class="uk-border-circle"></div>
                <div class="uk-padding-small">
                    <span class="full_name">Kevin Namuag</span>
                </div>
            </div>
        </div>
    </div>

    <a href="#" id="vr-settings-button" uk-toggle="target: #vr-settings">
        <span uk-icon="icon: settings; ratio: 1.4"></span>
    </a>

    <div id="vr-settings" uk-offcanvas="flip:true;overlay:true;mode:push">
        <div class="uk-offcanvas-bar">
            <h1>Settings</h1>
        </div>
    </div>

    <div id="vr-files" uk-offcanvas="flip: true;overlay: true;mode">
        <div class="uk-offcanvas-bar light-bar">
            <span class="uk-text-lead light-header">
                <span uk-icon="icon: file-text; ratio: 1.5"></span> Files
            </span>
        </div>
    </div>

    <div id="vr-emojis" uk-offcanvas="flip: true;overlay: true;">
        <div class="uk-offcanvas-bar light-bar">
            <span class="uk-text-lead light-header">
                <span uk-icon="icon: happy; ratio: 1.5"></span> Emoji
            </span>
        </div>
    </div>
@endsection

@section('pageCss')
    <link rel="stylesheet" href="{{ asset('/css/classroom.css') }}">
@endsection

@section('pageJavascript')
    <script src="{{ asset('/js/classroom.js') }}"></script>
    <script>
        var canvas, ctx, flag = false,
        prevX = 0,
        currX = 0,
        prevY = 0,
        currY = 0,
        dot_flag = false;

        var x = "#f03",
            y = 2;
        
        function init() {
            canvas = document.getElementById('vr-canvas');
            ctx = canvas.getContext("2d");
            w = canvas.width;
            h = canvas.height;

            resizeCanvas();
            
            canvas.addEventListener("mousemove", function (e) {
                findxy('move', e)
            }, false);
            canvas.addEventListener("mousedown", function (e) {
                findxy('down', e)
            }, false);
            canvas.addEventListener("mouseup", function (e) {
                findxy('up', e)
            }, false);
            canvas.addEventListener("mouseout", function (e) {
                findxy('out', e)
            }, false);
        }

        function draw() {
            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(currX, currY);
            ctx.strokeStyle = x;
            ctx.lineWidth = y;
            ctx.stroke();
            ctx.closePath();
        }

        function findxy(res, e) {
            if (res == 'down') {
                prevX = currX;
                prevY = currY;
                currX = e.clientX - canvas.getBoundingClientRect().left;
                currY = e.clientY - canvas.getBoundingClientRect().top;
                
                flag = true;
                dot_flag = true;
                if (dot_flag) {
                    ctx.beginPath();
                    ctx.fillStyle = x;
                    ctx.fillRect(currX, currY, 2, 2);
                    ctx.closePath();
                    dot_flag = false;
                }
            }
            if (res == 'up' || res == "out") {
                flag = false;
            }
            if (res == 'move') {
                if (flag) {
                    prevX = currX;
                    prevY = currY;
                    currX = e.clientX - canvas.getBoundingClientRect().left;
                    currY = e.clientY - canvas.getBoundingClientRect().top;
                    draw();
                }
            }
        }

        function resizeCanvas() {
            var vrDrawingBoard = document.getElementById('vr-drawingboard');
            canvas.width = vrDrawingBoard.getBoundingClientRect().width;
            canvas.height = vrDrawingBoard.getBoundingClientRect().height;
        }

        

        function sendMessage(evt) {
            var chatField = evt.target;
            var vrChatbox = document.getElementById('vr-chatbox');

            if (evt.keyCode === 13 || evt === false) {
                if (evt === false) {
                    chatField = document.getElementById('sender-message');
                }

                if (!chatField.value.trim().length) {
                    chatField.value = '';
                    return;
                }

                var chat = document.createElement('div');
                chat.setAttribute('class', 'chat-right');
                chat.innerHTML = '<span>'+ chatField.value.trim() +'</span>';

                vrChatbox.appendChild(chat);

                chatField.value = '';
                vrChatbox.scrollTop = vrChatbox.scrollHeight;
                return;
            }
        }

        function clearInput(evt) {
            if (evt.keyCode === 13) {
                evt.target.value = '';
                return;
            }
        }

        function initChat() {
            var chatField = document.getElementById('sender-message');
            chatField.addEventListener('keypress', sendMessage, false);
            chatField.addEventListener('keyup', clearInput, false);
            chatField.addEventListener('keyup', clearInput, false);

            document.getElementById('send-message-button').addEventListener('click', function (evt) {
                sendMessage(false);
            }, false);
        }

        window.onload = function() {
            init();
            initChat();
        }
    </script>
@endsection