import { AppWindow } from '../AppWindow';
import { OWGamesEvents } from '../../odk-ts/ow-games-events';
import { OWHotkeys } from '../../odk-ts/ow-hotkeys';
import { OWWindow } from '../../odk-ts/ow-window';
import { Database } from '../../odk-ts/database';
import { Controllers } from '../../odk-ts/controllers';
import { Localstorage } from '../../odk-ts/localstorage';
import { interestingFeatures1, hotkeys, windowNames } from '../../consts';

const searchingDiv = document.getElementById('searching');
const overwolfStatusDiv = document.getElementById('overwolf-status');
const ineternetStatusDiv = document.getElementById('internet-status');
const navBtn = document.getElementsByClassName('nav-btn');
const circleDivs = document.getElementsByClassName('circle-div');
const settingsTabs = ['overview', 'daily-weekly', 'settings'];

// Remove this in the future. Added in 1.5.0.0
const valuesCustom = JSON.parse(localStorage.valuesTable);
Object.keys(valuesCustom).forEach(e => {
    valuesCustom[e] = valuesCustom[e] === 'Hacker %' || valuesCustom[e] === 'Country' ? 'Empty' : valuesCustom[e]
});
localStorage.valuesTable = JSON.stringify(valuesCustom);

const local = JSON.parse(localStorage.settings);

let gameMode: string, gameStatus: string, windowId: string, owWindow: OWWindow, circleStats: any;

if (localStorage.desktopOnly === '"0"') {
    owWindow = new OWWindow(windowNames.inLobby);

    windowId = 'in_lobby';
} else {
    owWindow = new OWWindow(windowNames.inLobbyDesktopOnly);

    windowId = 'in_lobby_desktop_only';
}
const database = new Database();
const controllers = new Controllers();
const localstorage = new Localstorage();

const promise1 = localstorage.initiateLocalStorage()
    .then(() => controllers.setTheme());

controllers.getOverwolfStatus(overwolfStatusDiv);
controllers.getInternetStatus(ineternetStatusDiv);
controllers.setShortcutText(document.getElementById('shortcut-text'));

const overwolfStatusID = window.setInterval(() => controllers.getOverwolfStatus(overwolfStatusDiv), 60000);
const internetStatusID = window.setInterval(() => controllers.getInternetStatus(ineternetStatusDiv), 60000);
overwolf.settings.hotkeys.onChanged.addListener(() => {
    controllers.setShortcutText(document.getElementById('shortcut-text'));
});
addEventListener('storage', () => {
    controllers.setTheme();
    if (localStorage.desktopOnly === '"0"') {
        const promise = owWindow.scaleWindow('in_lobby', 420, 700, JSON.parse(localStorage.scaleSlider))
            .then(() => owWindow.changeWindowLocation('center-right', windowId));
    } else {
        owWindow.scaleWindow('in_lobby_desktop_only', 420, 700, JSON.parse(localStorage.scaleSlider));
    }
});

const statsNavBtn = document.getElementsByClassName('daily-weekly-nav-btn');

for (let i = 0; i < statsNavBtn.length; i++) {
    statsNavBtn[i].addEventListener('click', function (this: any) {
        for (let i = 0; i < statsNavBtn.length; i++) {
            statsNavBtn[i].classList.remove('active');
        }

        this.classList.add('active');

        setCircles(this.id);
    });
}

function setCircles(id) {
    document.getElementById('kd-circle-weekly').setAttribute('stroke-dasharray', circleStats[0][id].attributeValueKD);
    document.getElementById('wl-circle-weekly').setAttribute('stroke-dasharray', circleStats[0][id].attributeValueWL);
    document.getElementById('kd-circle-weekly-text').innerHTML = parseFloat(circleStats[0][id].kd).toFixed(2);
    document.getElementById('wl-circle-weekly-text').innerHTML = circleStats[0][id].wl + '%';

    document.getElementById('kd-circle-daily').setAttribute('stroke-dasharray', circleStats[1][id].attributeValueKD);
    document.getElementById('wl-circle-daily').setAttribute('stroke-dasharray', circleStats[1][id].attributeValueWL);
    document.getElementById('kd-circle-daily-text').innerHTML = parseFloat(circleStats[1][id].kd).toFixed(2);
    document.getElementById('wl-circle-daily-text').innerHTML = circleStats[1][id].wl + '%';
}

