<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset='utf-8'>
    <meta name='viewport' content='width=device-width,initial-scale=1'>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    
    <title>Welcome</title>

    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto+Slab:400,700|Quicksand:300,400,700&display=swap">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <link rel="stylesheet" href="{{ asset('/spa/dist/bundle.css') }}">
    <style>
        svg.feather {
            height: 1em;
            margin-top: -4px;
            pointer-events: none;
            vertical-align: middle;
            width: 1em;
        }
    </style>
</head>
<body>
    <script>
        window.ELOSpeak = {!! $svelteInitialValues !!};
    </script>

    <div id="app"></div>
    
    <?php /* <script defer src="{{ asset('/dist/bundle.js') }}"></script> */ ?>
    <script defer src="{{ asset('/spa/dist/bundle.js') }}"></script>
</body>
</html>