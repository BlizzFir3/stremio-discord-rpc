import { Client } from 'discord-rpc';

export class DiscordManager {
    private client: Client;
    private clientId: string;
    private isConnected: boolean = false;

    constructor(clientId: string) {
        this.clientId = clientId;
        // On spécifie le transport 'ipc' pour communiquer avec le client lourd Discord
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

    public async setPresence(title: string, state: string): Promise<void> {
        if (!this.isConnected) return;

        try {
            await this.client.setActivity({
                details: `Regarde : ${title}`,
                state: state,
                largeImageKey: 'stremio_logo', // À configurer sur le portail dev Discord
                largeImageText: 'Stremio',
                instance: false,
            });
        } catch (error) {
            console.error('[Discord] Erreur lors de la mise à jour de la présence:', error);
        }
    }

    public async clearPresence(): Promise<void> {
        if (!this.isConnected) return;
        await this.client.clearActivity();
    }
}