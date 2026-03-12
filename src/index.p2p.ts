import 'dotenv/config'; // Charge automatiquement le .env
import { DiscordManager } from './discord';
import { StremioClient } from './stremio.p2p';

const POLLING_INTERVAL_MS = 15000;

async function bootstrap() {
    const clientId = process.env.DISCORD_CLIENT_ID;
    const stremioUrl = process.env.STREMIO_API_URL || 'http://127.0.0.1:11470';

    if (!clientId) {
        console.error('Erreur critique : DISCORD_CLIENT_ID est manquant dans le .env');
        process.exit(1);
    }

    const discord = new DiscordManager(clientId);
    const stremio = new StremioClient(stremioUrl);

    console.log('Démarrage du daemon Stremio-Discord RPC...');
    await discord.connect();

    let wasPlaying = false;

    setInterval(async () => {
        const playing = await stremio.getCurrentPlaying();

        if (playing) {
            await discord.setPresence(playing.title, playing.streamName);
            wasPlaying = true;
        } else if (wasPlaying) {
            // Si la lecture s'arrête, on nettoie le statut Discord
            await discord.clearPresence();
            wasPlaying = false;
        }
    }, POLLING_INTERVAL_MS);
}

bootstrap().catch(console.error);