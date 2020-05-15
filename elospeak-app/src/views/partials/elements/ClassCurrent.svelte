<script>
    import User from '../../../user';
    import {ClockIcon} from 'svelte-feather-icons';
    import jquery from 'jquery';
    import {onMount} from 'svelte';

    import moment from 'moment-timezone';
    import jstz from 'jstimezonedetect';

    export let classroom;
    export let done = false;

    let timezone = jstz.determine().name();

    const clientTime = moment(new Date(
        moment.utc(ELOSpeak.ServerTime).tz(timezone).format('YYYY/MM/DD hh:mm:ss A')
    ));

    const phTime = moment(new Date(
        moment.utc(ELOSpeak.ServerTime).tz('Asia/Manila').format('YYYY/MM/DD hh:mm:ss A')
    ));

    const timeDifference = clientTime.diff(phTime, 'seconds');

    let start = moment(classroom.start).add(timeDifference, 'seconds');
    let end = moment(classroom.end).add(timeDifference, 'seconds');

    let startText = 'Class will start '+ moment().to(classroom.start);
    let hasStarted = moment().diff(start, 'seconds') >= 0;

    onMount(() => {
        jquery(function () {
            jquery('[data-toggle="tooltip"]').tooltip();
        });
    });

    let timer = () => {
        setTimeout(() => {
            const sec = moment().diff(start, 'seconds');
            startText = 'Class will start '+ (sec > -10 ? 'in '+ Math.abs(sec) : moment().to(classroom.start));

            if (sec < 0) {
                timer();
            } else {
                hasStarted = true;
                startText = 'Class is now active';

                if (moment().diff(end, 'seconds') < 0) {
                    timer();
                } else {
                    done = true;
                }
            }
        }, 1000);
    };

    timer();
</script>

<div class="wbox classroom-{classroom.id}">
    <h6 class="wbox-subheader">NEXT CLASS</h6>

    <div class="content">
        <div class="row no-gutters">
            <div class="col-auto">
                <div class="row">
                    <div class="col-auto clock">
                        <ClockIcon />
                    </div>
                    <div class="col-auto">
                        <span class="d-block" style="color: #5e6e82">START</span>
                        <h1 class="time" id="time-start" data-toggle="tooltip" data-placement="top" title="{start.format('D MMM YYYY')}">
                            {start.format('hh:mm A')}
                        </h1>
                        <span class="duration">Duration: {end.diff(classroom.start, 'minutes')} minutes</span>
                    </div>
                    <div class="col-auto">
                        <span class="d-block" style="color: #5e6e82">END</span>
                        <h1 class="time" id="time-end" data-toggle="tooltip" data-placement="top" title="{end.format('D MMM YYYY')}">
                            {end.format('hh:mm A')}
                        </h1>
                    </div>
                </div>
            </div>
            <div class="col-auto pl-4">
                {#if classroom.student == null}
                    <img src="./img/elo-missing.png" alt="No student yet" width="100" class="img-thumbnail img-fluid shadow-sm rounded-circle student">
                {:else}
                    <img src="{classroom.student.photo_url}" alt="Student" data-toggle="tooltip" data-placement="bottom" title="{$User.user_type == classroom.student.user_type ? 'You' : classroom.student.full_name}" width="100" class="img-thumbnail img-fluid shadow-sm rounded-circle student">
                {/if}

                {#if classroom.teacher == null}
                    <img src="./img/elo-missing.png" alt="No teacher yet" width="100" class="img-thumbnail img-fluid shadow-sm rounded-circle teacher">
                {:else}
                    <img src="{classroom.teacher.photo_url}" alt="Teacher" data-toggle="tooltip" data-placement="bottom" title="{$User.user_type == classroom.teacher.user_type ? 'You' : classroom.teacher.full_name}" width="100" class="img-thumbnail img-fluid shadow-sm rounded-circle teacher">
                {/if}
            </div>
        </div>

        <div class="row">
            <div class="col offset-1">
                <div class="pt-3">
                    {#if !hasStarted}
                        <h3>{startText}</h3>

                        {#if $User.user_type == 'teacher'}
                            <a href="./board" class="btn btn-outline-primary">Teacher, you may visit the classroom to prepare some stuff ;)</a>
                        {/if}
                    {:else}
                        <h3>Class is now active</h3>
                        <a href="./board" class="btn btn-primary">Go to classroom</a>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</div>

<style>
.content {
    padding: 0 20px 20px 20px;
    background: url('../img/side-box-bg.png') no-repeat scroll transparent;
    background-position: bottom right;
    background-size: contain;
    border-bottom-right-radius: inherit;
}

.wbox {
    padding: 0;
}
.wbox-subheader {
    border-radius: inherit;
    padding: 20px;
    background-color: #f9fafd !important;
    border-bottom: 0px solid #edf2f9;
}
.wbox .clock {
    text-align: right;
    padding-top: 10px;
    color: #344050;
    font-size: 3rem;
}
.wbox h1.time {
    color: #344050;
}

.wbox span.duration {
    display: block;
    font-size: .83333rem;
    color: #5e6e82;
    margin-top: 10px;
}

.wbox .student, .wbox .teacher {
    border-color: #fff !important;
    display: inline-block;
}

.wbox .teacher {
    margin-left: -2rem;
}
</style>
