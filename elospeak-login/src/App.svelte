<script>
	export let timezone;

	import {onMount} from 'svelte';
	import axios from 'axios';

	let currentTab = 'student', bg;
	function switchTab(tab)
	{
		bg.style.opacity = 0.7;
		currentTab = tab;
		setTimeout(() => {
			bg.style.opacity = 1;
		}, 1000);
	}

	let doingLogin = false, loginSuccess = null;
	async function doLogin(e)
	{
		const data = new FormData(e.target);
		doingLogin = true;
		try {
			const xhr = await axios.post('./login/auth', data);

			if (!xhr.data.success) {
				doingLogin = false;
				loginSuccess = false;
			} else {
				loginSuccess = true;

				setTimeout(() => {
					top.location.href = './app';
				}, 1500);
			}
		} catch (e) {
			doingLogin = false;
		}
		return false;
	}
</script>
<div class="bg {currentTab == 'student' ? 'student-bg' : 'teacher-bg'}" bind:this={bg}></div>
<div class="login-container d-flex login-container justify-content-start align-items-center">
	<div class="login-wrapper">
		<div class="login-type">
			<a href="javascript:;" class="a-student" 
				class:inactive={currentTab != 'student'} 
				on:click={() => {
					switchTab('student')
				}}>
					Student
			</a>
			<a href="javascript:;" class="a-teacher inactive" 
				class:inactive={currentTab != 'teacher'} 
				on:click={() => {
					switchTab('teacher')
				}}>
					Teacher
			</a>
		</div>
		<div id="login-form">
			<div class="text-center pt-3">
				<img src="./img/elospeak-logo.png" alt="elospeak logo" />
				<span class="sl">
					{#if currentTab == 'student'}
						Start learning english!
					{:else}
						Start teaching english!
					{/if}
				</span>
			</div>
			<div class="mt-3 p-3">
				<h5 class="mb-3">Login as {currentTab}</h5>
				{#if loginSuccess === false}
					<div class="alert alert-danger">
						Incorrect Username or Password
					</div>
				{/if}

				{#if loginSuccess === true}
					<div class="alert alert-success" role="alert">
						Login successfully, redirecting...
					</div>
				{/if}

				<form method="POST" on:submit|preventDefault={doLogin}>
					<input type="hidden" name="timezone" value="{timezone}">
					<input type="hidden" name="auth_type" value={currentTab}>
					<div class="form-group row">
						<div class="col-sm-12">
							<input type="text" placeholder="Username" class="form-control" name="username" id="field-username">
						</div>
					</div>

					<div class="form-group row">
						<div class="col-sm-12">
							<input type="password" placeholder="Password" class="form-control" name="password" id="field-password">
						</div>
					</div>
					<div class="form-group form-check">
						<input type="checkbox" class="form-check-input" id="form-remember">
						<label class="form-check-label" name="remember_me" for="form-remember">
							<span style="font-size: 0.9rem; font-weight: bold">Remember</span>
						</label>
					</div>
					<button type="submit" class="btn btn-primary btn-lg btn-block btn-login">
						{#if doingLogin}
							<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...
						{:else}
							Login
						{/if}
					</button>
				</form>
			</div>
		</div>
	</div>
</div>

<style>
	.sl {
		display: block;
		font-size: 1rem;
		margin-top: 1rem;
		font-family: 'Patrick Hand';
		color: #959595;
	}
	.btn-login {
		background-color:#3b9aff;
		border-color:#3b9aff;
	}
	.bg {
		position: absolute;
		width: 100%;
		height: 100%;
		transition-duration: 1s;
		transition-property: opacity;
	}
	.student-bg {
		background: rgb(255,132,250);
		background: linear-gradient(50deg,
			rgba(255,132,250,0.9) 0%,
			rgba(108,133,230,0.9) 50%,
			rgba(0,212,255,0.9) 100%
		);
	}
	.teacher-bg {
		background: rgba(0,212,255);
		background: linear-gradient(50deg,
			rgba(0,212,255,0.9) 0%,
			rgba(108,133,230,0.9) 50%,
			rgba(255,132,250,0.9) 100%
		);
	}

	.login-container {
		width: 100%;
		height: 100%;
		position: absolute;
		color: #344050;
		font-family: "Quicksand", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
	}
	.login-wrapper {
		margin-top: -10rem;
		margin-left: 10rem;
		width: 20%;
	}
	.login-type a:first-child {
		border-top-left-radius: .375rem;
	}
	.login-type a:last-child {
		border-top-right-radius: .375rem;
	}
	.a-student {
		color: rgb(255,132,250);
	}
	.a-teacher {
		color: rgba(0,212,255);
	}
	.login-type {
		font-size: 0;
	}
	.login-type a {
		text-decoration: none;
		display: inline-block;
		background: #fff;
		padding: 10px 20px;
		font-size: 0.9rem;
		font-weight: bold;
		outline: 0;
	}
	.login-type a.inactive {
		background: #ccc;
		color: #fffefe;
	}

	#login-form {
		background: #fff;
		border-bottom-left-radius: .375rem;
		border-bottom-right-radius: .375rem;
		border-top-right-radius: .375rem;
		box-shadow: 0 7px 14px 0 rgba(59,65,94,.1), 0 3px 6px 0 rgba(0,0,0,.07);
		color: #959595;
	}
</style>