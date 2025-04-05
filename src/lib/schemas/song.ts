import { z } from "zod";
import { SONG_DIFFICULTIES } from "$lib/constants/difficulty";

export const difficultyEnum = z.enum(SONG_DIFFICULTIES);

export const newSongSchema = z.object({
	lyrics: z.string().min(1, "Lyrics are required"),
	difficulty: difficultyEnum
});

export type NewSong = z.infer<typeof newSongSchema>;

// Helper function to validate song creation data
export function validateNewSong(data: unknown): NewSong {
	return newSongSchema.parse(data);
}
