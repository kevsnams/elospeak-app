<script>
	import moment from 'moment';
	import axios from 'axios';
	import {
		ArrowLeftIcon,
		ClockIcon
	} from 'svelte-feather-icons'

	import Board from './board/Board.svelte';
	import SideBar from './board/SideBar.svelte';

	let isDoneInit = false;
	let retryTimeout = 10;
	let initText = 'Loading...';

	function initStatus(str)
	{
		initText = str;
	}

	let Classroom, UserCurrent, UserOther;

	async function fetchInitClassroom()
	{
		try {
			initStatus('Fetching classroom...');
			const xhr = await axios.post('./board/classroom');

			initStatus('Classroom found..');

			Classroom = xhr.data.Classroom;
			UserCurrent = xhr.data.Users.Current;
			UserOther = xhr.data.Users.Other;

			isDoneInit = true;
		} catch (e) {
			initStatus('Failed fetching classroom, please refresh your browser');
			return new Error(e);
		}
	}

	fetchInitClassroom();

	function showDrawer()
	{
		return;
	}

	let timeRemaining = ['--', '--'], timeDuration = [], timer;

	$: if (typeof Classroom != 'undefined') {
		if (!timeDuration.length) {
			const mEnd = moment(Classroom.end),
				mStart = moment(Classroom.start);
			let tSeconds = mEnd.diff(mStart, 'seconds');
			const hours = Math.floor(tSeconds / 3600);

			tSeconds %= 3600;

			const minutes = Math.floor(tSeconds / 60),
				seconds = tSeconds % 60;

			if (hours > 0) {
				timeDuration.push(hours < 10 ? '0'+ hours : hours);
			}

			timeDuration.push(minutes < 10 ? '0'+ minutes : minutes);
			timeDuration.push(seconds < 10 ? '0'+ seconds : seconds);
		}

		if (window.Worker && typeof timer == 'undefined') {
			timer = new Worker('./dist/board-timer.js');
			timer.postMessage({
				start: Classroom.start,
				end: Classroom.end
			});

			timer.onmessage = (e) => {
				timeRemaining = e.data;
			};
		}
	}
</script>

{#if !isDoneInit}
	<div class="container-fluid">
		<div class="row pt-5">
			<div class="col-12 text-center">
				<h3>{initText}</h3>
				<div class="spinner-border text-info mt-5" role="status">
					<span class="sr-only">Loading...</span>
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="header" id="header">
		<div class="container-fluid">
			<div class="row">
				<div class="col-auto">
					<a href="./app" id="drawer" on:click="{showDrawer}">
						<ArrowLeftIcon />
					</a>
				</div>
				<div class="col-auto">
					<h3 class="time">
						<span class="text"><ClockIcon /> Time Remaining</span> {timeRemaining.join(' : ')}
					</h3>
				</div>
			</div>
		</div>
	</div>

	<div class="container-fluid">
		<div class="row no-gutters">
			<div class="col-2">
				<SideBar {Classroom} {UserCurrent} {UserOther}  />
			</div>
			<div class="col-10">
				<Board classroom="{Classroom}" {UserCurrent} showToolbox={UserCurrent.user_type == 'teacher'} />
			</div>
		</div>
	</div>
{/if}

<style>
	#drawer {
		display: block;
		padding: 5px;
	}

	a#drawer:hover {
		background: #edf2f8;
	}

	.header {
		padding: 10px;
		background: #fff;
		box-shadow: 0 7px 14px 0 rgba(59,65,94,.1),0 3px 6px 0 rgba(0,0,0,.07);
	}

	.header .time {
		font-size: 1.1rem;
		line-height: 2rem;
		margin-bottom: 0;
	}

	.header .time .text {
		color: #fc4195;
	}
</style>