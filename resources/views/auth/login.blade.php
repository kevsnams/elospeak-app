<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset='utf-8'>
    <meta name="viewport" content="width=1024">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Welcome</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Patrick+Hand|Quicksand:300,400,700&display=swap">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <link rel="stylesheet" href="{{ asset('/dist/login.css') }}">
</head>
<body>
    <div id="login"></div>
    <script defer src="{{ asset('/dist/login.js') }}"></script>
</body>
</html>
