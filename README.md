# Stremio-Discord RPC Daemon

A lightweight and robust system daemon written in Node.js (TypeScript) that synchronizes your Stremio playback activity (via Trakt.tv) with Discord Rich Presence.

## 🏗️ Architecture and Workflow

Unlike traditional Stremio addons that rely on the local HTTP server (which is often bypassed by Debrid streams), this daemon uses a reliable **Upstream** architecture:
1. **Stremio** pushes the playback state to **Trakt.tv** (Native scrobbling).
2. The **Daemon** polls the Trakt public API every 15 seconds.
3. If active playback is detected, the daemon formats the metadata (Title, Season/Episode, Dynamic Poster via Metahub CDN, Elapsed Time).
4. The payload is pushed to the local **Discord** desktop client via an IPC (Inter-Process Communication) socket.

## 📋 Prerequisites

- A [Trakt.tv](https://trakt.tv/) account (Profile must be set to "Public").
- Trakt integration enabled within Stremio (*Settings > Authentication*).
- The standalone executable of this daemon (or Node.js v18+ if running from source).

## ⚙️ Initial Setup Guide (For New Users)

To use this daemon, you need to provide your own API keys. Don't worry, both are completely free and take less than 2 minutes to get.

### 1. Get your Discord Client ID
1. Go to the [Discord Developer Portal](https://discord.com/developers/applications).
2. Click **New Application** in the top right. Name it what you want to be displayed (e.g., "Stremio" or "Trakt").
3. Accept the terms and click **Create**.
4. In the **General Information** tab, copy the **Application ID**. This is your `DISCORD_CLIENT_ID`.

### 2. Get your Trakt Client ID
1. Log in to [Trakt.tv](https://trakt.tv/).
2. Go to your [API Applications page](https://trakt.tv/oauth/applications) (*Settings > Your API Apps*).
3. Click **New Application**.
4. Name it "Stremio RPC" and put `http://localhost` in the *Redirect URI* field (we won't use it).
5. Click **Save App**. Copy the **Client ID**. This is your `TRAKT_CLIENT_ID`.

### 3. Configure the App
1. Create a file named `.env` in the exact same folder as your `stremio-rpc.exe` executable.
2. Open it with any text editor and paste your credentials:

```env
DISCORD_CLIENT_ID=YourDiscordClientIDHere
TRAKT_CLIENT_ID=YourTraktClientIDHere
TRAKT_USERNAME=YourTraktUsernameHere

```

## 🚀 Usage

Simply double-click the `stremio-rpc.exe` file. An icon will silently appear in your Windows System Tray (bottom right near the clock).
As long as the icon is there, the daemon is running in the background. Right-click the icon and select **"Quitter"** to stop it.

## ⚠️ Critical Troubleshooting: The Windows IPC Trap

If the application is running (tray icon is visible) but **nothing shows up on Discord**, check your process privilege levels.

Communication between this daemon and Discord occurs via a Windows "Named Pipe" (`\\?\pipe\discord-ipc-0`). **Strict Windows security policies prevent a standard process from communicating with a process running as Administrator.**

* **The Golden Rule:** Always run Discord AND the `stremio-rpc.exe` executable with the **same privilege level** (ideally, both as a standard user).
* If you launch Discord as an Administrator, you must launch this daemon as an Administrator as well, otherwise the OS will silently drop the IPC payload.

Also, verify in Discord: *Settings > Activity Privacy > "Share your activity status by default when joining large servers"* must be toggled **ON**.
