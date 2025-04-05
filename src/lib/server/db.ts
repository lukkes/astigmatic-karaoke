import type { Song } from "$lib/types/song";
import type { NewSong } from "$lib/schemas/song";

class MockDB {
	private songs: Map<string, Song> = new Map();
	private counter = 1;

	async createSong(data: NewSong): Promise<string> {
		const id = `song_${this.counter++}`;
		const song: Song = {
			id,
			lyrics: data.lyrics,
			difficulty: data.difficulty,
			created_at: new Date()
		};
		this.songs.set(id, song);
		return id;
	}

	async getSong(id: string): Promise<Song | undefined> {
		return this.songs.get(id);
	}
}

// Create a singleton instance
const db = new MockDB();

export async function createSong(data: NewSong): Promise<string> {
	return db.createSong(data);
}

export async function getSong(id: string): Promise<Song | undefined> {
	return db.getSong(id);
}
