<script>
    export let server;

    import jstz from 'jstimezonedetect';
    import moment from 'moment';

    const timezone = jstz.determine().name();
    const clientOffset = jstz.determine().offsets[0];
    const serverTime = moment(server).add(clientOffset, 'minutes');

    let displayTime = '';

    setInterval(() => {
        displayTime = serverTime.add(1, 's').format('Do MMM YYYY — hh : mm : ss A');
    }, 1000);
</script>

<strong class="d-inline">
    { timezone }
</strong>
<span class="d-block">
    { displayTime }
</span>
