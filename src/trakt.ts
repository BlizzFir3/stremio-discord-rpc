export interface MediaState {
    title: string;
    streamName: string;
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
            // L'API Trakt nécessite des headers spécifiques pour fonctionner
            const response = await fetch(`https://api.trakt.tv/users/${this.username}/watching`, {
                headers: {
                    'Content-Type': 'application/json',
                    'trakt-api-version': '2',
                    'trakt-api-key': this.clientId
                }
            });

            // Code 204 = L'utilisateur ne regarde rien actuellement
            if (response.status === 204) {
                return null;
            }

            if (!response.ok) {
                console.error(`[Trakt] Erreur API : Code ${response.status}`);
                return null;
            }

            const data = await response.json();

            // Formatage propre selon que ce soit une série ou un film
            if (data.type === 'episode' && data.episode && data.show) {
                // Formate la saison et l'épisode (ex: S01E04)
                const season = data.episode.season.toString().padStart(2, '0');
                const ep = data.episode.number.toString().padStart(2, '0');

                return {
                    title: data.show.title, // Le nom de la série
                    streamName: `S${season}E${ep} - ${data.episode.title}` // L'épisode
                };
            } else if (data.type === 'movie' && data.movie) {
                return {
                    title: data.movie.title,
                    streamName: data.movie.year ? `(${data.movie.year})` : 'Film'
                };
            }

            return null;
        } catch (error) {
            console.error('[Trakt] Erreur réseau lors du polling.');
            return null;
        }
    }
}