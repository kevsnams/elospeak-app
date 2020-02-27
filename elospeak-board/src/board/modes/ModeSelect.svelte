<script>
    import {SelectedNode} from './settings.js';

    import {createEventDispatcher} from 'svelte';
    const dispatch = createEventDispatcher();

    import ShapeSettings from './Settings.svelte';
    import {Trash2Icon} from 'svelte-feather-icons';

    function deleteNode(e)
    {
        const layer = $SelectedNode.getLayer();
        const stage = $SelectedNode.getStage();

        dispatch('deleteNode', {
            node: $SelectedNode.id(),
            layer: layer.id()
        });

        $SelectedNode.destroy();
        stage.find('Transformer').destroy();

        layer.draw();

        SelectedNode.update((node) => {
            node = null;
            return node;
        });
    }

    let def = null;

    SelectedNode.subscribe((node) => {
        if (node == null) {
            def = null;
        } else {
            const fill = node.fill();
            def = {
                shape: node.name().split(' ')[0],
                fill: {
                    color: fill ? fill : 'rgb(0,0,0)',
                    opacity: node.opacity(),
                    transparent: !node.fillEnabled()
                },
                border: {
                    color: node.stroke(),
                    enabled: node.strokeEnabled()
                }
            }
        }
    });

    $: {
        if (def == null) {
            SelectedNode.set(null);
        } else {
            const attrs = {};
            attrs['fillEnabled'] = !def.fill.transparent;

            if (!def.fill.transparent) {
                attrs['fill'] = def.fill.color;
                attrs['opacity'] = def.fill.opacity;
            } else {
                attrs['fill'] = null;
            }

            attrs['strokeEnabled'] = def.border.enabled;

            if (def.border.enabled) {
                attrs['stroke'] = def.border.color;
            }

            dispatch('shapeColors', {
                id: $SelectedNode.id(),
                attrs
            });
            
            SelectedNode.update((node) => {
                node.fillEnabled(!def.fill.transparent);

                if (!def.fill.transparent) {
                    node.fill(def.fill.color);
                    node.opacity(def.fill.opacity);
                } else {
                    node.fill(null);
                }

                node.strokeEnabled(def.border.enabled);

                if (def.border.enabled) {
                    node.stroke(def.border.color);
                }

                return node;
            });
        }
    }
</script>

<div id="mode-select">
    {#if def != null}
        <ShapeSettings bind:def={def} />
        <div class="mt-3">
            <button class="btn btn-tool btn-sm" on:click={deleteNode}>
                <Trash2Icon /> Delete
            </button>
        </div>
    {:else}
        <div class="alert alert-info">
            <strong>Instructions:</strong> Select a shape from the board to start. Once selected, shape settings will appear here. You can change its fill color, border, and opacity.
        </div>
    {/if}
</div>