<script>
    import {onMount} from 'svelte';
    import axios from 'axios';
    import datepicker from 'js-datepicker';

    import User from './../user';
    onMount(() => {
        let birthday = ($User.birthday).split('-');
        birthday[1] = birthday[1] - 1;

        const fieldBirthday = datepicker('#field-birthday', {
            formatter: (input, date, instance) => {
                const month = date.getMonth() + 1;
                const day = date.getDate();

                input.value = [
                    date.getFullYear(),
                    (month < 10 ? '0'+ month : month),
                    (day < 10 ? '0' + day : day)
                ].join('-');
            },
            dateSelected: new Date(...birthday)
        });
    });

    let settingsProfileLoading = false;
    let updateProfileXHR = null;
    async function updateProfileSettings(event)
    {
        const form = event.target;
        const data = {};

        settingsProfileLoading = true;

        form.querySelectorAll('[name]').forEach((field) => {
            data[field.getAttribute('name')] = field.value;
            field.disabled = true;
        });

        try {
            updateProfileXHR = await axios.post('./app/settings/details', data);
            User.set(updateProfileXHR.data);
        } catch (e) {
            updateProfileXHR = e.response;
        }

        form.querySelectorAll('[name]').forEach((field) => {
            field.disabled = false;
        });

        settingsProfileLoading = false;
        
        return false;
    }

    let settingsPasswordLoading = false;
    let updatePasswordXHR = null;
    let updatePasswordErrors = [];
    async function updatePasswordSettings(event)
    {
        const form = event.target;
        const data = {};

        settingsPasswordLoading = true;

        form.querySelectorAll('[name]').forEach((field) => {
            data[field.getAttribute('name')] = field.value;
            field.disabled = true;
        });

        try {
            updatePasswordXHR = await axios.post('./app/settings/password', data);
        } catch (e) {
            updatePasswordXHR = e.response;

            for (let i in e.response.data.errors) {
                updatePasswordErrors.push(e.response.data.errors[i]);
            }
        }

        form.querySelectorAll('[name]').forEach((field) => {
            field.disabled = false;
        });

        settingsPasswordLoading = false;

        return false;
    }
</script>

<div class="settings">
    <div class="wbox profile">
        <h1 class="wbox-subheader">
            Profile Settings
        </h1>

        <div class="row fields">
            <div class="col">
                {#if updateProfileXHR != null && updateProfileXHR.status === 200}
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        Profile details updated!
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                {/if}
                <form on:submit|preventDefault={updateProfileSettings} method="POST">
                    <div class="form-row">
                        <div class="form-group col">
                            <label for="field-username">Username</label>
                            <input type="text" class="form-control" value="{$User.username}" readonly id="field-username">
                        </div>

                        <div class="form-group col">
                            <label for="field-email">Email address</label>
                            <input type="email" class="form-control" value="{$User.email}" readonly id="field-email">
                            <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group col">
                            <label for="field-full_name">Full name</label>
                            <input type="text" class="form-control" value="{$User.full_name}" name="full_name" id="field-full_name">
                        </div>

                        <div class="form-group col">
                            <label for="field-personal_contact_number">Personal contact number</label>
                            <input type="text" class="form-control" value="{$User.personal_contact_number}" name="personal_contact_number" id="field-personal_contact_number">
                        </div>

                        <div class="form-group col">
                            <label for="field-skype">Skype ID</label>
                            <input type="text" class="form-control" value="{$User.skype}" name="skype" id="field-skype">
                        </div>

                        <div class="form-group col">
                            <label for="field-birthday">Birthday</label>
                            <input type="text" class="form-control" value="{$User.birthday}" name="birthday" id="field-birthday">
                        </div>
                    </div>

                    {#if $User.user_type == 'teacher'}
                        <div class="form-group">
                            <label for="field-address">Address</label>
                            <input type="text" class="form-control" value="{$User.address}" name="address" id="field-address">
                        </div>
                    {/if}

                    <div class="float-right">
                        <button type="submit" class="btn btn-primary">
                            {#if settingsProfileLoading}
                                <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Loading...
                            {:else}
                                Update
                            {/if}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div class="wbox password">
        <h1 class="wbox-subheader">
            Change Password
        </h1>

        <div class="row fields">
            <div class="col">
                {#if updatePasswordXHR != null && updatePasswordXHR.status === 200}
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        <strong>Password updated!</strong> You may now login using your new password.
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                {:else if updatePasswordXHR != null && updatePasswordXHR.status !== 200}
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        <strong>{updatePasswordXHR.data.message}</strong> And here's the reason why:
                        <ul>
                            {#each updatePasswordErrors as error}
                                <li>{error}</li>
                            {/each}
                        </ul>
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                {/if}

                <form on:submit|preventDefault={updatePasswordSettings} method="POST">
                    <div class="form-row">
                        <div class="form-group col">
                            <label for="field-password">Password</label>
                            <input type="password" class="form-control" name="password" id="field-password">
                        </div>

                        <div class="form-group col">
                            <label for="field-password_repeat">Repeat Password</label>
                            <input type="password" class="form-control" name="password_repeat" id="field-password_repeat">
                        </div>
                    </div>

                    <div class="float-right">
                        <button type="submit" class="btn btn-primary">
                            {#if settingsPasswordLoading}
                                <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Loading...
                            {:else}
                                Update
                            {/if}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<style>
.wbox {
    padding: 0;
}

.wbox:not(:first-child) {
    margin-top: 30px;
}

.wbox-subheader {
    border-radius: inherit;
    padding: 20px 20px 0 20px;
    background-color: #fff !important;
    border-bottom: 0px solid #edf2f9;
    font-size: 1.2rem;
}

.fields {
    background-color: #f9fafd !important;
    margin: 20px 0 0 0 !important;
    padding-top: 20px;
    padding-bottom: 20px;
}
</style>