<script>
    export let active = false;
    export let config = null;
    export let index;
</script>

<button on:click class="button-tab {active ? 'active' : ''}" data-button-tab="{index}">
    {config.label}
</button>

<style>
.button-tab {
    display: inline-block;
    border: none;
    color:#4d5969;
    background-color:#fff;
    border-color:#fff;
    box-shadow: 0 0 0 1px rgba(43, 45, 80, 0.1),
        0 2px 5px 0 rgba(43, 45, 80, 0.08),
        0 1px 1.5px 0 rgba(0, 0, 0, 0.07),
        0 1px 2px 0 rgba(0, 0, 0, 0.08);
    padding: 5px 15px;
    outline: 0;
    border-radius: 0.2rem;
    transition: 0.3s;
}
.button-tab:hover, .button-tab:focus {
    color:#010305 !important;
    box-shadow: 0 0 0 1px rgba(43, 45, 80, 0.1),
        0 2px 5px 0 rgba(43, 45, 80, 0.1),
        0 3px 9px 0 rgba(43, 45, 80, 0.08),
        0 1px 1.5px 0 rgba(0, 0, 0, 0.08),
        0 1px 2px 0 rgba(0, 0, 0, 0.08);
}
.button-tab:active, .button-tab.active {
    background-color:#e6e6e6;
    border-color:#dfdfdf;
    box-shadow: none;
    color:#010305 !important;
}
</style>