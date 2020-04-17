<script>
    import axios from 'axios';

    import { date_human, time_hm, class_duration } from 'elo/util';

    import Spinner from 'elo/components/partials/Spinner.svelte';
    import Alert from 'elo/components/partials/Alert.svelte';
    import Card from 'elo/components/partials/Card.svelte';

    const fetcher = axios.get('/classrooms/next');

    let classroom = {};
    fetcher.then((response) => {
        classroom = response.data.data;
    });
</script>

{#await fetcher}
    <Spinner />
{:then response}
    {#if response.data.found}
        <div class="elo-card card-classroom">
            <span class="header">Your next class:</span>
            <div class="d-flex mt-3">
                <div class="w-auto text-center">
                    <span class="sub-header d-block">Teacher</span>
                    <img src={ classroom.teacher.photo_url } class="card-photo rounded-circle" height="75" alt="Teacher" />
                    <a href="javascript:;" class="name">{ classroom.teacher.full_name }</a>
                </div>
                <div class="w-auto ml-5 text-center">
                    <span class="sub-header d-block">Student</span>
                    <img src="{ classroom.student.photo_url }" class="card-photo rounded-circle" height="75" alt="Student" />
                    <a href="javascript:;" class="name">{ classroom.student.full_name }</a>
                </div>
                <div class="w-auto ml-4">
                    <span class="sub-header d-block">Schedule</span>
                    <div class="card-datetime font-roboto">
                        { date_human(new Date(classroom.start)) }
                    </div>
                    <span class="sub-header d-block">Time</span>
                    <div class="card-datetime font-roboto">
                        { time_hm(new Date(classroom.start), true) } &#8212; { time_hm(new Date(classroom.end), true) }
                    </div>
                </div>
                <div class="w-auto ml-4">
                    <span class="sub-header d-block">Duration</span>
                    <div class="card-datetime font-roboto">
                        { class_duration(classroom.start, classroom.end) } minutes
                    </div>
                </div>
            </div>
        </div>
    {:else}
        <Card className="w-100">
            <span slot="header">You have no classes today</span>
        </Card>
    {/if}
{:catch e}
    <Alert type="unsuccess">
        Failed fetching classroom data, please try again.
    </Alert>
{/await}

<style>
.card-classroom .header {
    font-size: 1rem;
    font-weight: bold;
}

.card-classroom .sub-header {
    font-size: 1rem;
}

.card-classroom .card-photo {
    display: block;
    margin-top: 1rem;
    margin: 1rem auto 0 auto;
}

.card-classroom .name {
    font-size: .9rem;
    display: block;
    margin-top: 1rem;
}

.card-datetime {
    font-size: 2rem;
}
</style>