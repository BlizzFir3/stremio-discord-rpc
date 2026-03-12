import SysTray from 'systray2';
import fs from 'fs';
import path from 'path';

export class TrayManager {
    private systray: SysTray;

    constructor(onExit: () => void) {
        // Read icon (compatible with pkg compilation)
        const iconPath = path.join(__dirname, '../icon.ico');
        let iconData = '';
        if (fs.existsSync(iconPath)) {
            iconData = fs.readFileSync(iconPath, { encoding: 'base64' });
        }

        this.systray = new SysTray({
            menu: {
                icon: iconData,
                title: "Stremio RPC",
                tooltip: "Stremio-Discord RPC",
                items: [
                    {
                        title: "Status: Active",
                        tooltip: "The service is running in the background",
                        checked: false,
                        enabled: false // Not clickable, info only
                    },
                    {
                        title: "Quit",
                        tooltip: "Stop the daemon",
                        checked: false,
                        enabled: true
                    }
                ]
            },
            debug: false,
            copyDir: true // Required for internal binary to work with pkg
        });

        // Listen for menu events
        this.systray.onClick(action => {
            if (action.item.title === "Quit") {
                console.log("[Systray] User shutdown request.");
                this.systray.kill();
                onExit();
            }
        });
    }

    public start() {
        this.systray.ready().then(() => {
            console.log("[Systray] Icon added to the taskbar.");
        }).catch(err => {
            console.error("[Systray] Initialization error:", err);
        });
    }

    public stop() {
        this.systray.kill();
    }
}