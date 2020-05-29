<script>
    import { onMount } from 'svelte';
    import Pickr from '@simonwep/pickr';
    import _ from 'underscore';
    import { SettingsText } from './settings.js';

    let fontSize = $SettingsText.font.size, fontColor = $SettingsText.font.color, fontFace = $SettingsText.font.face;

    $: {
        console.log($SettingsText.font.size);
    }

    onMount(() => {
        const pickrFontColor = new Pickr({
            el: '#font-color-pickr',
            theme: 'nano',
            default: fontColor,
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

        pickrFontColor.on('save', (color, i) => {
            pickrFontColor.hide();

            const rgba = color.toRGBA();
            fontColor = ['rgb(', rgba[0], ',', rgba[1], ',', rgba[2], ')'].join('');

            SettingsText.update((s) => {
                s.font.color = fontColor;
                return s;
            });
        });
    });

    const quotes = [
        'Make sure you marry someone who laughs at the same things you do.',
        'But you can\'t always tell – with somebody\'s mother, I mean. Mothers are all slightly insane.',
        'If a girl looks swell when she meets you, who gives a damn if she’s late? Nobody.',
        'I can’t explain what I mean. And even if I could, I’m not sure I’d feel like it.',
        'All you knew was, you were happy. You really were.',
        'I like it when somebody gets excited about something. It’s nice.',
        'Who wants flowers when you’re dead? Nobody.',
        'People always clap for the wrong reasons.',
        'All morons hate it when you call them a moron.',
        'It\'s partly true, too, but it isn’t all true. People always think something’s all true.',
        'You can’t stop a teacher when they want to do something. They just do it.',
        'Don’t tell people what you are thinking, or you will miss them terribly when you are away.',
        'I wouldn’t exactly describe her as strictly beautiful. She knocked me out, though.',
        'I don’t exactly know what I mean by that, but I mean it.',
        'And I have one of those very loud, stupid laughs.',
        'I can be quite sarcastic when I’m in the mood.',
        'If I were a piano player, I’d play it in the goddamn closet.'
    ];

    const changeSize = _.debounce(() => {
        SettingsText.update((s) => {
            s.font.size = fontSize;
            return s;
        });
    }, 400);

    function changeFont(e)
    {
        SettingsText.update((s) => {
            s.font.face = e.target.value;
            return s;
        });
    }
</script>
<div id="mode-text">
    <div class="row">
        <div class="col-5 text-right">
            <span class="align-label">Font Face</span>
        </div>
        <div class="col-auto">
            <select on:change={ changeFont } bind:value={ fontFace }>
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier">Courier</option>
            </select>
        </div>
    </div>

    <div class="row mt-3">
        <div class="col-5 text-right">
            <span class="align-label">Font Size</span>
        </div>
        <div class="col-auto">
            <input type="range" max="50" min="8" step="2" on:input={ changeSize } bind:value={ fontSize }>
        </div>
    </div>

    <div class="row">
        <div class="offset-5 col-auto">
            <strong>{ fontSize }px</strong>
        </div>
    </div>

    <div class="row mt-4">
        <div class="col-5 text-right">
            <span class="align-label">Color</span>
        </div>
        <div class="col-auto">
            <div id="font-color-pickr"></div>
        </div>
    </div>

    <div class="text-center mt-4">
        <strong class="d-block">Preview</strong>

        <p style="font-size: { fontSize }px; color: { fontColor }; font-family: { fontFace }">
            { quotes[Math.floor(Math.random() * quotes.length)] }
        </p>
    </div>
</div>
