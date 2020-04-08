import Echo from 'laravel-echo';
window.Pusher = require('pusher-js');

window.Echo = new Echo({
    authEndpoint : process.env.MIX_PUSHER_AUTH_ENDPOINT +'/broadcasting/auth',
    devMode: true,
    broadcaster: 'pusher',
    key: process.env.MIX_PUSHER_APP_KEY,
    cluster: process.env.MIX_PUSHER_APP_CLUSTER,
    encrypted: PUSHER_ENCRYPTED,
    wsHost: window.location.hostname,
    wsPort: 6001,
    wssPort: 6001,
    disableStats: true
});