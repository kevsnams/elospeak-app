<script>
	import moment from 'moment';
	import axios from 'axios';
    import _ from 'underscore';
    import jstz from 'jstimezonedetect';
	import {
		ArrowLeftIcon,
		ClockIcon
	} from 'svelte-feather-icons';

	import Board from './board/Board.svelte';
	import SideBar from './board/SideBar.svelte';

	let Classroom, feedbackField, feedbackSubmit, feedbackFormSubmitted = false;
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

    const classFetcher = axios.post('./board/classroom');

    const clientOffset = jstz.determine().offsets[0] * 60;
    const phOffset = (60 * 60) * 8;
    const totalOffset = clientOffset - phOffset;

    const now = moment(ELOSpeak.ServerTime).add(clientOffset, 'seconds');

    let timeRemaining = [], countdown = [], showFeedbackForm = false, showBoard = false;

	classFetcher.then((r) => {
		Classroom = r.data.Classroom;

        const start = moment(Classroom.raw_start).add(totalOffset, 'seconds');
        const end = moment(Classroom.raw_end).add(totalOffset, 'seconds');

        const isStudent = r.data.Users.Current.user_type === 'student';
        const isTeacher = r.data.Users.Current.user_type === 'teacher';

        if (isTeacher) {
            showBoard = true;
        }

        const ct = setInterval(() => {
            now.add(1, 'seconds');
            countdown = display(start.diff(now, 'seconds'));

            if (isTeacher) {
                timeRemaining = countdown;
            }

            if (now.isSameOrAfter(start)) {
                clearInterval(ct);
                timeRemaining = ['START', 'NOW'];

                if (isStudent) {
                    showBoard = true;
                }

                countdown = [];
                startTimer();
            }
        }, 1000);
    });

    function startTimer()
    {
        const start = moment(Classroom.raw_start).add(totalOffset, 'seconds');
        const end = moment(Classroom.raw_end).add(totalOffset, 'seconds');

        const timer = setInterval(() => {
            now.add(1, 'seconds');

            timeRemaining = display(end.diff(now, 'seconds'));

            if (now.isSameOrAfter(end)) {
                clearInterval(timer);
                showBoard = false;
                showFeedbackForm = true;

                axios.post('./board/close', {
                    id: Classroom.id
                });
            }
        }, 1000);
    }

    function display(seconds)
    {
        const format = val => `0${Math.floor(val)}`.slice(-2)
        const hours = seconds / 3600
        const minutes = (seconds % 3600) / 60

        return [hours, minutes, seconds % 60]
            .map(t => Math.floor(Math.abs(t)))
            .filter((t, i, a) => {
                if (a.length >= 3 && i === 0) {
                    return t > 0;
                }

                return true;
            })
            .map(format);
    }
</script>

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

{#await classFetcher}
	<div class="d-flex justify-content-center align-items-center whole-page">
		<div class="text-center">
			<div class="spinner-border" style="width: 3rem; height: 3rem;" role="status">
				<span class="sr-only">Loading...</span>
			</div>
			<h1>Retrieving classroom information...</h1>
		</div>
	</div>
{:then response}
    {#if showBoard}
        <div class="container-fluid" class:invisible={!showBoard}>
            <div class="row no-gutters">
                <div class="col-2">
                    <SideBar Classroom={response.data.Classroom} UserCurrent={response.data.Users.Current} UserOther={response.data.Users.Other}  />
                </div>
                <div class="col-10">
                    <Board Classroom={response.data.Classroom} UserCurrent={response.data.Users.Current} showToolbox={response.data.Users.Current.user_type == 'teacher'} />
                </div>
            </div>
        </div>
    {:else}
        <div class="d-flex mt-4" class:invisible={countdown.length <= 0}>
            <div class="class-countdown mx-auto w-auto">
                <h1 class="display-5">The class will start in {countdown.join(':')}</h1>
            </div>
        </div>
    {/if}
{:catch}
	<div class="d-flex justify-content-center align-items-center whole-page">
		<div style="margin-top: -5rem;">
			<h1>No Class Available</h1>
		</div>
	</div>
{/await}

<style>
    .class-countdown {
        background: #fff;
        border-radius: .375rem;
        padding: 10px;
    }

	.whole-page {
		position: absolute;
		width: 100%;
		height: 100%;
	}

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
