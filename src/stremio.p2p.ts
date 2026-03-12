export interface StremioState {
    title: string;
    streamName: string;
}

export class StremioClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    public async getCurrentPlaying(): Promise<StremioState | null> {
        try {
            // L'endpoint exact reste à vérifier selon ton instance
            const response = await fetch(`${this.baseUrl}/stats.json`);

            if (!response.ok) {
                return null;
            }

            const data = await response.json();

            // Adaptation de la logique métier basée sur la structure JSON de Stremio
            if (data && data.streamName) {
                return {
                    title: data.meta?.name || 'Film/Série',
                    streamName: data.streamName
                };
            }

            return null;
        } catch (error) {
            // On ignore l'erreur silencieusement si Stremio est juste fermé
            return null;
        }
    }
}