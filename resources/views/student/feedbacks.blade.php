@extends('layouts.app')

@section('pageTitle', 'Feedbacks')
@section('pageHeader', 'Feedbacks')
@section('vNav-active-feedbacks', 'active')

@section('pageContent')
<div class="uk-padding">
    <article class="uk-comment feedback">
        <header class="uk-comment-header uk-grid-medium uk-flex-middle" uk-grid>
            <div class="uk-width-auto">
                <img class="uk-comment-avatar uk-border-circle" src="https://a.imge.to/2019/08/07/AsKHC.png" width="80" height="80" alt="">
            </div>
            <div class="uk-width-expand">
                <h4 class="uk-comment-title uk-margin-remove"><a class="uk-link-reset" href="#">Park Ji-hyo</a></h4>
                <ul class="uk-comment-meta uk-subnav uk-subnav-divider uk-margin-remove-top">
                    <li><a href="#">3 days ago</a></li>
                </ul>
            </div>
        </header>
        <div class="uk-comment-body">
            <p>
                I was afraid this time would come
                I wasn't prepared to face this kind of hurtin' from within
                I have learned to live my life beside you
                Maybe I'll just dream of you tonight
                And if into my dream you'll come and touch me once again
                I'll just keep on dreaming till my heartaches end
            </p>
        </div>
    </article>

    <article class="uk-comment feedback">
        <header class="uk-comment-header uk-grid-medium uk-flex-middle" uk-grid>
            <div class="uk-width-auto">
                <img class="uk-comment-avatar uk-border-circle" src="https://a.imge.to/2019/08/07/Aji9i.png" width="80" height="80" alt="">
            </div>
            <div class="uk-width-expand">
                <h4 class="uk-comment-title uk-margin-remove"><a class="uk-link-reset" href="#">Lalisa Manoban</a></h4>
                <ul class="uk-comment-meta uk-subnav uk-subnav-divider uk-margin-remove-top">
                    <li><a href="#">7 days ago</a></li>
                </ul>
            </div>
        </header>
        <div class="uk-comment-body">
            <p>
                I believe the children are our are future
                Teach them well and let them lead the way
                Show them all the beauty they possess inside
                Give them a sense of pride to make it easier
                Let the children's laughter remind us how we used to be
                Everybody searching for a hero
                People need someone to look up to
                I never found anyone who fulfill my needs
                A lonely place to be
                And so I learned to depend on me
            </p>
        </div>
    </article>

    <article class="uk-comment feedback">
        <header class="uk-comment-header uk-grid-medium uk-flex-middle" uk-grid>
            <div class="uk-width-auto">
                <img class="uk-comment-avatar uk-border-circle" src="https://a.imge.to/2019/08/07/AjWoR.png" width="80" height="80" alt="">
            </div>
            <div class="uk-width-expand">
                <h4 class="uk-comment-title uk-margin-remove"><a class="uk-link-reset" href="#">Lee Min-Ho</a></h4>
                <ul class="uk-comment-meta uk-subnav uk-subnav-divider uk-margin-remove-top">
                    <li><a href="#">12 days ago</a></li>
                </ul>
            </div>
        </header>
        <div class="uk-comment-body">
            <p>
                Sa mga pabida ay mailap hanapin ay
                Mahirap wag mo nang tangkain na hamakin
                Dahil di mo na to mahahagilap
                Sa ibaba hindi bat sa itaas na din ako kumikislap at kumukutitap
                Pagpag ng konti sa balikat
                
                It's just for bida bawal dito ang pabida
                Dahil ang tunay na bida rito ay ang kontrabida
            </p>
        </div>
    </article>
</div>
@endsection