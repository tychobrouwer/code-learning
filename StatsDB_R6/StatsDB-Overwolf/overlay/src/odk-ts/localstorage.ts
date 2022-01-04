import { Controllers } from './controllers';
import { OWWindow } from './ow-window';

const controllers = new Controllers, owWindow: OWWindow = new OWWindow;

let localDesktopOnly = localStorage.desktopOnly, valuesCustom, local;

export class Localstorage {
    private dtable: NodeListOf<Element>;
    private dtheme: NodeListOf<Element>;
    private dmaximize: NodeListOf<Element>;
    private ddisplay: NodeListOf<Element>;
    private dallCaps: NodeListOf<Element>;
    private dmonitors: NodeListOf<Element>;
    private dcircle: NodeListOf<Element>;

    constructor() {
        this.dtable = document.querySelectorAll('#setting-dtable .custom-option');
        this.dtheme = document.querySelectorAll('#setting-dtheme .custom-option');
        this.dmaximize = document.querySelectorAll('#setting-dmaximize .custom-option');
        this.ddisplay = document.querySelectorAll('#setting-ddisplay .custom-option');
        this.dallCaps = document.querySelectorAll('#setting-dallCaps .custom-option');
        this.dmonitors = document.querySelectorAll('#setting-dmonitors .custom-option');
        this.dcircle = document.querySelectorAll('#setting-dcircle .custom-option');
    }

    public initiateLocalStorage(): Promise<void> {
        return new Promise<void>(async (resolve) => {
            if (!localStorage.settings) {
                localStorage.setItem('settings', JSON.stringify({
                    "table": "0",
                    "maximize": "0",
                    "theme": "0",
                    "circle": "general",
                    "monitorId": "0",
                    "allCaps": "0",
                }));
            } else if (Object.keys(JSON.parse(localStorage.settings)).length < 6) {
                let settings = JSON.parse(localStorage.settings)
                if (!settings.allCaps) {
                    settings.allCaps = "0";
                }
                if (!settings.theme) {
                    settings.theme = "0";
                }
                if (!settings.circle) {
                    settings.circle = "0";
                }
                if (!settings.monitorId) {
                    settings.monitorId = "0";
                }
                if (!settings.allCaps) {
                    settings.allCaps = "0";
                }
                localStorage.setItem('settings', JSON.stringify(settings))
            }

            if (!localStorage.scaleSlider) {
                localStorage.setItem('scaleSlider', '"1"');
            }

            if (!localStorage.valuesTable || Object.keys(JSON.parse(localStorage.valuesTable)).length < 9) {
                localStorage.setItem('valuesTable', JSON.stringify({
                    0: 'Empty',
                    1: 'LVL',
                    2: 'Kills',
                    3: 'Deaths',
                    4: 'K/D',
                    5: 'Wins',
                    6: 'Losses',
                    7: 'W/L',
                    8: 'HS/K'
                }));
            }

            if (!localStorage.desktopOnly) {
                localStorage.setItem('desktopOnly', '"0"');
            }

            local = JSON.parse(localStorage.settings);
            valuesCustom = JSON.parse(localStorage.valuesTable);

            resolve();
        })
    }

    public changeSetting(selectedOption: any) {
        const value = selectedOption.getAttribute('value');
        const settingId = selectedOption.getAttribute('settingid');

        if (settingId === 'setting-valueTable') {
            const index = selectedOption.getAttribute('index');

            valuesCustom[index] = value;
            this.setStorage('valuesTable', valuesCustom);
        }

        if (settingId === 'setting-dtheme') {
            local.theme = value;
            this.setStorage('settings', local);

            controllers.setTheme();
        }

        if (settingId === 'setting-dtable') {
            local.table = value;
            this.setStorage('settings', local);
        }

        if (settingId === 'setting-ddisplay') {
            this.setStorage('desktopOnly', value);
        }

        if (settingId === 'setting-dmaximize') {
            local.maximize = value;
            this.setStorage('settings', local);
        }

        if (settingId === 'setting-dallCaps') {
            local.allCaps = value;
            this.setStorage('settings', local);
        }

        if (settingId === 'setting-dmonitors') {
            local.monitorId = value;
            this.setStorage('settings', local);
        }

        if (settingId === 'setting-dcircle') {
            local.circle = value;
            this.setStorage('settings', local);
        }

        if (settingId === 'setting-dslider') {
            this.setStorage('scaleSlider', selectedOption.value);
        }
    }

    private setStorage(key: string, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    public setSettings() {
        const circles = {
            "general": 0,
            "ranked": 1,
            "casual": 2,
            "unranked": 3
        }

        const settingsArr = [
            this.dtable[local.table],
            this.dtheme[local.theme],
            this.dmaximize[local.maximize],
            this.dallCaps[local.allCaps],
            this.ddisplay[localDesktopOnly.replace(/"/g, '')],
            this.dmonitors[local.monitorId],
            this.dcircle[circles[local.circle]],
        ];

        for (let i = 0; i < settingsArr.length; i++) {
            let setting = settingsArr[i];

            if (setting !== this.dmonitors[local.monitorId]) {
                setting.parentNode.querySelector('.custom-option.selected')?.classList.remove('selected');
                setting.classList.add('selected');
                setting.closest('.custom-select').querySelector('.custom-select__trigger span').textContent = setting.textContent;
            } else if (setting === this.dmonitors[local.monitorId]) {
                setting = document.querySelectorAll('#setting-dmonitors .custom-option')[local.monitorId];

                setting.parentNode.querySelector('.custom-option.selected')?.classList.remove('selected');
                setting.classList.add('selected');
                setting.closest('.custom-select').querySelector('.custom-select__trigger span').textContent = setting.textContent;
            }
        }

        (document.getElementById('windowSize-slider') as any).value = JSON.parse(localStorage.scaleSlider);
        document.getElementById('windowSize-slider-value').innerHTML = JSON.parse(localStorage.scaleSlider);

        this.setDefault();
    }

    private setDefault() {
        for (let i = 0; i < 9; i++) {
            const value = valuesCustom[i].replace(/[ /]/g, '-') + i;
            const setting = document.getElementById(value);

            setting.parentNode.querySelector('.custom-option.selected')?.classList.remove('selected');
            setting.classList.add('selected');
            setting.closest('.custom-select').querySelector('.custom-select__trigger span').textContent = setting.textContent;
        }
    }
}