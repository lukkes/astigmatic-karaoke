<script lang="ts">
	import "../app.css";
	let { children } = $props();
</script>

<div class="min-h-screen w-full">
	{@render children()}
</div>
