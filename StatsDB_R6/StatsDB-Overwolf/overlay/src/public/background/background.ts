import { OWGames } from '../../odk-ts/ow-games';
import { OWGameListener } from '../../odk-ts/ow-game-listener';
import { OWWindow } from '../../odk-ts/ow-window';
import { OWGamesEvents } from '../../odk-ts/ow-games-events';
import { Database } from '../../odk-ts/database';
import RunningGameInfo = overwolf.games.RunningGameInfo;
import { windowNames, rainbowClassId, interestingFeatures2 } from '../../consts';

let gameMode: string, gameStatus: string, currentWindow: string;

function logLine(type: string, log: string, data) {
    const logLine = '"' + log + '": ' + JSON.stringify(data, undefined, 2);

    if (type === 'log') {
        console.log(logLine);
    } else if (type === 'error') {
        console.error(logLine);
    } else if (type === 'warn') {
        console.warn(logLine);
    }
}

// The background controller holds all of the app's background logic - hence its name. it has
// many possible use cases, for example sharing data between windows, or, in our case,
// managing which window is currently presented to the user. To that end, it holds a dictionary
// of the windows available in the app.
// Our background controller implements the Singleton design pattern, since only one
// instance of it should exist.
class BackgroundController {
    private static _instance: BackgroundController;
    private _windows = {};
    private _rainbowGameListener: OWGameListener;
    private _rainbowGameEventsListener: OWGamesEvents;
    private _eventsLog: HTMLElement;
    private _infoLog: HTMLElement;
    private database: Database;

    private constructor() {
        // Populating the background controller's window dictionary
        this._windows[windowNames.desktop] = new OWWindow(windowNames.desktop);
        this._windows[windowNames.inGame] = new OWWindow(windowNames.inGame);
        this._windows[windowNames.inLobby] = new OWWindow(windowNames.inLobby);
        this._windows[windowNames.statistics] = new OWWindow(windowNames.statistics);
        this._windows[windowNames.website] = new OWWindow(windowNames.website);
        this._windows[windowNames.inGameDesktopOnly] = new OWWindow(windowNames.inGameDesktopOnly);
        this._windows[windowNames.inLobbyDesktopOnly] = new OWWindow(windowNames.inLobbyDesktopOnly);
        this._windows[windowNames.statisticsDesktopOnly] = new OWWindow(windowNames.statisticsDesktopOnly);
        this._windows[windowNames.websiteDesktopOnly] = new OWWindow(windowNames.websiteDesktopOnly);
        this.database = new Database();

        // When a rainbow game is started or is ended, toggle the app's windows
        this._rainbowGameListener = new OWGameListener({
            onGameStarted: this.toggleWindows.bind(this),
            onGameEnded: this.toggleWindows.bind(this)
        });

        this._rainbowGameEventsListener = new OWGamesEvents({
            onInfoUpdates: this.onInfoUpdates.bind(this),
            onNewEvents: this.onNewEvents.bind(this)
        }, interestingFeatures2);

        const promise = this.database.createIDB('weeks', 'week', 47)
            .then(() => this.database.createIDB('days', 'date', 48))
            .then(() => this.database.createIDB('savedMatches', 'matchId', 49, ['timeStampIndex', 'timeStamp', 'gameMode']))
            .then(() => this.database.initAllIDB());
    };

    // Implementing the Singleton design pattern
    public static instance(): BackgroundController {
        if (!BackgroundController._instance) {
            BackgroundController._instance = new BackgroundController();
        }

        return BackgroundController._instance;
    }

    // When running the app, start listening to games' status and decide which window should
    // be launched first, based on whether rainbow is currently running
    public async run() {
        this._rainbowGameEventsListener.start();
        this._rainbowGameListener.start();

        const currWindow = await this.isRainbowRunning() ? null : this._windows[windowNames.desktop].restore();
        if (currWindow) {
            logLine('log', 'open window', currWindow);
            currentWindow = currWindow;
        }
    }

    private toggleWindows(info) {
        if (!info || !this.isGameRainbow(info)) {
            return;
        }

        if (info.isRunning) {
            this._windows[windowNames.desktop].close();

            logLine('log', 'close window', windowNames.desktop);
        } else {
            this._windows[windowNames.inGame].close();
            this._windows[windowNames.inLobby].close();
            this._windows[windowNames.statistics].close();
            this._windows[windowNames.website].close();
            this._windows[windowNames.inGameDesktopOnly].close();
            this._windows[windowNames.inLobbyDesktopOnly].close();
            this._windows[windowNames.statisticsDesktopOnly].close();
            this._windows[windowNames.websiteDesktopOnly].close();
            this._windows[windowNames.desktop].restore();

            logLine('log', 'open window', windowNames.desktop);

            currentWindow = 'desktop';
        }
    }

    private async isRainbowRunning(): Promise < boolean > {
        const info = await OWGames.getRunningGameInfo();

        return info && info.isRunning && this.isGameRainbow(info);
    }

    // Identify whether the RunningGameInfo object we have references Rainbow
    private isGameRainbow(info: RunningGameInfo) {
        return info.classId === rainbowClassId;
    }

