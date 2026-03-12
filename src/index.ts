import 'dotenv/config';
import { DiscordManager } from './discord';
import { TraktClient } from './trakt';

const POLLING_INTERVAL_MS = 15000;

async function bootstrap() {
    const discordClientId = process.env.DISCORD_CLIENT_ID;
    const traktClientId = process.env.TRAKT_CLIENT_ID;
    const traktUsername = process.env.TRAKT_USERNAME;

    if (!discordClientId || !traktClientId || !traktUsername) {
        console.error('Erreur critique : Variables manquantes dans le .env');
        process.exit(1);
    }

    const discord = new DiscordManager(discordClientId);
    const trakt = new TraktClient(traktUsername, traktClientId);

    console.log('Démarrage du daemon Trakt-Discord RPC...');
    await discord.connect();

    let currentStream = "";

    setInterval(async () => {
        const playing = await trakt.getCurrentPlaying();

        if (playing) {
            // Anti-spam : on ne push que si l'épisode ou le film a changé
            if (playing.streamName !== currentStream) {
                console.log(`[Lecture] ${playing.title} | ${playing.streamName}`);
                currentStream = playing.streamName;

                // Construction de l'URL de l'affiche via le CDN public de Stremio
                const posterUrl = playing.imdbId
                    ? `https://images.metahub.space/poster/medium/${playing.imdbId}/img`
                    : undefined;

                await discord.setPresence(
                    playing.title,
                    playing.streamName,
                    playing.startTime,
                    playing.endTime,
                    posterUrl
                );
            }
        } else {
            if (currentStream !== "") {
                console.log(`[Arrêt] Nettoyage de Discord.`);
                await discord.clearPresence();
                currentStream = "";
            }
        }
    }, POLLING_INTERVAL_MS);
}

bootstrap().catch(console.error);