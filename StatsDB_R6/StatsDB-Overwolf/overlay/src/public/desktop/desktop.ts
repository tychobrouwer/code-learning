import { AppWindow } from '../AppWindow';
import { OWWindow } from '../../odk-ts/ow-window';
import { Controllers } from '../../odk-ts/controllers';
import { Localstorage } from '../../odk-ts/localstorage';
import { windowNames } from '../../consts';

const overwolfStatusDiv = document.getElementById('overwolf-status');
const ineternetStatusDiv = document.getElementById('internet-status');

const owWindow = new OWWindow(windowNames.desktop);
const controllers = new Controllers();
const localstorage = new Localstorage();

owWindow.changeWindowLocation('center-center', 'desktop');

const promise = localstorage.initiateLocalStorage()
    .then(() => {
        controllers.setTheme();
        owWindow.scaleWindow('desktop', 900, 600, JSON.parse(localStorage.scaleSlider));
    });

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
    owWindow.scaleWindow('desktop', 900, 600, JSON.parse(localStorage.scaleSlider));
});

new AppWindow(windowNames.desktop, 'desktop');