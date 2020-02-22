<script>
    import {parse} from 'qs';
    import {querystring} from 'svelte-spa-router';

    let query = parse($querystring);

    import axios from 'axios';
    import UserProfile from './partials/UserProfile.svelte';
    import Spinner from './partials/elements/Spinner.svelte';


    let fetcher = fetchTeacher();

    async function fetchTeacher()
    {
        try {
            const xhr = await axios.post('./app/teacher', {
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
    <Spinner label="Fetching teacher info..." />
{:then teacher}
    <UserProfile info="{teacher}" />
{:catch error}
    Error check console
{/await}