<script>
    import { link } from 'svelte-spa-router';
    import active from 'svelte-spa-router/active';

    import _ from 'lodash';

    import { routes } from 'elo/routes';

    const navigations = _.map(routes, (value, key) => {
        return {
            path: key,
            nav: value
        };
    });
</script>

<nav class="route-navs">
    {#each navigations as { path, nav }}
        <a href={ path } use:link use:active={ nav.active_if }>
            <svelte:component this={ nav.icon } /> { nav.label }
        </a>
    {/each}
</nav>

<style>
nav.route-navs {
    margin-top: 1.5rem;
}

nav.route-navs a {
    display: block;
    color: #4c4a4a;
    font-size: 1.4em;
    font-weight: 700;
    text-decoration: none;
    padding: 1rem;
}

nav.route-navs a:hover {
    color: #fc719f !important;
    background: #ffbcd22d;
    border-top-left-radius: 1rem;
    border-bottom-left-radius: 1rem;
    transition-property: color,
        background,
        border-top-left-radius,
        border-top-right-radius,
        border-right-color;
    transition-duration: 500ms;
    border-right: .5rem solid #fc719f;
}

:global(a.active-nav) {
    color: #92c2fd !important;
    transition-property: color,
        background,
        border-top-left-radius,
        border-top-right-radius,
        border-right-color;
    transition-duration: 500ms;
    border-right: .5rem solid #92c2fd;
}
</style>