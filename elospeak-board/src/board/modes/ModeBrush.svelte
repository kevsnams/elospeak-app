<script>
    import {SettingsBrush} from './settings.js';

    import Pickr from '@simonwep/pickr';
    import {onMount} from 'svelte';

    let preview;

    onMount(() => {
        preview.style.width = $SettingsBrush.thickness +'px';
        preview.style.height = $SettingsBrush.thickness +'px';
        preview.style.backgroundColor = $SettingsBrush.color;
        preview.style.opacity = $SettingsBrush.opacity;

        const pickr = Pickr.create({
            el: '#mode-brush-pickr',
            theme: 'nano',
            default: $SettingsBrush.color,
            swatches: null,

            components: {
                preview: true,
                opacity: true,
                hue: true,

                interaction: {
                    save: true,
                    cancel: true
                }
            }
        });

        pickr.on('save', (color, i) => {
            pickr.hide();

            const rgba = color.toRGBA();
            
            SettingsBrush.update((s) => {
                s.color = ['rgb(', rgba[0], ',', rgba[1], ',', rgba[2], ')'].join('');
                s.opacity = parseFloat(rgba[3]);

                return s;
            });
        });
    });
    

    function setThickness(e)
    {
        SettingsBrush.update((s) => {
            s.thickness = parseInt(e.target.value);
            return s;
        });
    }

    $: if (typeof preview != 'undefined') {
        preview.style.width = $SettingsBrush.thickness +'px';
        preview.style.height = $SettingsBrush.thickness +'px';
        preview.style.backgroundColor = $SettingsBrush.color;
        preview.style.opacity = $SettingsBrush.opacity;
    }
</script>

<div id="mode-brush">
    <div class="row">
        <div class="col-5 text-right">
            <span class="mid-align">Color</span>
        </div>
        <div class="col-7">
            <div id="mode-brush-pickr"></div>
        </div>
    </div>

    <div class="row mt-2">
        <div class="col-5 text-right">
            <span class="mid-align">Thickness</span>
        </div>
        <div class="col-7">
            <input type="range" on:input={setThickness} min="1" step="1" value="{$SettingsBrush.thickness}" max="20" class="form-control-range" id="mode-brush-thickness">
        </div>
    </div>

    <div class="row mt-2">
        <div class="col-5 text-right">
            <span class="mid-align">Preview</span>
        </div>
        <div class="col-7">
            <div id="mode-brush-preview">
                <div class="dot" bind:this={preview}></div>
            </div>
        </div>
    </div>
</div>

<style>
    .mid-align {
        line-height: 1.7rem;
    }

    #mode-brush-preview {
        width: 40px;
        height: 40px;
        background: #fff;
        position: relative;
    }

    #mode-brush-preview .dot {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 100%;
    }
</style>