export type SongDifficulty = "easy" | "medium" | "hard" | "blind";

export interface DifficultyModifier {
	type: SongDifficulty;
	label: string;
	blurRatio: number;
}
