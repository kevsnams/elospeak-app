<script>
    import ButtonTab from './ButtonTab.svelte';

    export let buttons = null;
    export let label = null;
    export let filter = 0;

    function selectTab(event)
    {
        const index = parseInt(event.target.getAttribute('data-button-tab'));
        filter = buttons[index].flag;
    }
</script>

{#if buttons != null && buttons.length > 0}
    <div class="button-tab">
        <div class="row no-gutters">
            {#if label != null}
                <div class="col-auto mr-2">
                    <span style="line-height: 2.2">{label}</span>
                </div>
            {/if}

            {#each buttons as cfg, i}
                <div class="col-auto mr-2">
                    <ButtonTab index={i} active={filter == cfg.flag} config={cfg} on:click={selectTab} />
                </div>
            {/each}
        </div>
    </div>
{/if}