import { AppWindow } from '../AppWindow';
import { OWWindow } from '../../odk-ts/ow-window';
import { Controllers } from '../../odk-ts/controllers';
import { Localstorage } from '../../odk-ts/localstorage';
import { windowNames } from '../../consts';

const settingDivs = document.querySelectorAll('.settingOptions');

let owWindow: OWWindow, mode: string;

const controllers = new Controllers();
const localstorage = new Localstorage();

class Settings extends AppWindow {
    private static _instance: Settings;

    private constructor() {
        if (mode === 'desktop') {
            super(windowNames.settingsDesktopOnly, 'desktop');

            owWindow.scaleWindow('settings_desktop', 900, 700, JSON.parse(localStorage.scaleSlider));
        } else {
            super(windowNames.settings, 'ingame');

            const promise = owWindow.scaleWindow('settings_in_game', 900, 700, JSON.parse(localStorage.scaleSlider))
                .then(() => owWindow.changeWindowLocation('center-center', 'settings_in_game'));
        }
        owWindow.restore();

        const promise = owWindow.getMonitorsList()
            .then(monitorList => {
                let monitorListHTML: string = '';

                for (let i = 0; i < monitorList.displays.length; i++) {
                    monitorListHTML += `
                        <span settingId="setting-dmonitors" class="custom-option" value="${i}">${monitorList.displays[i].name}</span>
                    `;
                }

                document.getElementById('setting-dmonitors').innerHTML = monitorListHTML;
            })
            .then(() => {
                this.setSettingSelector();

                const promise = localstorage.initiateLocalStorage()
                    .then(() => {
                        localstorage.setSettings();
                        controllers.setTheme();
                    })
            });

        overwolf.settings.hotkeys.onChanged.addListener(() => {
            controllers.setShortcutText(document.getElementById('shortcut-text'));
        });

        addEventListener('storage', () => {
            controllers.setTheme();
        });
    }

    public static instance() {
        if (!this._instance) {
            this._instance = new Settings();
        }

        return this._instance;
    }

    private setSettingSelector() {
        document.addEventListener('click', function (el) {
            const target: any = el.target;

            let outside = true;

            for (let i = 0; i < settingDivs.length; i++) {
                if (settingDivs[i].contains(target)) {
                    outside = false;
                }
            }

            if (outside) {
                for (let i = 0; i < settingDivs.length; i++) {
                    settingDivs[i].classList.remove('open');
                }
            }
        })

        for (let i = 0; i < settingDivs.length; i++) {
            const settingDiv = settingDivs[i];

            settingDiv.addEventListener('click', function () {
                for (let j = 0; j < settingDivs.length; j++) {
                    const settingDiv2 = settingDivs[j];

                    if (settingDiv !== settingDiv2) {
                        if (settingDiv2.querySelector('.custom-select')) {
                            settingDiv2.querySelector('.custom-select').classList.remove('open');
                        } else {
                            settingDiv2.classList.remove('open');
                        }
                    } else {
                        settingDiv.classList.toggle('open');
                    }
                }
            })
        }

        document.getElementById('windowSize-slider').addEventListener('change', function (option: any) {
            localstorage.changeSetting(option.target);
        });

        document.getElementById('windowSize-slider').addEventListener('input', function () {
            document.getElementById('windowSize-slider-value').innerHTML = (document.getElementById('windowSize-slider') as any).value
        });

        for (const option of document.querySelectorAll(".custom-option")) {
            option.addEventListener('click', function () {
                if (!option.classList.contains('selected')) {
                    option.parentNode.querySelector('.custom-option.selected')?.classList.remove('selected');
                    option.classList.add('selected');
                    option.closest('.custom-select').querySelector('.custom-select__trigger span').textContent = option.textContent;
                }

                localstorage.changeSetting(option);
            })
        }
    }
}

overwolf.windows.getOpenWindows(data => {
    const windows = Object.keys(data);

    if (windows.includes('in_lobby_desktop_only') || windows.includes('in_game_desktop_only') || windows.includes('desktop')) {
        mode = 'desktop';

        owWindow = new OWWindow(windowNames.settingsDesktopOnly);
    } else {
        owWindow = new OWWindow(windowNames.settings);
    }

    Settings.instance();
});