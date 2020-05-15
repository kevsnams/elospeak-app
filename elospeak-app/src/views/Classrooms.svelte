<script>
    import axios from 'axios';
    import User from './../user';
    import moment from 'moment';

    import PillUser from './partials/elements/PillUser.svelte';
    import BadgeStatus from './partials/elements/BadgeStatus.svelte';
    import ButtonsTab from './partials/elements/ButtonsTab.svelte';
    import Spinner from './partials/elements/Spinner.svelte';

    let buttonsDef = [
        {
            label: 'All',
            flag: -1
        },
        {
            label: 'Active',
            flag: 1
        },
        {
            label: 'Done',
            flag: 0
        },
        {
            label: 'Cancelled',
            flag: 2
        }
    ];

    let buttonGroupLabel = 'Show';
    let filter = 1;

    let classrooms = [];
    const xhrClassrooms = axios.post('./app/classrooms');

    xhrClassrooms.then((response) => {
        classrooms = response.data;
    });

    let filteredClassrooms = [];
    $: if (classrooms.length) {

        filteredClassrooms = classrooms.filter((v) => {
            return filter == -1 ? true : v.status == filter;
        });
    }
</script>
<div id="classrooms">
    {#await xhrClassrooms}
        <Spinner />
    {:then response}
        <div class="wbox">
            <div class="row pt-1 pb-4">
                <div class="col-auto mr-auto">
                    <h5 class="wbox-header" style="line-height: 2">Classrooms</h5>
                </div>
                <div class="col-auto">
                    <ButtonsTab bind:filter={filter} buttons={buttonsDef} label={buttonGroupLabel} />
                </div>
            </div>

            <table class="table table-borderless">
                <thead>
                    <tr>
                        <th scope="col">ID #</th>
                        <th scope="col">Start Date</th>
                        <th scope="col">Time</th>
                        <th scope="col">Duration</th>
                        <th scope="col">Status</th>
                        <th scope="col">
                            {#if $User.user_type == 'teacher'}
                                Student
                            {:else}
                                Teacher
                            {/if}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {#if filteredClassrooms.length}
                        {#each filteredClassrooms as classroom}
                            <tr>
                                <th scope="row">{classroom.id}</th>
                                <td>
                                    {moment(classroom.start).format('D MMM YYYY')}
                                </td>
                                <td>
                                    {moment(classroom.start).format('hh:mm A')}
                                </td>
                                <td>
                                    { classroom.duration } minutes
                                </td>
                                <td>
                                    <BadgeStatus status={classroom.status} />
                                </td>
                                <td>
                                    {#if $User.user_type == 'teacher'}
                                        <PillUser data={classroom.student} />
                                    {:else}
                                        <PillUser data={classroom.teacher} />
                                    {/if}
                                </td>
                            </tr>
                        {/each}
                    {:else}
                        <tr>
                            <td colspan="5">
                                <p class="text-muted">
                                    No results
                                </p>
                            </td>
                        </tr>
                    {/if}
                </tbody>
            </table>
        </div>
    {:catch}
        <div class="alert alert-warning">
            Failed fetching classrooms. Please retry again
        </div>
    {/await}
</div>

<style>
.wbox .table thead tr {
    background-color: #edf2f9 !important;
}

.wbox .table tbody tr {
    border-color: #edf2f9 !important;
    border-top: 1px solid #d8e2ef !important;
}
</style>
