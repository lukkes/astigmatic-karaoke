export const SONG_DIFFICULTIES = ["easy", "medium", "hard", "blind"] as const;

export type SongDifficulty = (typeof SONG_DIFFICULTIES)[number];

export type Song = {
	id: string;
	created_at: Date;
	lyrics: string;
	difficulty: SongDifficulty;
};
