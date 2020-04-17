<div class="text-center mt-5 mb-5 glowing-spinner">
    <div class="spinner-border">
        <span class="sr-only">Loading...</span>
    </div>
</div>

<style>
.glowing-spinner {
    animation-duration: .5s;
    animation-name: glowing;
    animation-direction: alternate;
    animation-iteration-count: infinite;
}

.glowing-spinner .spinner-border {
    width: 3rem;
    height: 3rem;
    border-width: .5rem;
}

@keyframes glowing {
	from {
		color: #fc719f;
	}

	to {
		color: #92c2fd;
	}
}
</style>