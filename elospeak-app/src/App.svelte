<script>
	import User from './user';
	import ELOClasses from './eloclasses';
	import axios from 'axios';
	import Router from 'svelte-spa-router';
	import {link} from 'svelte-spa-router';
	import active from 'svelte-spa-router/active';
	import {onMount} from 'svelte';
	import routes from './routes';

	import {
		HomeIcon,
		BookOpenIcon,
		SmileIcon,
		BellIcon,
		FileTextIcon,
		LogOutIcon
	} from 'svelte-feather-icons';

	export let ELOSpeak;

	User.set(ELOSpeak.User);

	async function fetchClassrooms()
	{
		const fetcher = await axios.post('./app/classrooms');

		try {
			return fetcher.data;
		} catch (e) {
			// Error
		}
	}

	onMount(async () => {
		ELOClasses.set(await fetchClassrooms());
	});
</script>

<div class="container" id="container">
	<div class="row">
		<div class="col-lg-2 col-md-2">
			<div id="logo" class="text-center">
				<img src="img/elospeak-logo.png" alt="logo">
			</div>

			<nav id="app-nav">
				<ul>
					<li>
						<a href="/" use:link use:active><HomeIcon /> Home</a>
					</li>
					<li>
						<a href="/classrooms" use:link use:active><BookOpenIcon /> Classrooms</a>
					</li>
					<!---
					<li>
						<a href="/feedbacks" use:link use:active><SmileIcon /> Feedbacks</a>
					</li>
					<li>
						<a href="/invoices" use:link use:active><FileTextIcon /> Invoices</a>
					</li>
					--->
					<li>
						<a href="{'./'+ $User.user_type +'/logout'}"><LogOutIcon /> Logout</a>
					</li>
				</ul>
			</nav>
		</div>

		<div class="col-lg-10 col-md-10">
			<div class="row">
				<div class="offset-9 col-3">
					<nav id="app-top-nav">
						<ul class="nav justify-content-end">
							<li class="nav-item dropdown">
								<a href="#" class="nav-link bell dropdown-toggle" data-toggle="dropdown"><BellIcon /></a>
								<div class="dropdown-menu dropdown-menu-right">
									<div class="p-2">
										No notifications
									</div>
								</div>
							</li>
							<li class="nav-item dropdown">
								<a href="#" class="nav-link dropdown-toggle" data-toggle="dropdown">
									<img src="{$User.photo_url}" style="margin-top: 7px;" width="35" class="shadow-sm rounded-circle" alt="user icon">
								</a>
								<div class="dropdown-menu dropdown-menu-right">
									<a class="dropdown-item" href="#/profile">Profile</a>
									<a class="dropdown-item" href="#/settings">Settings</a>
								</div>
							</li>
						</ul>
					</nav>
				</div>
			</div>

			<div class="row" id="routes">
				<div class="col-12">
					<Router {routes} />
				</div>
			</div>
		</div>
	</div>
</div>

<style>
:global(#app-nav ul li a.active) {
	color: #2c7be5 !important;
}

#container {
	margin-top: 20px;
}

#app-nav {
	margin-top: 20px;
}

#app-nav ul {
	display: block;
	padding: 0;
}

#app-nav ul li {
	list-style-type: none;
	display: block;
}

#app-nav ul li a {
	text-decoration: none;
	color: #5e6e82;
	font-weight: bold;
	padding: 5px;
	display: block;
}

#app-nav ul li a:hover {
	color: #232e3c;
}

#app-top-nav ul li a.bell {
	font-size: 1.9em;
	display: block;
	color: #232e3c;
	font-weight: bolder;
}

#app-top-nav .dropdown-toggle:after {
	display: none !important;
}

#routes {
	margin-top: 20px;
}
</style>