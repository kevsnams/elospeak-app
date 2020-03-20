<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <link rel="dns-prefetch" href="//fonts.gstatic.com">

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'ELOSpeak.com') }}</title>

    <link href="https://fonts.googleapis.com/css?family=Open+Sans|Roboto+Slab:400,700&display=swap" rel="stylesheet"> <link rel="stylesheet" href="css/normalize.css">
    <link rel="stylesheet" href="{{ asset('/front/css/bootstrap-grid.min.css') }}">
    <link rel="stylesheet" href="{{ asset('/front/css/main.css') }}">
</head>
<body>
  <div class="container">
    <div class="d-flex justify-content-between align-items-center">
      <div class="logo">
        <img class="mt-3" src="{{ asset('/front/img/logo-small.png') }}" alt="ELOSpeak Logo">
      </div>

      <div class="nav">
        <nav>
          <ul>
            <li>
              <a href="#">HOME</a>
            </li>
            <li>
              <a href="#">CLASSES</a>
            </li>
            <li>
              <a href="#">OUR TUTORS</a>
            </li>
            <li>
              <a href="#" class="active">CONTACT</a>
            </li>
            <li>
              <a href="#">FAQs</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div class="d-flex justify-content-between align-items-center">
      <div class="intro-text mt-4">
        <h1 class="header">LEARN ENGLISH ONLINE</h1>
        <p>Start learning English in an engaging course<br>with a unique teaching approach
        <div class="mt-4">
          <a href="#" class="btn-blue">Student Login</a>
          <a href="#" class="btn-pink">Teacher Login</a>
        </div>
      </div>
      <div>
        <img src="{{ asset('/front/img/student-teacher.png') }}">
      </div>
    </div>
  </div>

  <div class="trans-pink">
    <div class="trans-blue">
      <div class="container programs">
        <div class="d-flex justify-content-between">
          <div class="mt-5">
            <div class="d-flex flex-row r1">
              <div class="program-card">
                <h1>BEGINNER</h1>
                <span>Lorem Ipsum</span>
              </div>

              <div class="program-card">
                <h1>INTERMEDIATE</h1>
                <span>Lorem Ipsum</span>
              </div>
            </div>

            <div class="d-flex flex-row r2">
              <div class="program-card">
                <h1>ADVANCED</h1>
                <span>Lorem Ipsum</span>
              </div>

              <div class="program-card">
                <h1>PROFECIENT</h1>
                <span>Lorem Ipsum</span>
              </div>
            </div>
          </div>
          <div class="programs-desc">
            <h1 class="header">VERSATILE TEACHING</h1>
            <p>We provide a wide range of English learning programs to learners across the globe
    through a single online portal</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="container mvc">
    <div class="d-flex">
      <div class="program-card">
        <img src="{{ asset('/front/img/mission.png') }}">
        <h1>MISSION</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin maximus orci vitae magna dictum, id imperdiet erat bibendum. Pellentesque tempor vehicula tellus, et rhoncus lectus porttitor et. Vivamus hendrerit imperdiet nunc ullamcorper consequat. Duis condimentum lacus et eros tincidunt, eu porta libero porttitor. Maecenas vel tincidunt felis.</p>
      </div>

      <div class="program-card">
        <img src="{{ asset('/front/img/vision.png') }}">
        <h1 class="mt-4">VISION</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin maximus orci vitae magna dictum, id imperdiet erat bibendum. Pellentesque tempor vehicula tellus, et rhoncus lectus porttitor et. Vivamus hendrerit imperdiet nunc ullamcorper consequat. Duis condimentum lacus et eros tincidunt, eu porta libero porttitor. Maecenas vel tincidunt felis.</p>
      </div>

      <div class="program-card">
        <img src="{{ asset('/front/img/values.png') }}">
        <h1 class="mt-4">CORE VALUES</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin maximus orci vitae magna dictum, id imperdiet erat bibendum. Pellentesque tempor vehicula tellus, et rhoncus lectus porttitor et. Vivamus hendrerit imperdiet nunc ullamcorper consequat. Duis condimentum lacus et eros tincidunt, eu porta libero porttitor. Maecenas vel tincidunt felis.</p>
      </div>
    </div>

    <div class="divider mt-5 mb-5"></div>

    <footer class="d-flex align-items-center mb-5">
      <div class="mr-2">Follow Us</div>
      <a href="#">
        <img src="{{ asset('/front/img/fb.png') }}">
      </a>

      <a href="#">
        <img src="{{ asset('/front/img/ig.png') }}">
      </a>

      <a href="#">
        <img src="{{ asset('/front/img/skype.png') }}">
      </a>

      <a href="#">
        <img src="{{ asset('/front/img/wechat.png') }}">
      </a>
    </footer>
  </div>
</body>
</html>
