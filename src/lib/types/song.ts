import type { SongDifficulty } from "./difficulty";

export type Song = {
	id: string;
	created_at: Date;
	lyrics: string;
	difficulty: SongDifficulty;
};
