<script>
    import {SettingsEraser} from './settings.js';
    import {onMount} from 'svelte';

    let preview;

    onMount(() => {
        preview.style.width = $SettingsEraser.thickness +'px';
        preview.style.height = $SettingsEraser.thickness +'px';
    });

    $: if (typeof preview != 'undefined') {
        preview.style.width = $SettingsEraser.thickness +'px';
        preview.style.height = $SettingsEraser.thickness +'px';
    }

    function setThickness(e)
    {
        SettingsEraser.update((s) => {
            s.thickness = parseInt(e.target.value);
            return s;
        });
    }
</script>

<div id="mode-eraser">
    <div class="row mt-2">
        <div class="col-5 text-right">
            <span class="mid-align">Thickness</span>
        </div>
        <div class="col-7">
            <input type="range" on:input={setThickness} min="1" step="1" value="{$SettingsEraser.thickness}" max="20" class="form-control-range" id="mode-eraser-thickness">
        </div>
    </div>

    <div class="row mt-2">
        <div class="col-5 text-right">
            <span class="mid-align">Preview</span>
        </div>
        <div class="col-7">
            <div id="mode-eraser-preview">
                <div class="dot" bind:this={preview}></div>
            </div>
        </div>
    </div>
</div>

<style>
    .mid-align {
        line-height: 1.7rem;
    }

    #mode-eraser-preview {
        width: 40px;
        height: 40px;
        background: #000;
        position: relative;
    }

    #mode-eraser-preview .dot {
        background: #fff;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 100%;
    }
</style>