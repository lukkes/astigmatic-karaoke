<script lang="ts">
	import type { PageData } from "./$types";
	import type { Difficulty } from "../components/SetupLyrics/types";

	let { data } = $props<{ data: PageData }>();
	let { lyrics, difficulty } = $state(data);

	console.log("Lyrics", lyrics);
	console.log("Difficulty", difficulty);
</script>

<div class="flex min-h-screen bg-base-200 px-10 pb-4 pt-8 text-center">
	<div class="flex w-full flex-col items-center">
		<h1 class="min-h-max text-4xl font-bold">Sing along!</h1>
		<div class="mt-8 w-3/4">
			<p class="whitespace-pre-line text-lg">{lyrics}</p>
		</div>
	</div>
</div>
