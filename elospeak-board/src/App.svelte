<script>
	import moment from 'moment';
	import axios from 'axios';
	import {
		ArrowLeftIcon,
		ClockIcon
	} from 'svelte-feather-icons';
	import {onMount} from 'svelte';

	import Board from './board/Board.svelte';
	import SideBar from './board/SideBar.svelte';

	let isDoneInit = false,
		retryTimeout = 10,
		initText = 'Loading...';

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
			initStatus('You do not have a class today. Go <a href="./app"> back</a> to home page');
			return new Error(e);
		}
	}

	fetchInitClassroom();

	let feedbackField, feedbackSubmit, feedbackFormSubmitted = false;
	async function submitFeedback()
	{
		const feedback = (feedbackField.value).replace(/\s+/, '');

		if (!feedback.length) {
			alert('You have an empty feedback. If you don\'t want to send a feedback, click "Skip"');
			return;
		}

		feedbackFormSubmitted = true;
		feedbackField.disabled = true;
		feedbackSubmit.disabled = true;

		try {
			const xhr = await axios.post('./board/feedback', {
				classroom_id: Classroom.id,
				message: feedback
			});
		} catch (e) {
			// @TODO error sending feedback
		}

		setTimeout(() => {
			window.location.href = './app';
		}, 1000);
	}

	let timeRemaining = ['--', '--'], timeDuration = [], timer, showFeedbackForm = false;

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

			timer.onmessage = async (e) => {
				if (e.data !== false ) {
					timeRemaining = e.data;
				} else {
					try {
						const closeBoard = await axios.post('./board/close', {
							id: Classroom.id
						});
					} catch (e) {
						// @TODO error closing board
					}

					showFeedbackForm = true;
				}
			};
		}
	}
</script>
{#if !isDoneInit}
	<div class="container-fluid">
		<div class="row pt-5">
			<div class="col-12 text-center">
				<h3>{@html initText}</h3>
				<div class="spinner-border text-info mt-5" role="status">
					<span class="sr-only">Loading...</span>
				</div>
			</div>
		</div>
	</div>
{:else}
	<div id="feedback-form" class="awesome-bg" class:show={showFeedbackForm}>
		<div class="d-flex justify-content-center align-items-center" style="height: 100%">
			<div class="text-center">
				<h1 class="font-patrick-hand tr-1">Class is over.Thank you!</h1>
				<span class="tr-2">What can you say about your overall experience? Let us know!</span>
				<div class="the-form tr-3 mt-3">
					<textarea class="form-control" bind:this={feedbackField} placeholder="Say something here"></textarea>
				</div>
				<div class="the-form mt-3 tr-4">
					<button class="btn btn-primary" bind:this={feedbackSubmit} on:click={submitFeedback}>
						{#if feedbackFormSubmitted}
							<span class="spinner-grow spinner-grow-sm" role="status"></span> Loading...
						{:else}
							Submit Feedback
						{/if}
					</button>
					<a href="./app" class="btn btn-secondary">Skip</a>
				</div>
			</div>
		</div>
	</div>

	<div class="header" id="header">
		<div class="container-fluid">
			<div class="row">
				<div class="col-auto">
					<a href="./app" id="drawer">
						<ArrowLeftIcon /> Back
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
	#feedback-form .the-form {
		position: relative;
	}
	#feedback-form {
		color: #fff;
	}
	#feedback-form .tr-1 {
		font-size: 6rem;

		transition-delay: 1s;
		transition-duration: 500ms;
		transition-property: opacity;
		opacity: 0;
	}
	#feedback-form.show .tr-1 {
		opacity: 1;
	}

	#feedback-form .tr-2 {
		display: block;
		transition-delay: 2s;
		transition-duration: 500ms;
		transition-property: opacity;
		opacity: 0;
	}

	#feedback-form.show .tr-2 {
		opacity: 1;
	}

	#feedback-form .tr-3 {
		transition-delay: 3s;
		transition-duration: 250ms;
		transition-property: top;
		top: 9999px;
	}

	#feedback-form.show .tr-3 {
		top: 0;
	}

	#feedback-form .tr-4 {
		transition-delay: 3.5s;
		transition-duration: 250ms;
		transition-property: top;
		top: 9999px;
	}

	#feedback-form.show .tr-4 {
		top: 0;
	}
	.awesome-bg {
		visibility: hidden;
		z-index: 999;
		position: fixed;
		left: -99999px;
		top: 0;
		width: 100%;
		height: 100%;
		background: rgb(255,132,250);
		background: linear-gradient(50deg, rgba(255,132,250,0.9) 0%,
			rgba(108,133,230,0.9) 50%,
			rgba(0,212,255,0.9) 100%);
		transition-duration: 4s;
		transition-property: opacity;
		opacity: 0;
	}

	.awesome-bg.show {
		left: 0;
		opacity: 1;
		visibility: visible;
		transition-duration: 1000ms;
	}

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