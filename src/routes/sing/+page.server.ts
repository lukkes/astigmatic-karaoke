import type { Difficulty } from "../components/SetupLyrics/types";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export type PageData = {
	lyrics: string;
	difficulty: Difficulty;
};

export const load: PageServerLoad = ({ url }) => {
	const lyrics = url.searchParams.get("lyrics");
	const difficulty = url.searchParams.get("difficulty") as Difficulty;

	if (!lyrics || !difficulty) {
		throw error(400, "Missing required parameters");
	}

	// Validate difficulty
	const validDifficulties = ["easy", "medium", "hard"];
	if (!validDifficulties.includes(difficulty)) {
		throw error(400, "Invalid difficulty level");
	}

	return {
		lyrics,
		difficulty
	};
};
