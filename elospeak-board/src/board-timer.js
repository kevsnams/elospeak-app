// Adds leading zero
function lz(n)
{
    return n < 10 ? '0'+ n : n;
}

onmessage = (e) => {
    const dStart = new Date(e.data.start),
        dEnd = new Date(e.data.end);
    
    let timer = setInterval(() => {
        const now = new Date();
        if (now < dStart) {
            postMessage({
                type: 'NOT_STARTED'
            });

            return;
        }

        if (now > dEnd) {
            postMessage({
                type: 'HAS_ENDED'
            });

            return;
        }

        if (now >= dStart && now <= dEnd) {
            const sEnd = +dEnd / 1000,
                sCurNow = (+now) / 1000;

            let sRemaining = Math.floor(sEnd - sCurNow);

            const hours = Math.floor(sRemaining / 3600);
            sRemaining %= 3600;

            const minutes = Math.floor(sRemaining / 60),
            seconds = sRemaining % 60;
    
            postMessage({
                type: 'HAS_STARTED',
                ftime: [
                    lz(hours),
                    lz(minutes),
                    lz(seconds)
                ]
            });

            if (hours <= 0 && minutes <= 0 &&  seconds <= 0) {
                
            }
        }
    }, 1000);
};