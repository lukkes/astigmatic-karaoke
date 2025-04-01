import { error, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { createSong } from "$lib/server/db";
import { newSongSchema } from "$lib/schemas/song";
import { ZodError } from "zod";

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		let validatedData;

		try {
			validatedData = newSongSchema.parse({
				lyrics: formData.get("lyrics"),
				difficulty: formData.get("difficulty")
			});
		} catch (e) {
			if (e instanceof ZodError) {
				const errors = e.errors.map((err) => `${err.path}: ${err.message}`).join(", ");
				throw error(400, `Invalid form data: ${errors}`);
			}
			throw error(500, "Something went wrong");
		}

		const id = await createSong(validatedData);
		throw redirect(303, `/sing/${id}`);
	}
} satisfies Actions;
