interface LyricsEntry {
	id: string;
	content: string;
	difficulty: string;
	created_at: Date;
}

class MockDB {
	private lyrics: Map<string, LyricsEntry> = new Map();
	private counter = 0;

	async createLyrics(content: string, difficulty: string): Promise<string> {
		const id = `lyrics_${this.counter++}`;
		const entry: LyricsEntry = {
			id,
			content,
			difficulty,
			created_at: new Date()
		};
		this.lyrics.set(id, entry);
		return id;
	}

	async getLyrics(id: string): Promise<LyricsEntry | undefined> {
		return this.lyrics.get(id);
	}
}

// Create a singleton instance
const db = new MockDB();

export async function createLyrics(content: string, difficulty: string): Promise<string> {
	return db.createLyrics(content, difficulty);
}

export async function getLyrics(id: string): Promise<LyricsEntry | undefined> {
	return db.getLyrics(id);
}
