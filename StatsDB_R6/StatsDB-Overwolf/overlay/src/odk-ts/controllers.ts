export class Controllers {
    public setShortcutText(shortcutContainer: HTMLElement) {
        overwolf.settings.hotkeys.get(result => {
            if (!result.success)
                console.error(result);

            const hotkey = result.games['10826'][0].binding;

            if (hotkey === 'Unassigned') {
                shortcutContainer.innerHTML = 'UNASSIGNED to show/hide the overlay';
            } else {
                shortcutContainer.innerHTML = hotkey + ' to show/hide the overlay in game';
            }

            console.log(`app hotkey "${hotkey}"`);
        });
    }

    public getOverwolfStatus(overwolfStatusDiv: HTMLElement) {
        fetch('https://game-events-status.overwolf.com/10826_prod.json')
            .then(response => response.json())
            .then(data => {
                const overwolfStatus = data.state;

                if (overwolfStatus === 2) {
                    overwolfStatusDiv.style.display = 'block';
                    overwolfStatusDiv.innerHTML = '<h4 class="announcement">Due to a recent game patch, some functions might not work - we’ll fix it shortly</h4>';
                } else if (overwolfStatus === 3) {
                    overwolfStatusDiv.style.display = 'block';
                    overwolfStatusDiv.innerHTML = '<h4 class="announcement">Due to a recent game patch, Overwolf app API has stopped working - we’ll fix it shortly</h4>';
                } else if (overwolfStatus === 1) {
                    overwolfStatusDiv.style.display = 'none';
                    overwolfStatusDiv.innerHTML = '';
                }

                console.log(`overwolf status "${overwolfStatus}"`);
            });
    }

    public getInternetStatus(ineternetStatusDiv: HTMLElement) {
        const internetStatus = navigator.onLine;

        if (internetStatus === false) {
            ineternetStatusDiv.style.display = 'block';
        } else {
            ineternetStatusDiv.style.display = 'none';
        }

        console.log(`internet status "${internetStatus}"`);
    }

    public setTableTab(tab: string) {
        if (tab === 'search player') {
            document.getElementById('website-iframe').innerHTML = `<iframe src="https://r6db.net" width="1130" height="750" frameBorder="0"></iframe>`;
            document.getElementById('table-content').style.display = 'none';
            document.getElementById('live-frame').style.display = 'none';
        } else if (tab === 'live scoreboard') {
            document.getElementById('website-iframe').innerHTML = ``;
            document.getElementById('live-frame').style.display = 'block';
            document.getElementById('table-content').style.display = 'none';
        } else {
            document.getElementById('website-iframe').innerHTML = ``;
            document.getElementById('table-content').style.display = 'block';
            document.getElementById('live-frame').style.display = 'none';

            for (let i = 0; i < Object.keys(JSON.parse(localStorage.valuesTable)).length; i++) {
                for (let j = 0; j < document.getElementsByClassName("player-tr").length; j++) {
                    const rankedStats = document.getElementById('ranked' + i + j);
                    const casualStats = document.getElementById('casual' + i + j);
                    const seasonStats = document.getElementById('seasonal' + i + j);

                    if (rankedStats) {
                        if (tab === 'ranked') {
                            rankedStats.classList.add("current");
                            casualStats.classList.remove("current");
                            seasonStats.classList.remove("current");
                        } else if (tab === 'casual') {
                            rankedStats.classList.remove("current");
                            casualStats.classList.add("current");
                            seasonStats.classList.remove("current");
                        } else if (tab === 'season') {
                            rankedStats.classList.remove("current");
                            casualStats.classList.remove("current");
                            seasonStats.classList.add("current");
                        }
                    }
                }
            }
        }
        console.log(`current table tab "${tab}"`);
    }

    public showDetailedPlayer(detailedstatus: boolean) {
        if (detailedstatus) {
            document.getElementById('table-body').style.display = 'block';
            document.getElementById('detailed-body').style.display = 'none';
            detailedstatus = false;
        } else {
            document.getElementById('table-body').style.display = 'none';
            document.getElementById('detailed-body').style.display = 'block';
            detailedstatus = true;
        }

        console.log(`detailed stats "${!detailedstatus}"`);

        return detailedstatus;
    }

    public setTheme() {
        const selected = JSON.parse(localStorage.getItem("settings"));
        const styleVariables = document.documentElement.style;

        if (selected.theme === "0") {
            styleVariables.setProperty("--main-text-color", "rgba(255, 255, 255, 0.87)");
            styleVariables.setProperty("--sec-text-color", "#F0F0F0");
            styleVariables.setProperty("--sec-text-hover-color", "#FFFFFF61");
            styleVariables.setProperty("--main-bg-color", "#121212");
            styleVariables.setProperty("--sec-bg-color", "#FFFFFF14");
            styleVariables.setProperty("--overlay-color", "#000");
            styleVariables.setProperty("--dropdown", "#FFFFFF");
            styleVariables.setProperty("--darker-btn-color", "#FFFFFF1E");
            styleVariables.setProperty("--darker-button-hover-color", "#FFFFFF33");
            styleVariables.setProperty("--dropdown-btn-color", "#FFFFFF");
            styleVariables.setProperty("--backgroundUrl", "url('/img/background.webp')");
            styleVariables.setProperty("--r6DB-logo-large", 'url("/img/statsdb-light-logo.svg")');

            if (document.getElementById('r6db-logo-small')) {
                document.getElementById('r6db-logo-small').setAttribute('xlink:href', '/img/socialmedia_icons.svg#r6db');
            }
        } else if (selected.theme === "1") {
            styleVariables.setProperty("--main-text-color", "#000000");
            styleVariables.setProperty("--sec-text-color", "#000000");
            styleVariables.setProperty("--sec-text-hover-color", "#333333");
            styleVariables.setProperty("--main-bg-color", "#f3f3f3");
            styleVariables.setProperty("--sec-bg-color", "#eeeeee");
            styleVariables.setProperty("--overlay-color", "#f3f3f3");
            styleVariables.setProperty("--backgroundUrl", "none");
            styleVariables.setProperty("--darker-btn-color", "#999999");
            styleVariables.setProperty("--darker-button-hover-color", "#000000");
            styleVariables.setProperty("--dropdown", "#000000");
            styleVariables.setProperty("--dropdown-btn-color", "#000000");
            styleVariables.setProperty("--r6DB-logo-large", 'url("/img/statsdb-dark-logo.svg")');

            if (document.getElementById('r6db-logo-small')) {
                document.getElementById('r6db-logo-small').setAttribute('xlink:href', '/img/socialmedia_icons.svg#r6dbdark');
            }
        } else if (selected.theme == "2") {
            styleVariables.setProperty("--main-text-color", "#000000");
            styleVariables.setProperty("--sec-text-color", "#000000");
            styleVariables.setProperty("--sec-text-hover-color", "#333333");
            styleVariables.setProperty("--main-bg-color", "#b8b8b8");
            styleVariables.setProperty("--sec-bg-color", "#b0b0b0");
            styleVariables.setProperty("--overlay-color", "#b8b8b8");
            styleVariables.setProperty("--backgroundUrl", "none");
            styleVariables.setProperty("--darker-btn-color", "#999999");
            styleVariables.setProperty("--darker-button-hover-color", "#000000");
            styleVariables.setProperty("--dropdown", "#000000");
            styleVariables.setProperty("--dropdown-btn-color", "#000000");
            styleVariables.setProperty("--r6DB-logo-large", 'url("/img/statsdb-dark-logo.svg")');

            if (document.getElementById('r6db-logo-small')) {
                document.getElementById('r6db-logo-small').setAttribute('xlink:href', '/img/socialmedia_icons.svg#r6dbdark');
            }
        }
    }

    public async fetchConfig() {
        fetch('https://staging-api.statsdb.net/r6/overlay/config')
            .then(response => response.json())
            .then(data => {
                if (!localStorage.config) {
                    localStorage.setItem('config', JSON.stringify(data.payload.rainbow));
                } else if (localStorage.config) {
                    const config = JSON.parse(localStorage.getItem('config'))
                    if (config.version != data.payload.rainbow.version) {
                        localStorage.setItem('config', JSON.stringify(data.payload.rainbow));
                    }
                }
            });
    }

    public async getConfig() {
        return JSON.parse(localStorage.getItem('config'));
    }
}