<script>
    export let type = 'primary';
    export let icon = true;

    import _ from 'lodash';
    import {
        AlertCircleIcon,
        AlertTriangleIcon,
        AlertOctagonIcon
    } from 'svelte-feather-icons';

    const icons = {
        'error': AlertCircleIcon,
        'warning': AlertTriangleIcon,
        'unsuccess': AlertOctagonIcon
    };
</script>

<div class="alert alert-{ type }">
    <div class="d-flex">
        {#if _.has(icons, type) && icon}
            <div class="mr-3">
                <svelte:component this={ icons[type] } />
            </div>
        {/if}

        <div>
            <slot></slot>
        </div>
    </div>
</div>

<style>
.alert-error {
    background: rgb(255, 201, 201);
    color: rgb(255, 17, 17);
}

.alert-unsuccess {
    background: rgb(255, 218, 201);
    color: rgb(255, 104, 17);
}
</style>