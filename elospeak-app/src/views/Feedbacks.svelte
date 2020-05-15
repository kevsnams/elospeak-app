<script>
    import User from './../user.js';
    import axios from 'axios';
    import Spinner from './partials/elements/Spinner.svelte';
    import ButtonsTab from './partials/elements/ButtonsTab.svelte';

    import {
        MessageSquareIcon
    } from 'svelte-feather-icons';

    const fetch = axios.get('./classroom-feedbacks', {
        params: {
            to: $User.id,
            to_user_type: $User.user_type,
            with: ['classroom']
        }
    });

    const buttons = [
        {
            label: 'Newest',
            flag: 1
        },

        {
            label: 'Oldest',
            flag: 0
        }
    ];

    let filter = 1;
</script>
<div class="wbox">
    {#await fetch}
        <Spinner />
    {:then response}
        <div class="d-flex mt-3">
            <div class="mr-auto">
                {#if $User.user_type === 'teacher'}
                    <h3 class="wbox-header"><MessageSquareIcon /> Feedback from your students</h3>
                {:else}
                    <h3 class="wbox-header"><MessageSquareIcon /> Feedback from your teacher</h3>
                {/if}
            </div>
            <!---
                <div>
                    <ButtonsTab bind:filter={filter} buttons={buttons} />
                </div>
            -->
        </div>
        <hr>

        {#each response.data as feedback}
            <div class="row feedback">
                <div class="col-2 text-center">
                    <a href="#/{ feedback.from.user_type }?id={ feedback.from.id }">
                        <img src="{ feedback.from.photo_url }" alt="{ feedback.from.name }" class="rounded-circle mt-3" width="75" />
                    </a>
                </div>
                <div class="col-10">
                    <p>
                        <a href="#/{ feedback.from.user_type }?id={ feedback.from.id }">{ feedback.from.name }</a> said
                    </p>
                    <blockquote class="blockquote">
                        <p class="mb-0">{ feedback.feedback }</p>
                        <footer class="blockquote-footer">on <cite title="Source Title">{ feedback.human_date }</cite></footer>
                    </blockquote>
                </div>
            </div>
        {:else}
            <h4 class="text-muted">No feedbacks yet</h4>
        {/each}
    {:catch}
        <div class="alert alert-error mt-3">Failed to fetch feedbacks. Please try again.</div>
    {/await}
</div>

<style>
.feedback:not(:last-child) {
    margin-bottom: 1rem;
}
</style>
