import App from './App.svelte';
import jstz from 'jstimezonedetect';

const app = new App({
	target: document.getElementById('login'),
	props: {
		timezone: jstz.determine().name()
	}
});

export default app;