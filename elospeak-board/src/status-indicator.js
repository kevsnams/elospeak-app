import axios from 'axios';

async function ping(other)
{
    try {
        const xhr = await axios.post('../board/ping', {
            other
        }),
            lastActive = new Date(xhr.data.datetime),
            now = new Date(),
            inactive = 20;

        const diffSec = (now.getTime() - lastActive.getTime()) / 1000;
        if (diffSec < inactive) {
            postMessage(true);
        } else {
            postMessage(false);
        }
    } catch (e) {
        console.log('[Cannot PING]');
        postMessage(false);
    }

    setTimeout(() => {
        ping(other);
    }, 10000);
}

onmessage = (e) => {
    if (e.data.evt == 'start') {
        axios.defaults.headers.post['X-CSRF-TOKEN'] = e.data.xsrf;
        ping(e.data.other);
    }
};