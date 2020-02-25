<script>
    export let chats
    export let UserCurrent;
    export let UserOther;
</script>

{#each chats as chat}
    {#if chat.from == UserCurrent.user_type}
        <div class="align-self-end w-100 mb-2">
            <div class="d-flex justify-content-end">
                <div class="chat align-self-center right">
                    {chat.message}
                </div>
                <div class="ml-2 align-self-start">
                    <img width="40" src="{UserCurrent.photo_url}" class="user-photo rounded-circle" alt="haha">
                </div>
            </div>
        </div>
    {:else}
        <div class="align-self-end w-100 mb-2">
            <div class="d-flex justify-content-start">
                <div class="chat order-2 align-self-center left">
                    {chat.message}
                </div>
                <div class="mr-2 order-1 align-self-start">
                    <img width="40" src="{UserOther.photo_url}" class="user-photo rounded-circle" alt="haha">
                </div>
            </div>
        </div>
    {/if}
{/each}

<style>
.user-photo {
    border: 3px solid #fff;
}
.chat {
    display: inline-block;
    padding: .5rem;
    margin-bottom: .4rem;
    font-size: 0.9rem;
    border-radius: .375rem;
    word-wrap: anywhere;
}
.chat.right {
    background: #0087ff;
    color: #fff;
}
.chat.left {
    background: #e4e4e4;
    color:#1c1c1c;
}
</style>