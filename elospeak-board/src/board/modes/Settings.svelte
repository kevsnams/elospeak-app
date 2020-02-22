<script>
    export let def = null;

    import {SettingsShapes} from './settings.js';

    import Pickr from '@simonwep/pickr';
    import {onMount} from 'svelte';

    import {
        SlashIcon
    } from 'svelte-feather-icons';

    if (def == null) {
        def = $SettingsShapes;
    }

    onMount(() => {
        const pickrFill = Pickr.create({
            el: '#shape-settings-fill',
            theme: 'nano',
            default: def.fill.color,
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

        pickrFill.on('save', (color, i) => {
            pickrFill.hide();

            const rgba = color.toRGBA();

            def.fill.color = ['rgb(', rgba[0], ',', rgba[1], ',', rgba[2], ')'].join('');
            def.fill.opacity = parseFloat(rgba[3]);
        });

        const pickrBorder = Pickr.create({
            el: '#shape-settings-border',
            theme: 'nano',
            default: def.border.color,
            swatches: null,

            components: {
                preview: true,
                hue: true,

                interaction: {
                    save: true,
                    cancel: true
                }
            }
        });

        pickrBorder.on('save', (color, i) => {
            pickrBorder.hide();

            const rgba = color.toRGBA();
            def.border.color = ['rgb(', rgba[0], ',', rgba[1], ',', rgba[2], ')'].join('');
        });
    });

    $: if (def == null) {
        SettingsShapes.update((s) => {
            s.fill.color = def.fill.color;
            s.fill.opacity = def.fill.opacity;
            s.fill.transparent = def.fill.transparent;
            s.border.color = def.border.color;
            s.border.enabled = def.border.enabled;

            return s;
        });
    }
</script>

<div class="row">
    <div class="col-5 text-right">
        <span class="align-label">Fill</span>
    </div>
    <div class="col-auto">
        <div class:invisible={!def.fill.transparent} class="disable-pickr">
            <SlashIcon size="2x" />
        </div>
        <div class:invisible={def.fill.transparent}>
            <div id="shape-settings-fill"></div>
        </div>
    </div>
    <div class="col-auto">
        <input type="checkbox" bind:checked={def.fill.transparent} /> <span class="align-label">Transparent</span>
    </div>
</div>

<div class="row mt-2">
    <div class="col-5 text-right">
        <span class="align-label">Border</span>
    </div>
    <div class="col-auto">
        <div class:invisible={def.border.enabled} class="disable-pickr">
            <SlashIcon size="2x" />
        </div>
        <div class:invisible={!def.border.enabled}>
            <div id="shape-settings-border"></div>
        </div>
    </div>

    <div class="col-auto">
        <input type="checkbox" bind:checked={def.border.enabled} /> <span class="align-label">Enable</span>
    </div>
</div>

<style>
    .disable-pickr {
        float: left;
        position: absolute;
        font-size: 1.4rem;
        color:#e14f4f;
        margin-top: -3px;
    }
    .align-label {
        line-height: 1.7rem;
    }
</style>