class InLobby extends AppWindow {
    private static _instance: InLobby;
    private _rainbowGameEventsListener: OWGamesEvents;
    private _eventsLog: HTMLElement;
    private _infoLog: HTMLElement;

    private constructor() {
        if (localStorage.desktopOnly === '"0"') {
            super(windowNames.inLobby, 'ingame');

            const promise = owWindow.scaleWindow('in_lobby', 420, 700, JSON.parse(localStorage.scaleSlider))
                .then(() => owWindow.changeWindowLocation('center-right', windowId));
        } else {
            super(windowNames.inLobbyDesktopOnly, 'desktop');

            owWindow.scaleWindow('in_lobby_desktop_only', 420, 700, JSON.parse(localStorage.scaleSlider));
        }

        owWindow.restore();

        this.setToggleHotkeyBehavior();
        this.setNavListeners();
        //this.setToggleHotkeyText();

        this._rainbowGameEventsListener = new OWGamesEvents({
            onInfoUpdates: this.onInfoUpdates.bind(this),
            onNewEvents: this.onNewEvents.bind(this)
        }, interestingFeatures1);

        const promise = database.initAllIDB()
            .then(() => database.displayDailyWeekly())
            .then(result => circleStats = result);
    }

    public static instance() {
        if (!this._instance) {
            this._instance = new InLobby();
        }

        return this._instance;
    }

    public run() {
        this._rainbowGameEventsListener.start();
    }

    private onInfoUpdates(info) {
        if (('match_info' in info && 'game_mode' in info.match_info) || ('game_info' in info && 'phase' in info.game_info && info.game_info.phase === 'lobby')) {
            if (info.match_info) {
                gameMode = info.match_info.game_mode;
            }

            if (gameMode !== 'NONE') {
                gameStatus = 'searching';
                console.log(`game status "${gameStatus}"`);

                let matchMaking: string;

                if (gameMode.split('_')[2]) {
                    matchMaking = gameMode.split('_')[1] + ' ' + gameMode.split('_')[2];
                } else {
                    matchMaking = gameMode.split('_')[1];
                }

                document.getElementById('match-making-text').innerHTML = 'matchmaking ' + matchMaking;
                searchingDiv.style.display = 'block';
            } else {
                gameStatus = 'lobby';
                console.log(`game status "${gameStatus}"`);

                searchingDiv.style.display = 'none';
            }
        }
        // this.logLine('log', 'infoUpdate', info);
    }

    private onNewEvents(eventInfo) {
        // this.logLine('log', 'infoEvent', eventInfo);
    }

    private setNavListeners() {
        for (let i = 0; i < navBtn.length; i++) {
            navBtn[i].addEventListener('click', function (this: any) {
                for (let j = 0; j < navBtn.length; j++) {
                    navBtn[j].classList.remove('active');
                    document.getElementById(settingsTabs[j]).style.display = 'none';
                }

                this.classList.add('active');
                document.getElementById(settingsTabs[i]).style.display = 'block';
            })
        }
    }

    // Sets toggleInLobbyWindow as the behavior for the Ctrl+X hotkey
    private async setToggleHotkeyBehavior() {
        const toggleInLobbyWindow = async hotkeyResult => {
            console.log(`'info': { pressed hotkey for ${hotkeyResult.featureId} }`);

            if (localStorage.desktopOnly === '"0"') {
                const inGameState = await this.getWindowState();
                if (inGameState.window_state === 'normal' || inGameState.window_state === 'maximized') {
                    this.currWindow.minimize();
                } else if (inGameState.window_state === 'minimized' || inGameState.window_state === 'closed') {
                    this.currWindow.restore();
                }

                owWindow.changeWindowLocation('center-right', windowId);
            } else {
                owWindow.changeWindowSize('in_lobby_desktop_only', 420, 700);
            }

            overwolf.windows.close(windowNames.settings, () => {
                console.log('close window' + windowNames.settings);
            });
            overwolf.windows.close(windowNames.statistics, () => {
                console.log('close window' + windowNames.statistics);
            });
            overwolf.windows.close(windowNames.website, () => {
                console.log('close window' + windowNames.website);
            });
        }

        OWHotkeys.onHotkeyDown(hotkeys.toggle, toggleInLobbyWindow);
    }
}

InLobby.instance().run();