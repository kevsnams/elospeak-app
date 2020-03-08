<script>
    export let Classroom;
    export let UserCurrent;
    export let UserOther;

    import axios from 'axios';
    import {afterUpdate} from 'svelte';
    import ChatMessages from './ChatMessages.svelte';

    const Channel = `classroom.${Classroom.id}.board`;

    let isStatusActive = false;
    if (window.Worker) {
        const worker = new Worker('./dist/status-indicator.js');
        worker.postMessage({
            evt: 'start',
            xsrf: document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            other: UserOther.id
        });

        worker.onmessage = (e) => {
            isStatusActive = e.data;
        };
    }

    const LaravelEcho = window.Echo;

    let isCurrentUserTyping = false, isOtherUserTyping = false, typeTimer = null, chatbox;

    afterUpdate(() => {
        chatbox.scrollTop = chatbox.scrollHeight;
    });

    function currentUserTyping(e)
    {
        isCurrentUserTyping = true;

        if (typeTimer) {
            clearTimeout(typeTimer);
        }

        typeTimer = setTimeout(() => {
            isCurrentUserTyping = false;
        }, 1000);
    }

    function sendChat(e)
    {
        const message = e.target.value;
        if (e.key == 'Enter') {
            e.target.value = '';
            try {
                const xhr = axios.post('./classroom/chat/send', {
                    message,
                    classroom_id: Classroom.id
                });
            } catch (e) {
                // error sending message
            }
            return false;
        }
    }

    const previousChats = axios.post('./classroom/chat/load', {
        id: Classroom.id
    });
    
    LaravelEcho.private(Channel).listenForWhisper('otherUserTyping', (isTyping) => {
        isOtherUserTyping = isTyping;
    });

    let newChats = [];
    LaravelEcho.private(Channel).listen('NewChat', (chat) => {
        newChats = [...newChats, chat];
    });

    $: {
        LaravelEcho.private(Channel).whisper('otherUserTyping', isCurrentUserTyping);
    }
</script>


<div class="sb-box coms mt-4">
    <span class="text-header">{UserOther.user_type.toUpperCase()}</span>
    <div class="d-flex">
        <div class="align-self-center">
            <img class="rounded-circle user-photo" width="65" src="{UserOther.photo_url}" alt="{UserOther.user_type.toUpperCase()}" />
        </div>
        <div class="align-self-center ml-3">
            <a href="./app#/{UserOther.user_type}?id={UserOther.id}" target="_blank" class="text-header" style="margin-bottom: 0;">{UserOther.full_name}</a>
            <div class="online-status">
                {#if isStatusActive}
                    <span class="rounded-circle indicator available"></span>
                    <span class="itext">Available</span>
                {:else}
                    <span class="rounded-circle indicator offline"></span>
                    <span class="itext">Offline</span>
                {/if}
            </div>
            <div style="font-size: 0.8rem;" class="pt-1">
                <hr style="margin: 0;" />
                <a href="skype:{UserOther.skype}?chat">Skype</a>
            </div>
        </div>
    </div>
</div>

<div class="sb-box mt-4">
    <div class="header">CHAT</div>
    <div class="chatlog">
        <div class="chats d-flex flex-column p-2" bind:this={chatbox}>
            {#await previousChats}
                <div class="align-self-center w-100 text-center">
                    <div class="spinner-grow" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                    <span class="st">Loading...</span>
                </div>
            {:then chats}
                {#if chats.data.length}
                    <ChatMessages chats={chats.data} UserCurrent={UserCurrent} UserOther={UserOther} />
                {/if}
            {:catch}
                <div class="align-self-center w-100">
                    <div class="alert alert-danger mb-0 st pr-0 pl-0" role="alert">
                        Messages are unavailable
                    </div>
                </div>
            {/await}

            <ChatMessages chats={newChats} UserCurrent={UserCurrent} UserOther={UserOther} />
        </div>
        <div class="chat-status p-2" class:invisible={!isOtherUserTyping}>{UserOther.user_type} is typing...</div>
        <div class="chat-input">
            <input type="text" on:keydown={currentUserTyping} on:keypress={sendChat} class="form-control" placeholder="Press ENTER to send...">
        </div>
    </div>
</div>

<style>
.chats {
    font-size: 1rem;
    height: 350px;
    overflow-y: auto;
}

.chats .st {
    display: block;
    font-size: 0.8rem;
}
.chatlog .chat-input {
    padding: 5px;
    background: #fff;
    border-bottom-left-radius: .375rem;
    border-bottom-right-radius: .375rem;
}
.chatlog .chat-status {
    color:#8c8c8c;
    font-weight: bold;
    font-size: 0.8rem;
}
.chat-status:first-letter {
    text-transform:capitalize;
}
.chat-input input[type="text"] {
    font-size: 0.8rem;
    box-shadow: none;
}

.online-status .indicator.offline {
    background: #a2a2a2;
}
.online-status .indicator.available {
    background: #1ea827;
}
.online-status .itext {
    font-size: 0.7rem;
    padding-left: 10px;
}
.online-status .indicator {
    display: block;
    float: left;
    width: 10px;
    height: 10px;
    margin-top: 9px;
}
.user-photo {
    border: 5px solid #fff;
    box-shadow: 0 7px 14px 0 rgba(59,65,94,.1), 0 3px 6px 0 rgba(0,0,0,.07);
}
.sb-box {
    box-shadow: 0 7px 14px 0 rgba(59,65,94,.1), 0 3px 6px 0 rgba(0,0,0,.07);
    border-radius: .375rem;
}
.sb-box .text-header {
    font-size: .8rem;
    font-weight: bold;
    display: block;
    margin-bottom: 10px;
}
.sb-box.coms {
    background: #fff;
    border-radius: .375rem;
    padding: 10px;
}
.sb-box .header {
    font-weight: bold;
    font-size: .8rem;
    color: #344050;
    background: #fff;
    text-align: center;
    padding: 10px;
    border-top-left-radius: .375rem;
    border-top-right-radius: .375rem;
}
</style>