import type { Difficulty } from "./components/SetupLyrics/types";
import { error, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { createLyrics } from "$lib/server/db";

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const lyrics = formData.get("lyrics")?.toString();
		const difficulty = formData.get("difficulty")?.toString() as Difficulty;

		if (!lyrics || !difficulty) {
			throw error(400, "Missing required parameters");
		}

		// Validate difficulty
		const validDifficulties = ["easy", "medium", "hard"];
		if (!validDifficulties.includes(difficulty)) {
			throw error(400, "Invalid difficulty level");
		}

		const id = await createLyrics(lyrics, difficulty);
		throw redirect(303, `/sing/${id}`);
	}
} satisfies Actions;
