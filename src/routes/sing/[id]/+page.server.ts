import type { Difficulty } from "../../components/SetupLyrics/types";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getLyrics } from "$lib/server/db";

export type PageData = {
	lyrics: string;
	difficulty: Difficulty;
};

export const load: PageServerLoad = async ({ params }) => {
	const entry = await getLyrics(params.id);

	if (!entry) {
		throw error(404, "Lyrics not found");
	}

	return {
		lyrics: entry.content,
		difficulty: entry.difficulty as Difficulty
	};
};
