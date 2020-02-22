import 'bootstrap';
import jstz from 'jstimezonedetect';
import App from './App.svelte';

const app = new App({
	target: document.getElementById('main'),
	props: {
		timezone: jstz.determine().name()
	}
});

console.log('Timezone: '+ jstz.determine().name());

export default app;