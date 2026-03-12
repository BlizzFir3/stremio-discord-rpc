import 'dotenv/config';
import { DiscordManager } from './discord';
import { TraktClient } from './trakt';
import { TrayManager } from './tray';

const POLLING_INTERVAL_MS = 15000;

async function bootstrap() {
    const discordClientId = process.env.DISCORD_CLIENT_ID;
    const traktClientId = process.env.TRAKT_CLIENT_ID;
    const traktUsername = process.env.TRAKT_USERNAME;

    if (!discordClientId || !traktClientId || !traktUsername) {
        console.error('Critical error: Missing variables in .env');
        process.exit(1);
    }

    const discord = new DiscordManager(discordClientId);
    const trakt = new TraktClient(traktUsername, traktClientId);

    // Initialize the system tray
    const tray = new TrayManager(async () => {
        // Clean shutdown procedure
        await discord.clearPresence();
        process.exit(0);
    });

    console.log('Starting Trakt-Discord RPC daemon...');
    tray.start();
    await discord.connect();

    let currentStream = "";
    let pollingTimer: NodeJS.Timeout;

    const poll = async () => {
        const playing = await trakt.getCurrentPlaying();

        if (playing) {
            if (playing.streamName !== currentStream) {
                currentStream = playing.streamName;
                const posterUrl = playing.imdbId
                    ? `https://images.metahub.space/poster/medium/${playing.imdbId}/img`
                    : undefined;

                await discord.setPresence(
                    playing.title,
                    playing.streamName,
                    playing.startTime,
                    undefined, // playing.endTime, replace undefined by the comment if you want to show time left instead of time played
                    posterUrl
                );
            }
        } else {
            if (currentStream !== "") {
                await discord.clearPresence();
                currentStream = "";
            }
        }
    };

    pollingTimer = setInterval(poll, POLLING_INTERVAL_MS);

    // Handle graceful exit (Ctrl+C in terminal)
    process.on('SIGINT', async () => {
        clearInterval(pollingTimer);
        await discord.clearPresence();
        tray.stop();
        process.exit(0);
    });
}

bootstrap().catch(console.error);