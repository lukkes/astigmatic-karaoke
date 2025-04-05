import { DIFFICULTY_MODIFIERS } from "$lib/constants/difficulty";
import type { SongDifficulty } from "$lib/types/difficulty";

// Function to randomly blur words in a line
export const processLine = (line: string, difficulty: SongDifficulty) => {
	if (!line) return "";

	// Get the blur ratio based on difficulty
	const blurRatio = DIFFICULTY_MODIFIERS[difficulty].blurRatio;

	// Split the line into words
	const words = line.split(/\s+/);

	// Calculate how many words to blur based on the ratio
	const numWordsToBlur = Math.max(1, Math.floor(words.length * blurRatio));

	// Create a copy of the words array to avoid modifying the original
	const processedWords = [...words];

	// Randomly select words to blur
	for (let i = 0; i < numWordsToBlur; i++) {
		// Find a word that hasn't been blurred yet
		const availableIndices = processedWords
			.map((word, index) => ({ word, index }))
			.filter((item) => !item.word.startsWith("<span"))
			.map((item) => item.index);

		if (availableIndices.length === 0) break;

		// Pick a random index from available ones
		const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];

		// Replace the word with a blurred version
		const originalWord = processedWords[randomIndex];
		processedWords[randomIndex] = `<span class="blur-[8px] mx-2">${originalWord}</span>`;
	}

	// Join the words back together
	return processedWords.join(" ");
};
