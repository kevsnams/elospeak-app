<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset='utf-8'>
    <meta name="viewport" content="width=1024">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Board</title>

    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Patrick+Hand|Quicksand:300,400,700&display=swap">
    <link rel="stylesheet" href="{{ asset('/lib.css') }}">
    <link rel="stylesheet" href="{{ asset('/dist/board-global.css') }}">
    <link rel="stylesheet" href="{{ asset('/dist/board.css') }}">

    <style>
        svg.feather {
            height: 1em;
            margin-top: -4px;
            pointer-events: none;
            vertical-align: middle;
            width: 1em;
        }
    </style>
    <script async src="{{ asset('/dist/js/echo.js') }}"></script>
</head>
<body>
    <div id="main"></div>
    <script defer src="{{ asset('/dist/board.js') }}"></script>
</body>
</html>
