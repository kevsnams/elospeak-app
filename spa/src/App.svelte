<script>
	export let ELOSpeak;

	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Router from 'svelte-spa-router'

	import _ from 'lodash';
	import axios from 'axios';

	import {
		BellIcon,
		SettingsIcon,
		LogOutIcon
	} from 'svelte-feather-icons';

	import { AuthUser } from 'elo/stores';
	import { url } from 'elo/util';
	import { routes } from 'elo/routes';

	import AppNavigation from 'elo/components/partials/AppNavigation.svelte';
	import Spinner from 'elo/components/partials/Spinner.svelte';

	let routedContents = _.mapValues(routes, (value) => {
		return value.component;
	});

	async function start()
	{
		try {
			const fetchAuthUser = await axios.get('./app/get-auth-user');

			AuthUser.set(fetchAuthUser.data);
		} catch (e) {

		}
	}

	const init = start();

	let windowHeight = window.innerHeight;
	function windowResize()
	{
		windowHeight = window.innerHeight;
	}
</script>

<div class="d-flex main">
	<div class="main-nav" style="height: { windowHeight }px">
		<div class="nav-content">
			<div class="logo">
				<a href="{ url('/app') }">
					<img src="{ url('/front/img/logo-xsmall.png') }" alt="Logo">
				</a>
			</div>
			<AppNavigation></AppNavigation>
		</div>
	</div>
	<div class="main-content">
		{#await init}
			<Spinner />
		{:then}
			<Router routes={ routedContents }></Router>
		{:catch}
			Failed fetching resources
		{/await}
	</div>
	<div class="main-sidebar">
		<nav id="sidebar">
			<span>
				<a href="javascript:;">
					<BellIcon />
				</a>
			</span>

			<span>
				<a href="javascript:;">
					<SettingsIcon />
				</a>
			</span>

			<span>
				<a href="javascript:;">
					<LogOutIcon />
				</a>
			</span>
		</nav>
	</div>
</div>

<style>
:global(.elo-card) {
	background: #fff;
    padding: 1.5rem;
    border-radius: 1rem;
    margin-top: 3rem;
    box-shadow: 0 0 0 1px rgba(43, 45, 80, 0.1),
        0 2px 5px 0 rgba(43, 45, 80, 0.08),
        0 1px 1.5px 0 rgba(0, 0, 0, 0.07),
        0 1px 2px 0 rgba(0, 0, 0, 0.08);
}

:global(a) {
	color: #92c2fd;
	text-decoration: none;
}

:global(a:hover) {
	text-decoration: underline;
}

:global(.main) {
	font-size: 1em;
	font-family: 'Quicksand',
		system-ui,
		-apple-system,
		BlinkMacSystemFont,
		"Segoe UI",
		Roboto,
		Ubuntu,
		"Helvetica Neue",
		sans-serif;
	width: 100%;
	margin: 0 auto;
	color: #4c4a4a;
}
:global(.font-quicksand) {
	font-family: 'Quicksand',
		system-ui,
		-apple-system,
		BlinkMacSystemFont,
		"Segoe UI",
		Roboto,
		Ubuntu,
		"Helvetica Neue",
		sans-serif;
}
:global(.font-roboto) {
	font-family: 'Roboto Slab', Georgia, 'Times New Roman', Times, serif;
}

:global(.text-pink) {
	color: #fc719f;
}

:global(.text-blue) {
	color: #92c2fd;
}

:global(h1, h2, h3, h4, h5) {
	font-family: 'Roboto Slab', Georgia, 'Times New Roman', Times, serif;
	font-weight: bold;
}

:global(.content) {
	padding: 3rem;
	background: #F6F4FC;
}

nav#sidebar {
	margin-top: 2rem;
}
nav#sidebar span {
	display: block;
	padding-left: 1rem;
}

nav#sidebar span a {
	display: inline-block;
	font-size: 1.9rem;
	color: #92c2fd;
	width: 3rem;
	height: 3rem;
	border-radius: 100%;
	text-align: center;
}

nav#sidebar span a:hover {
	background: #ffbcd22d;
	color: #fc719f;
	transition-property: background, color;
	transition-duration: 500ms;
}

.main-nav {
	width: 15%;
	border-right: 1px solid rgb(230, 236, 240);
}

.nav-content {
	margin-top: 2rem;
	margin-left: 4rem;
}

.nav-content .logo {
	width: 100%;
	text-align: center;
	margin-bottom: 4rem;
}

.main-content {
	width: 70%;
}

.main-sidebar {
	width: 15%;
	border-left: 1px solid rgb(230, 236, 240);
}
</style>

<svelte:window on:resize={ _.debounce(windowResize, 150) }></svelte:window>