<script>
import { createEventDispatcher } from 'svelte';

const dispatch = createEventDispatcher();

function resetZoom()
{
    dispatch('zoomReset', true);
}
</script>
<div id="mode-zoom">
    <div class="alert alert-info mt-2">
        <strong>Instructions:</strong> Move your cursor to the area where you want to zoom. Then, press SHIFT + mouse scroll. Scrolling UP means zooming out. Scrolling DOWN means zooming in.
        <p class="mt-4">
            To reset, press the reset button on your toolbox.
        </p>
    </div>

    <div class="mt-2 text-center">
        <button class="btn btn-tool btn-sm" on:click={ resetZoom }>Reset</button>
    </div>
</div>
