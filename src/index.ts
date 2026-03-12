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

    // Variables d'état
    let currentStream = "";
    let currentStartTimestamp: Date | undefined = undefined;

    setInterval(async () => {
        const playing = await trakt.getCurrentPlaying();

        if (playing) {
            // Si c'est une nouvelle lecture, on met à jour Discord
            if (playing.streamName !== currentStream) {
                console.log(`[Changement d'état] Nouveau média détecté : ${playing.title} | ${playing.streamName}`);
                currentStream = playing.streamName;
                currentStartTimestamp = new Date(); // On fige l'heure de début

                await discord.setPresence(playing.title, playing.streamName, currentStartTimestamp);
            }
        } else {
            // Si rien ne joue mais qu'on avait un statut actif, on nettoie
            if (currentStream !== "") {
                console.log(`[Changement d'état] Arrêt de la lecture. Nettoyage de Discord.`);
                await discord.clearPresence();
                currentStream = "";
                currentStartTimestamp = undefined;
            }
        }
    }, POLLING_INTERVAL_MS);
}

bootstrap().catch(console.error);