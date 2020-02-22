<script>
    export let mode = 'brush';

    import {onMount} from 'svelte';
    import _ from 'underscore';

    import {
        PlusSquareIcon,
        ImageIcon,
        RefreshCwIcon,
        ChevronsRightIcon
    } from 'svelte-feather-icons';

    import ModeBrush from './modes/ModeBrush.svelte';
    import ModeEraser from './modes/ModeEraser.svelte';
    import ModeShapes from './modes/ModeShapes.svelte';
    import ModeSelect from './modes/ModeSelect.svelte';

    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    let dragElem, dragBox;

    function dragMouseDown(e)
    {
        e = e || window.event;
        e.preventDefault();
        
        pos3 = e.clientX;
        pos4 = e.clientY;

        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e)
    {
        const dragStyles = getComputedStyle(dragBox);
        const parentStyles = getComputedStyle(dragBox.parentElement)

        e = e || window.event;
        e.preventDefault();

        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        const newTop = dragBox.offsetTop - pos2;
        const boxH = parseInt(dragStyles.height);
        const maxBoundsY = (dragBox.offsetTop - pos2) + boxH;
        const parentH = parseInt(parentStyles.height);

        if (newTop < 0) {
            return;
        }

        dragBox.style.top = (maxBoundsY > parentH ? parentH - boxH : newTop) + "px";

        const newLeft = dragBox.offsetLeft - pos1;
        const boxW = parseInt(dragStyles.width);
        const maxBoundsX = (dragBox.offsetLeft - pos1) + boxW;
        const parentW = parseInt(parentStyles.width);

        if (newLeft < 0) {
            return;
        }

        dragBox.style.left = (maxBoundsX > parentW ? parentW - boxW : newLeft) +'px';
    }

    function closeDragElement()
    {
        document.onmouseup = null;
        document.onmousemove = null;
    }

    onMount(() => {
        dragElem.onmousedown = _.debounce(dragMouseDown, 100);
    });
    
    const Modes = [
        {
            key: 'brush',
            label: 'Brush',
            component: ModeBrush
        },

        {
            key: 'eraser',
            label: 'Eraser',
            component: ModeEraser
        },

        {
            key: 'shapes',
            label: 'Shapes',
            component: ModeShapes
        },

        {
            key: 'select',
            label: 'Select',
            component: ModeSelect
        },
    ];

    function getMode(key)
    {
        return Modes.find((mode) => {
            return mode.key == key;
        });
    }

    function changeMode(e)
    {
        e.preventDefault();
        e.stopPropagation();

        mode = e.target.getAttribute('data-mode');
    }
</script>

<div id="toolbox" bind:this={dragBox}>
    <div class="header" bind:this={dragElem}>TOOLBOX</div>
    <div class="content">
        <div class="row">
            <div class="col-12 text-center">
                <button class="btn btn-tool btn-sm"><PlusSquareIcon /> Add Layer</button>
                <button class="btn btn-tool btn-sm"><ImageIcon /> Upload Image</button>
                <button class="btn btn-tool btn-sm"><RefreshCwIcon /> Clear</button>
            </div>
        </div>
        <hr>
        <div class="row">
            <div class="col-12">
                <h1 class="sub-header">Edit Modes <ChevronsRightIcon /> {getMode(mode).label}</h1>
                <div class="btn-group" id="tool-modes">
                    {#each Modes as {key, label}}
                        <button class="btn btn-tool btn-sm" data-mode="{key}" on:click={changeMode} class:active="{key == mode}">
                            {label}
                        </button>
                    {/each}
                </div>
            </div>
        </div>
        <div id="mode-settings" class="mb-3">
            <svelte:component this={getMode(mode).component} />
        </div>
    </div>
</div>

<style>
#mode-settings {
    margin-top: 25px;
}

#tool-modes {
    width: 100%;
    margin-top: 5px;
}
#toolbox .sub-header {
    font-size: 0.8rem;
}

#toolbox .content {
    background: #edf2f9;
    font-size: 0.8rem;
    padding: 10px 5px 5px 5px;
}
#toolbox .header {
    font-size: 0.8rem;
    color: #344050;
    background: #fff;
    padding: 5px;
    text-align: center;
    box-shadow: 0 7px 14px 0 rgba(59,65,94,.1), 0 3px 6px 0 rgba(0,0,0,.07);
    font-weight: bold;
    cursor: move;
}

#toolbox {
    position: absolute;
    right: 0;
    top: 100px;
    box-shadow: 0 7px 14px 0 rgba(59,65,94,.1), 0 3px 6px 0 rgba(0,0,0,.07);
    width: 350px;
    height: auto;
    max-height: 350px;
    opacity: 0.6;
    border-radius: .375rem;
    transition: 0.5s opacity;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

#toolbox:hover {
    opacity: unset;
    transition: 0.5s opacity;
}
</style>