window._ = require('underscore');

window.UIkit = require('uikit');
window.Icons = require('uikit/dist/js/uikit-icons');
window.moment = require('moment');

UIkit.use(Icons);

import Echo from 'laravel-echo';

/**
 * Register Pusher
 */
window.Pusher = require('pusher-js');

/**
 * Register Echo
 */
window.Echo = new Echo({
    authEndpoint : process.env.MIX_PUSHER_AUTH_ENDPOINT +'/broadcasting/auth',
    devMode: true,
    broadcaster: 'pusher',
    key: process.env.MIX_PUSHER_APP_KEY,
    cluster: process.env.MIX_PUSHER_APP_CLUSTER,
    //encrypted: true
    wsHost: window.location.hostname,
    wsPort: 6001
});

/**
 * Register AXIOS
 */
window.axios = require('axios');

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

let token = document.head.querySelector('meta[name="csrf-token"]');

if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
}

import Classroom from './Classroom-v2/Classroom';

window.ELOSpeakClassroom = null;
window.addEventListener('load', (evt) => {
    ELOSpeakClassroom = new Classroom('vr-db-0');
});