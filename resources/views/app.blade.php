<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset='utf-8'>
    <meta name="viewport" content="width=1024">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Welcome</title>

    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <link rel="stylesheet" href="{{ asset('/dist/app.css') }}">
    <link rel="stylesheet" href="{{ asset('/dist/bundle.css') }}">
</head>
<body>
    <script>
        var ELOSpeak = {
            User: {!! $User->toJSON() !!},
        };
    </script>

    <div id="app"></div>

    <script defer src="{{ asset('/dist/bundle.js') }}"></script>
</body>
</html>
