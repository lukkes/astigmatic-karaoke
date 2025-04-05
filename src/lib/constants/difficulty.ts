import type { DifficultyModifier, SongDifficulty } from "$lib/types/difficulty";

export const SONG_DIFFICULTIES = [
	"easy",
	"medium",
	"hard",
	"blind"
] as const satisfies SongDifficulty[];

export const DIFFICULTY_MODIFIERS: Record<SongDifficulty, DifficultyModifier> = {
	easy: {
		type: "easy",
		label: "Easy",
		blurRatio: 0.1 // 10% of words will be blurred
	},
	medium: {
		type: "medium",
		label: "Medium",
		blurRatio: 0.3 // 30% of words will be blurred
	},
	hard: {
		type: "hard",
		label: "Hard",
		blurRatio: 0.5 // 50% of words will be blurred
	},
	blind: {
		type: "blind",
		label: "Blind",
		blurRatio: 0.8 // 80% of words will be blurred
	}
};

export const DIFFICULTY_TO_COLOR_CLASS: Record<SongDifficulty, string> = {
	easy: "success",
	medium: "warning",
	hard: "error",
	blind: "error"
};
