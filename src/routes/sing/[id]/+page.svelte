<script lang="ts">
	import type { PageData } from "./$types";
	import EyeIcon from "./icons/eye.svg?raw";
	import EyeOffIcon from "./icons/eye-off.svg?raw";
	import { SUBTITLE_SAMPLES } from "./constants";
	import { processLine } from "./helpers";

	const PREVIOUS_VISIBLE_LINES = 2;
	const DEFAULT_LINE_HEIGHT = 24;
	const GAP_HEIGHT = 16; // The gap-4 class in Tailwind is 16px

	let { data } = $props<{ data: PageData }>();
	let { lyrics, difficulty, id } = $state(data);

	const songNumber = id.split("_")[1];
	const randomSubtitle = SUBTITLE_SAMPLES[Math.floor(Math.random() * SUBTITLE_SAMPLES.length)];

	// Split lyrics into lines, remove empty lines, and add unique id
	const lyricsLines = `${lyrics}\n`.split("\n").map((line: string, index: number) => {
		const trimmedLine = line.trim();

		return {
			id: `line-${index}`,
			text: trimmedLine,
			blurredText: processLine(trimmedLine, difficulty)
		};
	});

	let lastScrollPosition = $state(0);
	let currentLineIndex = $state(0);
	let isBlurred = $state(false);
	let containerRef: HTMLDivElement;
	let lineRefs: HTMLParagraphElement[] = $state([]);

	// Function to get the actual height of a line element
	const getLineHeight = (index: number = 0) => {
		// If line is empty (such as newlines), return the default line height
		if (!lineRefs[index]) {
			return DEFAULT_LINE_HEIGHT;
		}

		return lineRefs[index].offsetHeight;
	};

	// Function to calculate the scroll position for a given line index
	const calculateScrollPosition = (index: number) => {
		const firstVisibleLineIndex = index - PREVIOUS_VISIBLE_LINES - 1;

		if (firstVisibleLineIndex < 0) {
			return lastScrollPosition;
		}

		// Scroll past the first visible line + gap
		return lastScrollPosition + getLineHeight(firstVisibleLineIndex) + GAP_HEIGHT;
	};

	// Handle keyboard navigation
	const handleKeydown = (event: KeyboardEvent) => {
		if (event.code === "Space") {
			event.preventDefault();

			if (currentLineIndex < lyricsLines.length - 1) {
				// Increment the current index
				currentLineIndex++;
				lastScrollPosition = calculateScrollPosition(currentLineIndex);

				// Scroll to the next line
				if (containerRef) {
					containerRef.scrollTo({
						top: lastScrollPosition,
						behavior: "smooth"
					});
				}
			}
		}
	};

	// Reset function to go back to the beginning
	const resetLyrics = () => {
		currentLineIndex = 0;
		lastScrollPosition = 0;

		if (containerRef) {
			containerRef.scrollTo({
				top: 0,
				behavior: "smooth"
			});
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
				class="btn absolute right-16 top-2 gap-2"
				class:btn-outline={isBlurred}
				class:btn-ghost={!isBlurred}
				onclick={() => (isBlurred = !isBlurred)}
				title={isBlurred ? "Show lyrics" : "Hide lyrics"}
			>
				<span class="text-base">{isBlurred ? "Start Singing" : "Stop the song"}</span>
				<div class="h-6 w-6">
					{#if isBlurred}
						{@html EyeIcon}
					{:else}
						{@html EyeOffIcon}
					{/if}
				</div>
			</button>
		</div>
		<h1 class="min-h-max text-4xl font-bold">Secret song #{songNumber}</h1>
		<p class="mt-2 text-lg text-base-content/70">{randomSubtitle}</p>
		<div class="mt-8 w-11/12">
			<div
				class="relative cursor-pointer rounded-lg bg-base-300 p-8 shadow-lg transition-all duration-300"
				class:blur-md={isBlurred}
			>
				<div
					class="flex flex-col items-center gap-4 overflow-hidden"
					style="height: calc(100vh - 20rem);"
					bind:this={containerRef}
				>
					{#each lyricsLines as line, i (line.id)}
						{#if line.text}
							<p
								class="flex h-20 flex-wrap items-center justify-center text-nowrap transition-all duration-500"
								class:text-4xl={i === currentLineIndex}
								class:text-2xl={i !== currentLineIndex}
								class:opacity-100={i === currentLineIndex}
								class:opacity-50={i !== currentLineIndex}
								class:text-nowrap={i >= currentLineIndex}
								bind:this={lineRefs[i]}
							>
								{#if i >= currentLineIndex}
									{@html line.blurredText}
								{:else}
									{line.text}
								{/if}
							</p>
						{:else}
							<div class="flex h-20 items-center justify-center">&nbsp;</div>
						{/if}
					{/each}
				</div>
			</div>
			{#if !isBlurred}
				<div class="mt-8 flex w-full items-center justify-center gap-4">
					<p class="text-lg font-semibold">Press space to advance lyrics</p>
					<button
						class="btn btn-outline btn-error btn-sm"
						onclick={resetLyrics}
						title="Reset to beginning"
					>
						Reset
					</button>
				</div>
			{/if}
		</div>
	</div>
</div>
