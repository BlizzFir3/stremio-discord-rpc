import { Client } from 'discord-rpc';

export class DiscordManager {
    private client: Client;
    private clientId: string;
    private isConnected: boolean = false;

    constructor(clientId: string) {
        this.clientId = clientId;
        this.client = new Client({ transport: 'ipc' });

        this.client.on('ready', () => {
            this.isConnected = true;
            console.log(`[Discord] Connecté en tant que ${this.client.user?.username}`);
        });
    }

    public async connect(): Promise<void> {
        try {
            await this.client.login({ clientId: this.clientId });
        } catch (error) {
            console.error('[Discord] Erreur de connexion IPC:', error);
        }
    }

    public async setPresence(
        title: string,
        state: string,
        startTimestamp?: Date,
        endTimestamp?: Date,
        imageUrl?: string
    ): Promise<void> {
        if (!this.isConnected) return;

        try {
            const activity: any = {
                details: `Regarde : ${title}`,
                state: state,
                instance: false,
            };

            // Gestion du temps
            if (startTimestamp) activity.startTimestamp = startTimestamp;
            if (endTimestamp) activity.endTimestamp = endTimestamp;

            // Gestion de l'image (URL externe ou fallback)
            if (imageUrl) {
                activity.largeImageKey = imageUrl;
                activity.largeImageText = title;
            } else {
                // Image par défaut si Trakt ne renvoie pas d'ID
                activity.largeImageKey = 'stremio_logo';
                activity.largeImageText = 'Stremio';
            }

            await this.client.setActivity(activity);
            console.log(`[Discord RPC] Statut mis à jour avec succès.`);
        } catch (error) {
            console.error('[Discord] Erreur lors de la mise à jour de la présence:', error);
        }
    }

    public async clearPresence(): Promise<void> {
        if (!this.isConnected) return;
        await this.client.clearActivity();
    }
}