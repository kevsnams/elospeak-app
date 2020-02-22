<script>
    export let status = null;
    
    let className = '',
        label = '';
    if (status == 2) {
        className = 'badge-done';
        label = 'DONE'
    } else if (status == 1) {
        className = 'badge-active';
        label = 'ACTIVE';
    } else if (status == 0) {
        className = 'badge-inactive';
        label = 'UNPAID';
    } else if (status == 3) {
        className = 'badge-cancelled';
        label = 'CANCELLED';
    }
</script>

<span class="badge badge-pill {className}">{label}</span>

<style>
.badge-done {
    background-color: #ccf6e4;
    color: #00864e;
}

.badge-active {
    background-color: #d4f2ff;
    color: #1978a2;
}

.badge-inactive {
    background-color: #e3e6ea;
    color: #7d899b;
}

.badge-cancelled {
    background-color: #fde6d8;
    color: #c46632;
}
</style>