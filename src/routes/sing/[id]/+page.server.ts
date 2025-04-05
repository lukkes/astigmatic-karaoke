import { error } from "@sveltejs/kit";
import { getSong } from "$lib/server/db";
import type { Song } from "$lib/types/song";
import type { PageServerLoad } from "./$types";

export type PageData = Song;

export const load: PageServerLoad = async ({ params }) => {
	const song = await getSong(params.id);

	if (!song) {
		throw error(404, "Song not found");
	}

	return song;
};
