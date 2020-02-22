<script>
    import {parse} from 'qs';
    import {querystring} from 'svelte-spa-router';

    let query = parse($querystring);

    import axios from 'axios';
    import UserProfile from './partials/UserProfile.svelte';
    import Spinner from './partials/elements/Spinner.svelte';


    let fetcher = fetchStudent();

    async function fetchStudent()
    {
        try {
            const xhr = await axios.post('./app/student', {
                id: query.id
            });

            return xhr.data;
        } catch (e) {
            throw new Error(e.response.data);
        }
    }

    // Use a reactive statement to ensure parsed
    // is updated every time $querystring changes
    $: query = parse($querystring)
</script>

{#await fetcher}
    <Spinner label="Fetching student info..." />
{:then student}
    <UserProfile info="{student}" />
{:catch error}
    Error check console
{/await}