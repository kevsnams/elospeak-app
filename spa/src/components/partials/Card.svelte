<script>
    export let className = '';

    import _ from 'lodash';

    if (_.isArray(className)) {
        className = className.join(' ');
    }

    className = 'elo-card '+ className;
</script>

<div class={className}>
    <div class="d-flex">
        <div class="mr-auto header">
            <slot name="header"></slot>
        </div>

        <div class="ml-auto">
            <slot name="header-right"></slot>
        </div>
    </div>

    <div class="mt-4">
        <slot name="content"></slot>
    </div>
</div>

<style>
.elo-card .header {
    font-size: 1rem;
    font-weight: bold;
}
</style>