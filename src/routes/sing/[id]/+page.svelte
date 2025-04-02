<script lang="ts">
	import type { PageData } from "./$types";
	import EyeIcon from "./icons/eye.svg?raw";
	import EyeOffIcon from "./icons/eye-off.svg?raw";
	import { SUBTITLE_SAMPLES } from "./constants";
	import { processLine } from "./helpers";

	let { data } = $props<{ data: PageData }>();
	let { lyrics, difficulty, id } = $state(data);

	const songNumber = id.split("_")[1];
	const randomSubtitle = SUBTITLE_SAMPLES[Math.floor(Math.random() * SUBTITLE_SAMPLES.length)];
	let isBlurred = $state(false);

	// Split lyrics into lines, remove empty lines, and add index
	const lyricsLines = `${lyrics}\n`
		.split("\n")
		.filter((line: string) => line.trim())
		.map((line: string, index: number) => ({
			id: `line-${index}`,
			text: line.trim(),
			blurredText: processLine(line.trim(), difficulty)
		}));

	let currentLineIndex = $state(0);
	let containerRef: HTMLDivElement;
	let lineRefs: HTMLParagraphElement[] = $state([]);

	// Function to get the actual height of a line element
	const getLineHeight = (index: number = 0) => {
		if (lineRefs.length > 0 && lineRefs[index]) {
			return lineRefs[index].offsetHeight;
		}
		return 40; // Fallback height if elements aren't rendered yet
	};

	// Function to calculate the scroll position for a given line index
	const calculateScrollPosition = (index: number) => {
		const lineHeight = getLineHeight(index);
		const gapHeight = 16; // The gap-4 class in Tailwind is 16px

		// Scroll to the line above the current line
		return (index - 3) * (lineHeight + gapHeight);
	};

	// Handle keyboard navigation
	const handleKeydown = (event: KeyboardEvent) => {
		if (event.code === "Space") {
			event.preventDefault();

			if (currentLineIndex < lyricsLines.length - 1) {
				// Increment the current index
				currentLineIndex++;

				// Scroll to the next line
				if (containerRef) {
					containerRef.scrollTo({
						top: calculateScrollPosition(currentLineIndex),
						behavior: "smooth"
					});
				}
			}
		}
	};

	// Add and remove event listener
	$effect(() => {
		window.addEventListener("keydown", handleKeydown);
		return () => {
			window.removeEventListener("keydown", handleKeydown);
		};
	});
</script>

<div class="flex min-h-screen bg-base-200 px-10 pb-4 pt-8 text-center">
	<div class="flex w-full flex-col items-center">
		<div class="relative w-full">
			<button
				class="btn btn-circle btn-ghost absolute right-0 top-0"
				onclick={() => (isBlurred = !isBlurred)}
				title={isBlurred ? "Show lyrics" : "Hide lyrics"}
			>
				{#if isBlurred}
					{@html EyeIcon}
				{:else}
					{@html EyeOffIcon}
				{/if}
			</button>
		</div>
		<h1 class="min-h-max text-4xl font-bold">Secret song #{songNumber}</h1>
		<p class="mt-2 text-lg text-base-content/70">{randomSubtitle}</p>
		<div class="mt-8 w-3/4">
			<div
				class="relative cursor-pointer rounded-lg bg-base-100 p-8 shadow-lg transition-all duration-300"
				class:blur-md={isBlurred}
			>
				<div
					class="flex h-[284px] flex-col items-center gap-4 overflow-hidden"
					bind:this={containerRef}
				>
					{#each lyricsLines as line, i (line.id)}
						<p
							class="flex h-20 flex-wrap items-center justify-center transition-all duration-500"
							class:text-4xl={i === currentLineIndex}
							class:text-2xl={i !== currentLineIndex}
							class:opacity-100={i === currentLineIndex}
							class:opacity-50={i !== currentLineIndex}
							bind:this={lineRefs[i]}
						>
							{#if i >= currentLineIndex}
								{@html line.blurredText}
							{:else}
								{line.text}
							{/if}
						</p>
					{/each}
				</div>
			</div>
			{#if !isBlurred}
				<div class="flex h-full w-full items-center justify-center">
					<p class="text-lg font-semibold">Press space to advance lyrics</p>
				</div>
			{/if}
		</div>
	</div>
</div>
