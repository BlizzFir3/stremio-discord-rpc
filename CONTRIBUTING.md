# Contributing to Stremio-Discord RPC

First off, thank you for considering contributing to this project! It's people like you that make the open-source community such an amazing place to learn, inspire, and create.

## 🎯 Current Top Priority: Cross-Platform Support

Right now, the core architecture and the startup scripts (`.bat` files and Windows Registry integration) are heavily optimized for **Windows**. 

**Our primary goal is to make this daemon fully cross-platform (macOS, Linux, and Windows).** If you are a macOS or Linux user, contributions addressing the following areas are highly highly appreciated:
- Implementation of `systemd` services for Linux auto-start.
- Implementation of `launchd` `.plist` agents for macOS auto-start.
- Testing and validating the Discord IPC socket connection on Unix systems (handling `/run/user/1000/discord-ipc-0` or macOS equivalents).
- Bash/Zsh equivalent scripts for the `scripts/` directory.

## 🛠️ How to Contribute

1. **Fork the Repository**: Start by forking this repository to your own GitHub account.
2. **Clone the Fork**: Clone your fork to your local machine.
3. **Create a Branch**: Create a new branch for your feature or bugfix (`git checkout -b feature/cross-platform-linux`).
4. **Keep it Clean**: Write clean, modular, and strongly-typed TypeScript. Avoid adding heavy third-party dependencies unless absolutely necessary.
5. **Commit your Changes**: Use clear and descriptive commit messages.
6. **Push and Pull Request**: Push your branch to your fork and submit a Pull Request against the `main` branch of this repository.

## 💻 Development Setup

```bash
# Install dependencies
npm install

# Run the daemon in watch mode (requires a valid .env file)
npm run dev

# Build the executable to test packaging
npm run package

```

Please ensure that your code passes standard TypeScript compilation without errors before submitting a PR.