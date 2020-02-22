<script>
    import User from './../user';
    import UserProfile from './partials/UserProfile.svelte';
</script>

<UserProfile info={$User} showUploadImageForm=true />