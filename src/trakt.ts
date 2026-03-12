export interface MediaState {
    title: string;
    streamName: string;
    imdbId?: string;
    startTime?: Date;
    endTime?: Date;
}

export class TraktClient {
    private username: string;
    private clientId: string;

    constructor(username: string, clientId: string) {
        this.username = username;
        this.clientId = clientId;
    }

    public async getCurrentPlaying(): Promise<MediaState | null> {
        try {
            const response = await fetch(`https://api.trakt.tv/users/${this.username}/watching`, {
                headers: {
                    'Content-Type': 'application/json',
                    'trakt-api-version': '2',
                    'trakt-api-key': this.clientId
                }
            });

            if (response.status === 204) return null;
            if (!response.ok) return null;

            const data = await response.json();

            // Extract timestamps from Trakt
            const startTime = data.started_at ? new Date(data.started_at) : undefined;
            const endTime = data.expires_at ? new Date(data.expires_at) : undefined;

            if (data.type === 'episode' && data.episode && data.show) {
                const season = data.episode.season.toString().padStart(2, '0');
                const ep = data.episode.number.toString().padStart(2, '0');

                return {
                    title: data.show.title,
                    streamName: `S${season}E${ep} - ${data.episode.title}`,
                    imdbId: data.show.ids?.imdb, // Show ID
                    startTime,
                    endTime
                };
            } else if (data.type === 'movie' && data.movie) {
                return {
                    title: data.movie.title,
                    streamName: data.movie.year ? `(${data.movie.year})` : 'Movie',
                    imdbId: data.movie.ids?.imdb, // Movie ID
                    startTime,
                    endTime
                };
            }

            return null;
        } catch (error) {
            console.error('[Trakt] Network error during polling.');
            return null;
        }
    }
}