<script>
    import axios from 'axios';
    import jstz from 'jstimezonedetect';

    import { AuthUser } from 'elo/stores';
    import { date_human, number_format, pluralize, time_hm } from 'elo/util';

    import {
        ArrowRightIcon
    } from 'svelte-feather-icons';

    import NextClassroomCard from 'elo/components/dashboard/NextClassroomCard.svelte';
    import Card from 'elo/components/partials/Card.svelte';
    import Spinner from 'elo/components/partials/Spinner.svelte';
    import Alert from 'elo/components/partials/Alert.svelte';

    if ($AuthUser.user_type == 'student') {
        const fetchEnrollmentsCount = axios.get('/enrollments/count');
        const fetchEnrollmentsRecent = axios.get('/enrollments', {
            params: {
                limit: 5,
                order: ['created_at', 'desc']
            }
        });
    }
    
    const fetchSchedulesCount = axios.get('/classrooms/count');
    const fetchSchedulesRecent = axios.get('/classrooms', {
        params: {
            limit: 5,
            order: ['end', 'desc']
        }
    })
</script>

<div class="content">
    <div class="d-flex">
        <div class="mr-auto">
            <h5>DASHBOARD</h5>
        </div>
        <div class="ml-auto">
            { date_human() } &#8212; Timezone: { jstz.determine().name() }
        </div>
    </div>

    <div class="mt-4">
        <NextClassroomCard />
    </div>

    <div class="d-flex mt-4 dashboard-grid">
        {#if $AuthUser.user_type == 'student'}
            <Card className="w-auto mr-4">
                <span slot="header">Enrollments</span>

                <a href="#/enrollments" slot="header-right">
                    View All <ArrowRightIcon />
                </a>

                <div slot="content">
                    <!-- Fetch Enrollment Count -->
                    {#await fetchEnrollmentsCount}
                        <Spinner />
                    {:then response}
                        <div class="text-center">
                            You currently have:
                        </div>
                        <span class="count font-roboto">
                            { number_format(response.data.count) }
                        </span>
                        <div class="text-center mb-4">
                            { pluralize(response.data.count, 'Enrollment', 'Enrollments') }
                        </div>
                    {:catch}
                        <Alert type="warning">
                            Unable to fetch resources. Please try again.
                        </Alert>
                    {/await}


                    <!-- Fetch Recent Enrollments -->
                    {#await fetchEnrollmentsRecent}
                        <Spinner />
                    {:then response}
                        {#if response.data.length}
                            <span class="text-secondary">Recently created { pluralize(response.data.length, 'enrollment', 'enrollments') }</span>
                        {/if}
                    {:catch}
                        <Alert type="warning">
                            Unable to fetch resources. Please try again.
                        </Alert>
                    {/await}
                </div>
            </Card>
        {/if}

        <Card className="w-auto">
            <span slot="header">Schedules</span>

            <a href="#/schedules" slot="header-right">
                View All <ArrowRightIcon />
            </a>

            <div slot="content">
                {#await fetchSchedulesCount}
                    <Spinner />
                {:then response}
                    <div class="text-center">
                        You currently have:
                    </div>
                    <span class="count font-roboto">
                        { number_format(response.data.count) }
                    </span>
                    <div class="text-center mb-4">
                        { pluralize(response.data.count, 'Class', 'Classes') }
                    </div>
                {:catch}
                    <Alert type="warning">
                        Unable to fetch resources. Please try again.
                    </Alert>
                {/await}

                {#await fetchSchedulesRecent}
                    <Spinner />
                {:then response}
                    {#if response.data.length}
                        <span class="text-secondary">Recently created { pluralize(response.data.length, 'class', 'classes') }</span>

                        <ul class="recent-list">
                            {#each response.data as classroom}
                                <li>
                                    <a href="#/classroom/{ classroom.id }">
                                        <span class="date">{ date_human(new Date(classroom.start)) } &#8212; </span>
                                        <span class="time">{ time_hm(new Date(classroom.start)) }:{ time_hm(new Date(classroom.end)) }</span>
                                    </a>
                                </li>
                            {/each}
                        </ul>
                    {/if}
                {:catch}
                    <Alert type="warning">
                        Unable to fetch resources. Please try again.
                    </Alert>
                {/await}
            </div>
        </Card>
    </div>
</div>

<style>
.dashboard-grid .count {
    font-size: 3rem;
    display: block;
    text-align: center;
}

.dashboard-grid ul.recent-list {
    padding: 0;
    margin: 0;
}

.dashboard-grid ul.recent-list li {
    margin: 0;
    padding: 0;
    list-style-type: none;
    display: block;
}
.dashboard-grid ul.recent-list li:not(:last-child) {
    border-bottom: 1px solid rgb(230, 236, 240);
}

.dashboard-grid ul.recent-list li a {
    text-decoration: none;
    font-weight: bold;
    padding: 1rem 0;
    display: block;
}

.dashboard-grid ul.recent-list li a span.date {
    color: #4c4a4a;
}

.dashboard-grid ul.recent-list li a span.time {
    color: #939393;
}
</style>