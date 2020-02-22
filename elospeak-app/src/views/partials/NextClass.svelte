<script>
    import axios from 'axios';

    import Spinner from './elements/Spinner.svelte';
    import ClassCurrent from './elements/ClassCurrent.svelte';
    import ClassNothing from './elements/ClassNothing.svelte';

    import {onMount} from 'svelte';

    let fetcher = fetchNextClass();

    async function fetchNextClass()
    {
        try {
            const fetcher = await axios.post('./app/classroom/next');
            return fetcher.data;
        } catch (e) {
            throw new Error(e);
        }
    }

    let shouldDoAnotherFetch = false;

    $: if (shouldDoAnotherFetch) {
        fetcher = fetchNextClass();
    }
</script>

{#await fetcher}
    <Spinner label="Fetching next class..." />
{:then response}
    {#if response.success}
        <ClassCurrent bind:done={shouldDoAnotherFetch} classroom={response.classroom} />
    {:else}
        <ClassNothing />
    {/if}
{:catch error}
    ERROR FETCHING CLASSES
{/await}