    private onInfoUpdates(info) {
        if (
            ('match_info' in info && 'game_mode' in info.match_info) ||
            ('game_info' in info && 'phase' in info.game_info && info.game_info.phase === 'lobby') ||
            ('round' in info && 'number' in info.round && info.round === null)
        ) {
            if (info.match_info) {
                gameMode = info.match_info.game_mode;
            }

            if (
                gameMode !== 'NONE' &&
                !('game_info' in info && 'phase' in info.game_info && info.game_info.phase === 'lobby') &&
                !('round' in info && 'number' in info.round && info.round === null)
            ) {
                gameStatus = 'searching';

            } else {
                gameStatus = 'lobby';

                if (localStorage.desktopOnly === '"0"') {
                    this._windows[windowNames.inGame].close();
                    this._windows[windowNames.inGameDesktopOnly].close();
                    this._windows[windowNames.inLobby].restore();

                    overwolf.windows.close(windowNames.settings, () => {
                        logLine('log', 'close window', windowNames.settings);
                    });
                    overwolf.windows.close(windowNames.statistics, () => {
                        logLine('log', 'close window', windowNames.statistics);
                    });
                    overwolf.windows.close(windowNames.website, () => {
                        logLine('log', 'close window', windowNames.website);
                    });
                    overwolf.windows.close(windowNames.settingsDesktopOnly, () => {
                        logLine('log', 'close window', windowNames.settingsDesktopOnly);
                    });
                    overwolf.windows.close(windowNames.statisticsDesktopOnly, () => {
                        logLine('log', 'close window', windowNames.statisticsDesktopOnly);
                    });
                    overwolf.windows.close(windowNames.websiteDesktopOnly, () => {
                        logLine('log', 'close window', windowNames.websiteDesktopOnly);
                    });

                    logLine('log', 'open window', windowNames.inLobby);
                } else {
                    this._windows[windowNames.inGameDesktopOnly].close();
                    this._windows[windowNames.inGame].close();
                    this._windows[windowNames.inLobbyDesktopOnly].restore();

                    overwolf.windows.close(windowNames.settings, () => {
                        logLine('log', 'close window', windowNames.settings);
                    });
                    overwolf.windows.close(windowNames.statistics, () => {
                        logLine('log', 'close window', windowNames.statistics);
                    });
                    overwolf.windows.close(windowNames.website, () => {
                        logLine('log', 'close window', windowNames.website);
                    });
                    overwolf.windows.close(windowNames.settingsDesktopOnly, () => {
                        logLine('log', 'close window', windowNames.settingsDesktopOnly);
                    });
                    overwolf.windows.close(windowNames.statisticsDesktopOnly, () => {
                        logLine('log', 'close window', windowNames.statisticsDesktopOnly);
                    });
                    overwolf.windows.close(windowNames.websiteDesktopOnly, () => {
                        logLine('log', 'close window', windowNames.websiteDesktopOnly);
                    });

                    logLine('log', 'open window', windowNames.inLobbyDesktopOnly);
                }
            }
        }

        if ('round' in info && info.round.number != null && gameStatus !== 'in_game') {
            gameStatus = 'in_game';

            if (localStorage.desktopOnly === '"0"') {
                this._windows[windowNames.inLobby].close();
                this._windows[windowNames.inLobbyDesktopOnly].close();
                this._windows[windowNames.inGame].restore();

                overwolf.windows.close(windowNames.settings, () => {
                    logLine('log', 'close window', windowNames.settings);
                });
                overwolf.windows.close(windowNames.statistics, () => {
                    logLine('log', 'close window', windowNames.statistics);
                });
                overwolf.windows.close(windowNames.website, () => {
                    logLine('log', 'close window', windowNames.website);
                });
                overwolf.windows.close(windowNames.settingsDesktopOnly, () => {
                    logLine('log', 'close window', windowNames.settingsDesktopOnly);
                });
                overwolf.windows.close(windowNames.statisticsDesktopOnly, () => {
                    logLine('log', 'close window', windowNames.statisticsDesktopOnly);
                });
                overwolf.windows.close(windowNames.websiteDesktopOnly, () => {
                    logLine('log', 'close window', windowNames.websiteDesktopOnly);
                });

                logLine('log', 'close window', windowNames.inLobby + ' + ' + windowNames.inLobbyDesktopOnly);
                logLine('log', 'open window', windowNames.inGame);
            } else {
                this._windows[windowNames.inLobbyDesktopOnly].close();
                this._windows[windowNames.inLobby].close();
                this._windows[windowNames.inGameDesktopOnly].restore();

                overwolf.windows.close(windowNames.settings, () => {
                    logLine('log', 'close window', windowNames.settings);
                });
                overwolf.windows.close(windowNames.statistics, () => {
                    logLine('log', 'close window', windowNames.statistics);
                });
                overwolf.windows.close(windowNames.website, () => {
                    logLine('log', 'close window', windowNames.website);
                });
                overwolf.windows.close(windowNames.settingsDesktopOnly, () => {
                    logLine('log', 'close window', windowNames.settingsDesktopOnly);
                });
                overwolf.windows.close(windowNames.statisticsDesktopOnly, () => {
                    logLine('log', 'close window', windowNames.statisticsDesktopOnly);
                });
                overwolf.windows.close(windowNames.websiteDesktopOnly, () => {
                    logLine('log', 'close window', windowNames.websiteDesktopOnly);
                });

                logLine('log', 'close window', windowNames.inLobbyDesktopOnly + ' + ' + windowNames.inLobby);
                logLine('log', 'open window', windowNames.inGameDesktopOnly);
            }
        }

        logLine('log', 'infoEvent', info);
    }

    private onNewEvents(eventInfo) {
        logLine('log', 'infoEvent', eventInfo);
    }
}

BackgroundController.instance().run();
