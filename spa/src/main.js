import './bootstrap';

import App from './App.svelte';

const app = new App({
	target: document.getElementById('app'),
	props: {
		ELOSpeak: window.ELOSpeak,
	}
});

export default app;