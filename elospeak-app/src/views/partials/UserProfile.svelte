<script>
    import User from '../../user';
    import axios from 'axios';
    import {onMount} from 'svelte';

    export let info;
    export let showUploadImageForm = false;

    import Spinner from './elements/Spinner.svelte';

    import {
        MessageCircleIcon,
        MailIcon,
        PhoneIcon,
        CameraIcon,
        MessageSquareIcon
    } from 'svelte-feather-icons';

    let imageField;

    const defaultPhoto = './img/elo-avatar.png';

    function showFilePicker()
    {
        imageField.click();
    }

    function savePhoto()
    {
        const file = imageField.files[0];
        const data = new FormData();
        data.append('image', file);

        const allowedTypes = [
            'image/png', 'image/jpeg'
        ];

        if (allowedTypes.indexOf(file.type) < 0) {
            alert('We only allow image in these following formats: jpg, jpeg, png');
            return false;
        }

        const config = {
            onUploadProgress: (progressEvent) => {
                let percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
            }
        };

        axios.post('./app/settings/photo', data, config).then((res) => {
            const prevUser = $User;
            prevUser.photo_url = res.data.imageURL;
            User.set(prevUser);
        }).catch((err) => {
            alert('Upload Error');
        });
    }

    const fetchFeedbacks = axios.get('./classroom-feedbacks', {
        params: {
            to: info.id,
            to_user_type: info.user_type,
            with: ['classroom']
        }
    });
</script>

<div class="profile">
    <div class="wbox bg-{info.user_type}" style="padding-top: 150px;">
        <div class="row p-3 details no-gutters">
            <div class="col-auto">
                <img src="{showUploadImageForm ? $User.photo_url : info.photo_url}" class="img-thumbnail img-fluid shadow-sm rounded-circle" width="120"  alt="Profile Photo" style="margin-top: -60px;">

                {#if showUploadImageForm}
                    <form on:submit|preventDefault>
                        <input id="user-photo" type="file" class="invisible" bind:this={imageField} style="position: absolute; left: -999" on:change="{savePhoto}" />

                        <a href="javascript: void(0);" on:click="{showFilePicker}" style="display: block; text-align: center">
                            <CameraIcon /> Change Photo
                        </a>
                    </form>
                {/if}

            </div>

            <div class="col">
                <div class="pl-5">
                    <h2>{info.name}</h2>

                    <dl class="row the-dl">
                        <dt class="col-sm-3">Contact No</dt>
                        <dd class="col-sm-9"><PhoneIcon /> {@html info.personal_contact_number ? '<a href="tel:'+ info.personal_contact_number +'">'+ info.personal_contact_number +'</a>' : '<em>None</em>'}</dd>

                        <dt class="col-sm-3">Email Address</dt>
                        <dd class="col-sm-9"><MailIcon /> <a href="mailto:{info.email}">{info.email}</a></dd>

                        <dt class="col-sm-3">Age</dt>
                        <dd class="col-sm-9">{@html info.age == 0 ? '<em>Not Specified</em>' : info.age }</dd>

                        <dt class="col-sm-3">Skype</dt>
                        <dd class="col-sm-9"><MessageCircleIcon /> <a href="skype:{info.skype}?chat">Chat Now</a></dd>

                        {#if info.user_type == 'teacher'}
                            <dt class="col-sm-3">Address</dt>
                            <dd class="col-sm-9">{@html info.address ? info.address : '<em>None</em>'}</dd>
                        {/if}
                    </dl>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="feedbacks mt-5">
    <div class="wbox p-3">
        <h3 class="wbox-header"><MessageSquareIcon /> Feedbacks</h3>
        <hr>
        {#await fetchFeedbacks}
            <Spinner />
        {:then response}
            {#each response.data as feedback}
                <div class="row feedback">
                    <div class="col-2 text-center">
                        <a href="#/{ feedback.from.user_type }?id={ feedback.from.id }">
                            <img src="{ feedback.from.photo_url }" alt="{ feedback.from.name }" class="rounded-circle mt-3" width="75" />
                        </a>
                    </div>
                    <div class="col-10">
                        <p>
                            <a href="#/{ feedback.from.user_type }?id={ feedback.from.id }">{ feedback.from.name }</a> said
                        </p>
                        <blockquote class="blockquote">
                            <p class="mb-0">{ feedback.feedback }</p>
                            <footer class="blockquote-footer">on <cite title="Source Title">{ feedback.human_date }</cite></footer>
                        </blockquote>
                    </div>
                </div>
            {:else}
                <h4 class="text-muted">No feedbacks yet</h4>
            {/each}
        {:catch}
            <div class="alert alert-error mt-3">Failed to fetch feedbacks. Please try again.</div>
        {/await}
    </div>
</div>

<style>
.profile .details {
    background: #fff;
    border-bottom-left-radius: inherit;
    border-bottom-right-radius: inherit;
}

.profile .the-dl {
    margin-top: 10px;
    padding-top: 20px;
    border-top: 1px solid #edf2f9;
}

.bg-student {
    background: url('../img/green-bg.png') repeat scroll transparent;
}

.bg-teacher {
    background: url('../img/blue-bg.png') repeat scroll transparent;
}

.wbox {
    padding: 0;
}

.feedback:not(:last-child) {
    margin-bottom: 1rem;
}
</style>
