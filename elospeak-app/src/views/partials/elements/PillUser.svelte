<script>
    export let data = null;
</script>

<div class="pill-user">
    <div class="row no-gutters">
        {#if data != null}
            <div class="col-auto mr-2">
                <img src="{data.photo_url}" class="rounded-circle" alt="Profile Photo" width="25">
            </div>
            <div class="col-auto">
                <a href="#/{data.user_type}?id={data.id}">{data.name}</a>
            </div>
        {:else}
            <div class="col-auto">
                <em>Pending</em>
            </div>
        {/if}
    </div>
</div>

<style>
.pill-user {
    display: inline-block;
    box-shadow: 0 0 0 1px rgba(43, 45, 80, 0.1),
        0 2px 5px 0 rgba(43, 45, 80, 0.08),
        0 1px 1.5px 0 rgba(0, 0, 0, 0.07),
        0 1px 2px 0 rgba(0, 0, 0, 0.08);
    padding: 5px;
    line-height: 1.5;
    border-radius: 0.2rem;
}

.pill-user a, .pill-user a:hover{
    color: #2c7be5;
    font-weight: bold;
    text-decoration: none;
}
</style>
