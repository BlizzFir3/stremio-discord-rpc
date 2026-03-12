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
- [Node.js](https://nodejs.org/) (v18+ recommended) for building the project.

## ⚙️ Setup and Configuration

1. Clone this repository and install the dependencies:
   ```bash
   npm install

```

2. Create a `.env` file at the root of the project. **Never commit this file to version control.**
```env
# Discord Developer Portal (General Information > Application ID)
DISCORD_CLIENT_ID=YourDiscordClientID

# Trakt API (OAuth Applications > Client ID)
TRAKT_CLIENT_ID=YourTraktClientID
TRAKT_USERNAME=YourTraktUsername

```



## 🚀 Usage

### Development Mode

To run the script directly via TypeScript without compiling:

```bash
npm run dev

```

### Production Mode (Standalone Executable)

To compile the project into a standalone binary executable for Windows (includes the system tray icon):

```bash
npm run package

```

The executable will be generated in the `bin/stremio-rpc.exe` directory.
**Note:** The `.env` file must be located in the same directory as the executable for it to read your configuration properly.

## ⚠️ Critical Troubleshooting: The Windows IPC Trap

If the application is running (tray icon is visible) and the logs indicate success, but **nothing shows up on Discord**, check your process privilege levels.

Communication between this daemon and Discord occurs via a Windows "Named Pipe" (`\\?\pipe\discord-ipc-0`). **Strict Windows security policies prevent a standard process from communicating with a process running as Administrator.**

* **The Golden Rule:** Always run Discord AND the `stremio-rpc.exe` executable with the **same privilege level** (ideally, both as a standard user).
* If you launch Discord as an Administrator, you must launch this daemon as an Administrator as well, otherwise the OS will silently drop the IPC payload.

Also, verify in Discord: *Settings > Activity Privacy > "Share your activity status by default when joining large servers"* must be toggled **ON**.

Here is the application link : [Stremio-Discord RPC](https://discord.com/oauth2/authorize?client_id=1481553071350747277)
