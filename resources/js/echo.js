import Echo from 'laravel-echo';
window.Pusher = require('pusher-js');

let token = document.head.querySelector('meta[name="csrf-token"]');

if (!token) {
    console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}

window.Echo = new Echo({
    authEndpoint : process.env.MIX_PUSHER_AUTH_ENDPOINT +'/broadcasting/auth',
    devMode: true,
    broadcaster: 'pusher',
    key: process.env.MIX_PUSHER_APP_KEY,
    cluster: process.env.MIX_PUSHER_APP_CLUSTER,
    encrypted: process.env.PUSHER_ENCRYPTED,
    wsHost: window.location.hostname,
    wsPort: 6001,
    wssPort: 6001,
    disableStats: true,
    auth: {
        headers: {
          'X-CSRF-TOKEN': token.content,
        }
    }
});
