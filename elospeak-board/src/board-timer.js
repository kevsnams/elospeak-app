import moment from 'moment';
import { current_component } from 'svelte/internal';

onmessage = (e) => {
    const start = e.data.start,
          end = e.data.end,
          mStart = moment(start),
          mEnd = moment(end),
          duration = mEnd.diff(mStart, 'seconds'),
          userType = e.data.currentUserType;

    console.log(duration);

    if (userType == 'student' && mStart > new Date()) {
        postMessage(2);
    } else if (userType == 'teacher' && mStart > new Date()) {
        postMessage(3);
    } else {
        let timer = setInterval(() => {
            let remaining = duration + mStart.diff(new Date(), 'seconds'),
                secRemaining = parseInt(remaining);

            const hours = Math.floor(remaining / 3600);
            remaining %= 3600;

            const minutes = Math.floor(remaining / 60),
                seconds = remaining % 60;

            let fTime = [];

            if (hours > 0) {
                fTime.push(hours < 10 ? '0'+ hours : hours);
            }

            fTime.push(minutes < 10 ? '0'+ minutes : minutes);
            fTime.push(seconds < 10 ? '0'+ seconds : seconds);

            if (hours >= 0 || minutes >= 0 || seconds >= 0) {
                postMessage(fTime);
            }

            if (secRemaining <= 0) {
                clearInterval(timer);
                postMessage(1);
            }
        }, 1000);
    }
};