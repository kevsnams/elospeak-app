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
                <button class="send fncy-button fncy-green">Send</button>
                <textarea class="typebox"></textarea>
            </div>
        </div>
        <div id="vr-board">
            <div id="vr-drawingboard">
                <canvas id="vr-canvas"></div>
            </div>
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

        var x = "#000",
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

        window.onload = function() {
            init();
        }
    </script>
@endsection