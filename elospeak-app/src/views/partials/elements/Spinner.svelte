<script>
    export let showLoadingText = true;
    export let centered = true;
    export let style = 'width: 3rem; height: 3rem;';
    export let label = 'Loading...';
</script>

<div class:text-center={centered}>
    <div class="spinner-grow" {style} role="status">
        <span class="sr-only">{label}</span>
    </div>

    {#if showLoadingText}
        <h4>{label}</h4>
    {/if}
</div>