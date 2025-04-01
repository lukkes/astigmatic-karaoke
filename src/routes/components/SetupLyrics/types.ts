import type { SongDifficulty } from "$lib/types/records";

export type DifficultyModifier = {
	type: SongDifficulty;
	label: string;
	blurPercentage: number;
};
