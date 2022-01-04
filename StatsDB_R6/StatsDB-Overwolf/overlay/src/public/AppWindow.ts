import { OWWindow } from '../odk-ts/ow-window';

export class AppWindow {
    protected currWindow: OWWindow;
    protected mainWindow: OWWindow;
    protected settingsWindow: OWWindow;
    protected statisticsWindow: OWWindow;
    protected websiteWindow: OWWindow;
    protected maximized: boolean = false;

    constructor(windowName: string, mode: string) {
        this.mainWindow = new OWWindow('background');
        this.currWindow = new OWWindow(windowName);

        let settingsId: string, statisticsId: string, websiteId: string;

        if (mode === 'desktop') {
            settingsId = 'settings_desktop';
            statisticsId = 'statistics_desktop';
            websiteId = 'website_desktop';
        } else {
            settingsId = 'settings_in_game';
            statisticsId = 'statistics_in_game';
            websiteId = 'website_in_game';
        }

        this.settingsWindow = new OWWindow(settingsId);
        this.statisticsWindow = new OWWindow(statisticsId);
        this.websiteWindow = new OWWindow(websiteId);

        const closeButton = document.getElementById('closeButton');
        const maximizeButton = document.getElementById('maximizeButton');
        const minimizeButton = document.getElementById('minimizeButton');
        const settingsButton = document.getElementById('settingsButton');
        const gameHistory = document.getElementById('gameHistory');
        const website = document.getElementById('website');
        const closeWindowButton = document.getElementById('closeWindowButton');
        const modal = document.getElementById('exitMinimizeModal');
        const modalCancelButton = document.getElementById('cancel');
        const modalCloseButton = document.getElementById('exit');
        const modalMinimizeButton = document.getElementById('minimize');

        const header = document.getElementById('header');

        if (windowName === 'desktop' || windowName === 'settings_desktop' || windowName === 'statistics_desktop' || windowName === 'website_desktop' || localStorage.desktopOnly === '"1"') {
            this.setDrag(header);
        }

        if (closeButton) {
            closeButton.addEventListener('click', () => {
                modal.style.display = 'block';
            });
        }

        if (closeWindowButton) {
            closeWindowButton.addEventListener('click', () => {
                this.currWindow.close();
            });
        }

        if (minimizeButton) {
            minimizeButton.addEventListener('click', () => {
                this.currWindow.minimize();
            });
        }

        if (maximizeButton) {
            maximizeButton.addEventListener('click', () => {
                if (!this.maximized) {
                    this.currWindow.maximize();
                } else {
                    this.currWindow.restore();
                }

                this.maximized = !this.maximized;
            });
        }

        if (settingsButton) {
            settingsButton.addEventListener('click', () => {
                this.settingsWindow.restore();
            });
        }

        if (gameHistory) {
            gameHistory.addEventListener('click', () => {
                this.statisticsWindow.restore();
            });
        }

        if (website) {
            website.addEventListener('click', () => {
                this.websiteWindow.restore();
            });
        }

        if (modalCancelButton) {
            modalCancelButton.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }

        if (modalCloseButton) {
            modalCloseButton.addEventListener('click', () => {
                this.mainWindow.close();
            });
        }

        if (modalMinimizeButton) {
            modalMinimizeButton.addEventListener('click', () => {
                this.currWindow.minimize();
                modal.style.display = 'none';
            });
        }
    }

    public async getWindowState() {
        return await this.currWindow.getWindowState();
    }

    private async setDrag(elem: HTMLElement) {
        this.currWindow.dragMove(elem);
    }
}