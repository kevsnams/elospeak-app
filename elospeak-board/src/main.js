import 'bootstrap';
import jstz from 'jstimezonedetect';
import App from './App.svelte';
import axios from 'axios';

let token = document.head.querySelector('meta[name="csrf-token"]');
if (token) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
    console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}

const app = new App({
	target: document.getElementById('main'),
	props: {
		timezone: jstz.determine().name()
	}
});

console.log('Timezone: '+ jstz.determine().name());

export default app;
