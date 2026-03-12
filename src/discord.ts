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
            console.log(`[Discord] Connected as ${this.client.user?.username}`);
        });
    }

    public async connect(): Promise<void> {
        try {
            await this.client.login({ clientId: this.clientId });
        } catch (error) {
            console.error('[Discord] IPC connection error:', error);
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
                details: `Watching: ${title}`,
                state: state,
                instance: false,
            };

            // Time management
            if (startTimestamp) activity.startTimestamp = startTimestamp;
            if (endTimestamp) activity.endTimestamp = endTimestamp;

            // Image management (external URL or fallback)
            if (imageUrl) {
                activity.largeImageKey = imageUrl;
                activity.largeImageText = title;
            } else {
                // Default image if Trakt doesn't return an ID
                activity.largeImageKey = 'stremio_logo';
                activity.largeImageText = 'Stremio';
            }

            await this.client.setActivity(activity);
            console.log(`[Discord RPC] Status successfully updated.`);
        } catch (error) {
            console.error('[Discord] Error updating presence:', error);
        }
    }

    public async clearPresence(): Promise<void> {
        if (!this.isConnected) return;
        await this.client.clearActivity();
    }
}