<script lang="ts">
	import { DIFFICULTY_MODIFIERS, DIFFICULTY_TO_COLOR_CLASS } from "$lib/constants/difficulty";
	import type { DifficultyModifier } from "$lib/types/difficulty";
	import type { SongDifficulty } from "$lib/types/difficulty";
	import { DEFAULT_LYRICS } from "./constants";

	let lyrics = $state(DEFAULT_LYRICS.trim());
	let difficulty: DifficultyModifier = $state(DIFFICULTY_MODIFIERS.medium);

	const onClickDifficulty = (newDifficulty: SongDifficulty) =>
		(difficulty = DIFFICULTY_MODIFIERS[newDifficulty]);
</script>

<div class="flex min-h-screen bg-base-200 px-10 pb-4 pt-8 text-center" data-testid="setup-lyrics">
	<form class="flex w-full" method="POST" data-testid="setup-lyrics-form">
		<input type="hidden" name="lyrics" value={lyrics} />
		<input type="hidden" name="difficulty" value={difficulty.type} />
		<div class="flex w-1/2 flex-col items-center">
			<h1 class="min-h-max text-4xl font-bold" data-testid="lyrics-heading">
				1. Paste your lyrics
			</h1>
			<textarea
				bind:value={lyrics}
				class="textarea textarea-accent my-6 w-3/4 flex-1"
				placeholder="Add lyrics here..."
				required
				data-testid="lyrics-textarea"
			></textarea>
		</div>
		<div class="flex w-1/2 flex-col justify-evenly">
			<div class="flex flex-col gap-6">
				<h1 class="min-h-max text-4xl font-bold" data-testid="difficulty-heading">
					2. Select difficulty
				</h1>
				<div class="flex flex-row justify-center gap-4" data-testid="difficulty-buttons">
					{#each Object.values(DIFFICULTY_MODIFIERS) as { type, label }}
						<button
							class={`btn btn-outline btn-${DIFFICULTY_TO_COLOR_CLASS[type]}`}
							class:btn-active={difficulty.type === type}
							type="button"
							onclick={() => onClickDifficulty(type)}
							data-testid={`difficulty-button-${type}`}>{label}</button
						>
					{/each}
				</div>
			</div>
			<div class="flex flex-col gap-6">
				<h1 class="min-h-max text-4xl font-bold" data-testid="start-heading">3. Start singing!</h1>
				<div>
					<button class="btn btn-primary px-8" type="submit" data-testid="start-button"
						>Start</button
					>
				</div>
			</div>
		</div>
	</form>
</div>
