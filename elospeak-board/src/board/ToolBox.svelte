<script>
    export let mode = 'brush';
    export let Classroom;

    import {onMount, createEventDispatcher, tick} from 'svelte';
    const dispatch = createEventDispatcher();
    
    import _ from 'underscore';
    import {genId, pluralize} from './util.js';
    import {
        PlusSquareIcon,
        ImageIcon,
        RefreshCwIcon,
        ChevronsRightIcon,
        UploadIcon,
        CheckIcon,
        ChevronsUpIcon,
        ChevronsDownIcon
    } from 'svelte-feather-icons';
    import axios from 'axios';

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
        e.stopPropagation();
        
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
        e.stopPropagation();

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

    function addLayer()
    {
        dispatch('addLayer', null);
    }

    function clearLayer()
    {
        dispatch('clearLayer', null);
    }

    let showDropUploader = false, imagesForUpload = false;
    export let displayUploader = false;

    const allowedFiles = [
        'image/jpeg',
        'image/jpg',
        'image/png'
    ];

    function filterFiles(files)
    {
        let tkn = [];
        for (let i = 0; i < files.length; i++) {
            const file = files.item(i);
            const id = `${Classroom.id}_img_${genId()}`;

            if (allowedFiles.indexOf(file.type) > -1) {
                tkn = [...tkn, {
                    file,
                    id
                }];
            }
        }

        return tkn;
    }

    async function startUpload()
    {
        await tick();

        let images = [];

        imagesForUpload.forEach(async (image, index) => {
            const data = new FormData();
            data.set('image', image.file);
            data.set('node', image.id);

            const img = document.querySelector('[data-image-id="'+ image.id +'"]');
            const progress = img.querySelector('.queue-progress .progress .progress-bar');
            
            try {
                const upload = await axios.post('./classroom/image-upload', data, {
                    onUploadProgress: (progressEvent) => {
                        img.querySelector('.queue-progress').style.display = 'block';

                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        progress.style.width = percentCompleted +'%';
                        progress.innerHTML = percentCompleted +'%';
                    }
                });

                images.push(upload.data);
            } catch (e) {
                // upload image error
            }

            if (index == imagesForUpload.length - 1) {
                dispatch('addImages', images);
            }
        });
    }

    function createPreview()
    {
        if (_.isArray(imagesForUpload) && imagesForUpload.length) {
            imagesForUpload.forEach((image) => {
                const reader = new FileReader();

                reader.onload = (e) => {
                    document.getElementById(image.id).setAttribute('src', e.target.result);
                };

                reader.readAsDataURL(image.file);
            });
        }

        startUpload();
    }

	function dropFiles(e)
	{
		showDropUploader = false;
        imagesForUpload = filterFiles(e.dataTransfer.files);
        displayUploader = true;

        createPreview();
    }

    function selectFiles(e)
    {
        const fileSelect = document.getElementById('select-files');
        imagesForUpload = filterFiles(fileSelect.files);
        displayUploader = true;

        createPreview();
    }
    
    function openManualUploader()
    {
        const fileSelect = document.getElementById('select-files');
        fileSelect.click();
    }

    let isHiddenToolbox = false;

    function toggleToolbox()
    {
        if (isHiddenToolbox) {
            isHiddenToolbox = false;
        } else {
            isHiddenToolbox = true;
        }
    }
</script>

<svelte:body
	on:drag|preventDefault|stopPropagation
	on:dragstart|preventDefault|stopPropagation
	on:dragend|preventDefault|stopPropagation={() => {showDropUploader = false}}
	on:dragover|preventDefault|stopPropagation={() => {showDropUploader = true}}
	on:dragenter|preventDefault|stopPropagation={() => {showDropUploader = true}}
	on:dragleave|preventDefault|stopPropagation={() => {showDropUploader = false}}
	on:drop|preventDefault|stopPropagation={dropFiles}
/>

<div id="uploader-box" class="awesome-bg" class:show={displayUploader}>
    {#if imagesForUpload !== false}
        <div id="queue-files">
            <h4 class="text-center mb-3" style="color: #fff">Uploading {imagesForUpload.length} {pluralize('image', imagesForUpload.length > 1)}</h4>
            <div class="d-flex flex-wrap justify-content-center">
                {#each imagesForUpload as image}
                    <div class="queue-image" data-image-id="{image.id}">
                        <span class="queue-progress">
                            <div class="progress">
                                <div class="progress-bar"></div>
                            </div>
                        </span>
                        <img id="{image.id}" alt="Lesson">
                    </div>
                {/each}
            </div>
        </div>
    {/if}
</div>

<div id="drag-curtain" class="awesome-bg" class:show={showDropUploader}>
    <div class="curtain">
        <div class="icon"><UploadIcon /></div>
        <div class="text">Drag &amp; drop files here to start uploading</div>
    </div>
</div>

<div id="toolbox" bind:this={dragBox}>
    <input type="file" on:change={selectFiles} style="position: absolute; left: -9999px;" multiple name="files" id="select-files">
    
    <div class="d-flex header" bind:this={dragElem}>
        <div class="align-self-start toolbox-toggle" on:click|preventDefault|stopPropagation|self={toggleToolbox}>
            {#if isHiddenToolbox}
                <ChevronsDownIcon />
            {:else}
                <ChevronsUpIcon />
            {/if}
        </div>
        <div class="align-self-center text-center w-100">TOOLBOX</div>
    </div>
    <div class="content" style="{isHiddenToolbox ? 'display: none;' : 'display: block;'}">
        <div class="row">
            <div class="col-12 text-center">
                <button class="btn btn-tool btn-sm" on:click={addLayer}><PlusSquareIcon /> Add Layer</button>
                <button class="btn btn-tool btn-sm" on:click={openManualUploader}><ImageIcon /> Upload Image</button>
                <button class="btn btn-tool btn-sm" on:click={clearLayer}><RefreshCwIcon /> Clear</button>
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
            <svelte:component this={getMode(mode).component} on:deleteNode on:shapeColors />
        </div>
    </div>
</div>

<style>
.toolbox-toggle {
    cursor: pointer;
}
.awesome-bg {
    display: none;
    z-index: 999;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgb(255,132,250);
    background: linear-gradient(50deg, rgba(255,132,250,0.9) 0%,
        rgba(108,133,230,0.8) 50%,
        rgba(0,212,255,0.8) 100%);
}

.awesome-bg.show {
    display: block;
}

#queue-files {
    width: 80%;
    margin: 0 auto;
    min-height: 40%;
    height: 40%;
    max-height: 40%;
    margin-top: 100px;
}
#queue-files .queue-image .queue-progress {
    display: none;
    position: absolute;
    width: inherit;
    text-align: center;
    margin-left: -10px;
    font-size: 2rem;
    background:rgba(237, 242, 248, 0.9);
    height: inherit;
    margin-top: -10px;
    border-radius: 10px;
    line-height: 6rem;
    color:#444;
}

#queue-files .queue-image {
    width: 100px;
    height: 125px;
    margin-right: 15px;
    padding: 10px;
    border-radius: 10px;
    background: #edf2f8;
    box-shadow: 0 7px 14px 0 rgba(59,65,94,.1),0 3px 6px 0 rgba(0,0,0,.07);
    border-bottom: 1px solid #555;
}

#queue-files .queue-image img {
    max-width:100%;
    max-height:100%;
}

#drag-curtain .curtain {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
}

.curtain .icon {
    font-size: 7rem;
    color: #fff;
}

.curtain .text {
    color: #fff;
    font-size: 2rem;
}

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