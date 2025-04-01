<script lang="ts">
	import { DEFAULT_LYRICS, DIFFICULTIES, DIFFICULTY_TO_COLOR_CLASS } from "./constants";
	import type { Difficulty, DifficultyModifier } from "./types";

	let lyrics = $state(DEFAULT_LYRICS.trim());
	let difficulty: DifficultyModifier = $state(DIFFICULTIES.medium);

	const onButtonClick = (newDifficulty: Difficulty) => (difficulty = DIFFICULTIES[newDifficulty]);
</script>

<div class="flex min-h-screen bg-base-200 px-10 pb-4 pt-8 text-center">
	<form class="flex w-full" method="POST">
		<input type="hidden" name="lyrics" value={lyrics} />
		<input type="hidden" name="difficulty" value={difficulty.type} />
		<div class="flex w-1/2 flex-col items-center">
			<h1 class="min-h-max text-4xl font-bold">1. Paste your lyrics</h1>
			<textarea
				bind:value={lyrics}
				class="textarea textarea-accent my-6 w-3/4 flex-1"
				placeholder="Add lyrics here..."
				required
			></textarea>
		</div>
		<div class="flex w-1/2 flex-col justify-evenly">
			<div class="flex flex-col gap-6">
				<h1 class="min-h-max text-4xl font-bold">2. Select difficulty</h1>
				<div class="flex flex-row justify-center gap-4">
					{#each Object.values(DIFFICULTIES) as { type, label }}
						<button
							class={`btn btn-outline btn-${DIFFICULTY_TO_COLOR_CLASS[type]}`}
							class:btn-active={difficulty.type === type}
							type="button"
							onclick={() => onButtonClick(type)}>{label}</button
						>
					{/each}
				</div>
			</div>
			<div class="flex flex-col gap-6">
				<h1 class="min-h-max text-4xl font-bold">3. Start singing!</h1>
				<div>
					<button class="btn btn-primary px-8" type="submit">Start</button>
				</div>
			</div>
		</div>
	</form>
</div>
