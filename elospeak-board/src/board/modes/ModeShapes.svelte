<script>
    import {
        SettingsShapes,
        SelectedNode
    } from './settings.js';

    import {
        SquareIcon,
        TriangleIcon,
        StarIcon,
        CircleIcon
    } from 'svelte-feather-icons';

    import ShapeSettings from './Settings.svelte';

    const Shapes = [
        {
            key: 'quadrilateral',
            label: 'Quadrilateral',
            icon: SquareIcon
        },

        {
            key: 'triangle',
            label: 'Triangle',
            icon: TriangleIcon
        },

        {
            key: 'star',
            label: 'Star',
            icon: StarIcon
        },

        {
            key: 'ellipse',
            label: 'Ellipse',
            icon: CircleIcon
        }
    ];

    function selectShape(e)
    {
        let shape;
        const tmpShape = e.target.getAttribute('data-shape');

        if (tmpShape) {
            shape = tmpShape;
        } else {
            shape = e.target.parentElement.getAttribute('data-shape');
        }

        SettingsShapes.update((s) => {
            s.shape = shape;
            return s;
        });
    }

    function getShape(key)
    {
        return Shapes.find((shape) => {
            return shape.key == key;
        });
    }
</script>

<div id="mode-shapes">
    <div class="btn-group" id="shapes-tool">
        {#each Shapes as {key, label, icon}}
            <button class="btn btn-tool btn-sm" class:active="{key == $SettingsShapes.shape}" on:click|stopPropagation={selectShape} data-shape={key}>
                <svelte:component this={icon} />
                <span class="btn-tool-label">{label}</span>
            </button>
        {/each}
    </div>

    {#if $SettingsShapes.shape != null}
        <div class="mt-3">
            <ShapeSettings />
        </div>

        <div class="alert alert-info mt-2">
            <strong>Instructions:</strong> After selecting a shape, you may click and drag your mouse on the board.
        </div>
    {:else}
        <div class="alert alert-info mt-2">
            <strong>Instructions:</strong> Select which shape you want to draw on the board.
        </div>
    {/if}
</div>

<style>
#mode-shapes {
    margin-top: 20px;
}

#shapes-tool {
    width: 100%;
}
</style>