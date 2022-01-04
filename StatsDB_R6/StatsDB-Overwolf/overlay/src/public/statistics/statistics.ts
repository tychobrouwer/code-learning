import { AppWindow } from '../AppWindow';
import { OWHotkeys } from '../../odk-ts/ow-hotkeys';
import { OWWindow } from '../../odk-ts/ow-window';
import { Controllers } from '../../odk-ts/controllers';
import { Localstorage } from '../../odk-ts/localstorage';
import { Database } from '../../odk-ts/Database';
import { windowNames, operators, hotkeys } from '../../consts';

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

let owWindow: OWWindow, mode: string, mode2: string, displayedGames = { begin: 0, end: 0 }, moreGames: boolean, showMoreGames: boolean, userTime = { year: 0, month: 0, unixDate: 0, unixEndDate: 0 }, gameList: HTMLElement, loadMore: HTMLElement, showAll: HTMLElement, settingDivs: NodeListOf<Element>;

const controllers = new Controllers();
const localstorage = new Localstorage();
const database = new Database();

const promise1 = localstorage.initiateLocalStorage()
    .then(() => controllers.setTheme());

addEventListener('storage', () => {
    controllers.setTheme();
});

function kd(a, b) {
    if (b !== 0) {
        return (a / b).toFixed(2);
    } else {
        return a.toFixed(2);
    }
}

function getAllIndexes(arr, val) {
    var indexes = [], i = -1;
    while ((i = arr.indexOf(val, i + 1)) != -1) {
        indexes.push(i);
    }
    return indexes;
}

function setTagLoop(array, key, className, displayName) {
    for (let i = 0; i < array.length; i++) {
        if (document.getElementById(`badge-${key}-${array[i]}`)) {
            document.getElementById(`badge-${key}-${array[i]}`).innerHTML += `
            <div class="badge-${className} badge">
                ${displayName}
            <div>
        `;
        }
    }
}

class Statistics extends AppWindow {
    private static _instance: Statistics;

    public constructor(windowId: string) {
        if (mode === 'desktop') {
            if (mode2 === 'website') {
                super(windowNames.websiteDesktopOnly, 'desktop');

                owWindow.scaleWindow('website_desktop', 1600, 900, JSON.parse(localStorage.scaleSlider));
            } else {
                super(windowNames.statisticsDesktopOnly, 'desktop');

                owWindow.scaleWindow('statistics_desktop', 1600, 900, JSON.parse(localStorage.scaleSlider));
            }
        } else {
            if (mode2 === 'website') {
                super(windowNames.website, 'ingame');

                const promise = owWindow.scaleWindow('website_in_game', 1600, 900, JSON.parse(localStorage.scaleSlider))
                    .then(() => owWindow.changeWindowLocation('center-center', 'website_in_game'));
            } else {
                super(windowNames.statistics, 'ingame');

                const promise = owWindow.scaleWindow('statistics_in_game', 1600, 900, JSON.parse(localStorage.scaleSlider))
                    .then(() => owWindow.changeWindowLocation('center-center', 'statistics_in_game'));
            }
        }
        owWindow.restore();

        this.setToggleHotkeyBehavior();

        if (windowId === 'statistics') {
            this.printStatistics();
        } else if (windowId === 'website') {
            this.printWebsite();
        }
    }

    public static instance(windowId: string) {
        if (!this._instance) {
            this._instance = new Statistics(windowId);
        }

        return this._instance;
    }

    private printStatistics() {
        const promise = this.printStatisticsHTML()
            .then(() => {
                gameList = document.getElementById('gameList');
                loadMore = document.getElementById('loadMore');
                showAll = document.getElementById('showAll');
                settingDivs = document.querySelectorAll('.settingOptions');

                this.setShowAllBtn();

                userTime.unixDate = null;
                userTime.unixEndDate = Math.round(new Date().getTime() / 1000);

                displayedGames.begin = 0;
                displayedGames.end = 10;

                this.printGameList(userTime.unixDate, userTime.unixEndDate, 0, 10, displayedGames.end);
                this.setDateSelector();
                this.setDisplayMoreGames();
            });
    }

    private printWebsite() {
        const iframe = `<iframe id="websiteIFrame" src="https://r6db.net" width="1600" height="868"></iframe>`;
        document.getElementById('main').innerHTML = iframe;
    }

    private async printStatisticsHTML(): Promise<void> {
        return new Promise<void>(async (resolve) => {
            document.getElementById('main').innerHTML = `<div class="left-body" id="gameListContainer"><div id="dateSelector"><div id="dropdownContainer"><div class="custom-select settingOptions" id="setMonth"><div class="custom-select__trigger"><span>January</span><div class="arrow"></div></div><div class="custom-options"><span class="custom-option" settingMode="month" value='0'>January</span><span class="custom-option" settingMode="month" value='1'>February</span><span class="custom-option" settingMode="month" value='2'>March</span><span class="custom-option" settingMode="month" value='3'>April</span><span class="custom-option" settingMode="month" value='4'>May</span><span class="custom-option" settingMode="month" value='5'>June</span><span class="custom-option" settingMode="month" value='6'>July</span><span class="custom-option" settingMode="month" value='7'>August</span><span class="custom-option" settingMode="month" value='8'>September</span><span class="custom-option" settingMode="month" value='9'>October</span><span class="custom-option" settingMode="month" value='10'>November</span><span class="custom-option" settingMode="month" value='11'>December</span></div></div><div class="custom-select settingOptions" id="setYear"><div class="custom-select__trigger"><span>2021</span><div class="arrow"></div></div><div class="custom-options"></div></div></div><div id="showAll" class="active"><p>Show all</p></div></div><div id="gameList"></div><div id="loadMore" class="md-whiteframe-1dp"></div></div><div id="gameHistory-right" class="right-body"><div class="detailed-left-body"><div id="scoreboard"><div id="blue-table" class="table md-whiteframe-1dp"><div id="blue-header" class="header"><div class="th-rank"></div><div class="th-username">Username</div><div class="th-kills">Kills</div><div class="th-deaths">Deaths</div><div class="th-kd">K/D</div><div class="th-liveScoreboard">KPR</div><div class="th-liveScoreboard">Entry K-D</div><div class="th-liveScoreboard">KOST</div><div class="th-liveScoreboard">Rating</div><div class="th-score">Score</div></div><div id="blue-player-table" class="player-table"></div></div><div id="orange-table" class="table md-whiteframe-1dp"><div id="orange-header" class="header"><div class="th-rank"></div><div class="th-username">Username</div><div class="th-kills">Kills</div><div class="th-deaths">Deaths</div><div class="th-kd">K/D</div><div class="th-liveScoreboard">KPR</div><div class="th-liveScoreboard">Entry K-D</div><div class="th-liveScoreboard">KOST</div><div class="th-liveScoreboard">Rating</div><div class="th-score">Score</div></div><div id="orange-player-table" class="player-table"></div></div></div><div id="bottom-row" class="md-whiteframe-1dp"><div id="coming-soon"><h1>COMING SOON</h1><p>personal detailed stats of the match</p></div><div id="ad-400x300" class="ad-400x300 ad-lobby"></div></div></div><div id="right-roundstats" class="detailed-right-body md-whiteframe-1dp"></div></div>`;

            resolve();
        })
    }

    public printGameList(beginDate: number, endDate: number, begin: number, end: number, displayedGamesEnd: number) {
        const keyRangeIDB = {
            begin: beginDate,
            end: endDate,
        }

        const promise = this.getGames(keyRangeIDB, begin, end)
            .then(games => {
                moreGames = false;
                showMoreGames = false;

                for (let i = 0; i < Object.keys(games).length; i++) {
                    const game: any = Object.values(games).reverse()[i];

                    if (i <= (displayedGamesEnd - 1)) {
                        const self = game.self;
                        const matchKD = kd(game.matchStats[self.id].kills, game.matchStats[self.id].deaths);

                        let gameMode: string, outcome: string, mapImg: string;

                        if (game.gameMode === 'MATCHMAKING_PVP') {
                            gameMode = 'casual';
                        } else if (game.gameMode === 'MATCHMAKING_PVP_RANKED') {
                            gameMode = 'ranked';
                        } else if (game.gameMode === 'MATCHMAKING_PVP_UNRANKED') {
                            gameMode = 'unranked';
                        } else if (game.gameMode === 'CUSTOMGAME_PVP_DEDICATED') {
                            gameMode = 'custom';
                        }

                        if (game.matchOutcome) {
                            outcome = game.matchOutcome;
                        } else {
                            outcome = 'abandoned';
                        }

                        if (game.map) {
                            mapImg = '<img class="map-img" src="/img/maps/' + game.map.toLowerCase() + '.webp">';
                        } else {
                            mapImg = '<div>?</div>';
                        }

                        gameList.innerHTML += `
                        <div id="${game.timeStamp}" class="game-summary ${game.matchOutcome} md-whiteframe-1dp">
                            <div class="left">
                                ${mapImg}
                            </div>
                            <div class="right">
                                <div class="match-outcome ${game.matchOutcome}">
                                    <p>${outcome}</p>
                                </div>
                                <div class="game-stats">
                                    <p>K/D: <span>${matchKD}</span></p>
                                    <p>Gamemode: <span>${gameMode}</span></p>
                                </div>
                            </div>
                        </div>`;

                        console.log(`display game "${game.timeStamp}" "${game.matchOutcome}"`);
                    } else {
                        moreGames = true;
                    }
                }
            })
            .then(() => {
                this.setDetailedGamesListener();

                if (document.querySelectorAll('.game-summary')[0]) {
                    this.displayDetailedStats(document.querySelectorAll('.game-summary')[0]);

                    document.getElementById('blue-player-table').style.height = 'auto';
                    document.getElementById('orange-player-table').style.height = 'auto';
                    document.getElementById('orange-table').style.display = 'block';
                    document.getElementById('blue-header').style.display = 'flex';
                } else {
                    document.getElementById('blue-player-table').innerHTML = '<div id="nogames" style="">No game to display<br />Change month to see game</div>';
                    document.getElementById('blue-player-table').style.height = '480px';
                    document.getElementById('orange-table').style.display = 'none';
                    document.getElementById('blue-header').style.display = 'none';
                    document.getElementById('right-roundstats').innerHTML = '';
                }

                if (moreGames === true) {
                    loadMore.innerHTML = '<p>More games to display</p><p>Double click to display more</p>';
                } else {
                    loadMore.innerHTML = '<p>No more games to display</p><p>Change month for more games</p>';
                }
            })
    }

    private async getGames(keyRangeIDB, begin: number, end: number): Promise<any> {
        return new Promise<any>(async resolve => {
            const promise = database.readFromIDBRange('savedMatches', 'timeStamp', keyRangeIDB.begin, keyRangeIDB.end, begin, end)
                .then(result => {
                    resolve(result);
                });
        })
    }

    private setDateSelector() {
        const that = this;

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
            let current: string;

            if (settingDiv.id === 'setYear') {
                userTime.year = new Date().getFullYear();
                current = userTime.year.toString();

                for (let i = 0; i < 5; i++) {
                    const year = new Date().getFullYear() - i;

                    settingDiv.querySelector('.custom-options').innerHTML += `<span class="custom-option" settingMode="year" value='${year}'>${year}</span>`;

                    if (year === 2021) {
                        break;
                    }
                }
            }

            if (settingDiv.id === 'setMonth') {
                userTime.month = new Date().getMonth();

                current = monthNames[userTime.month];
            }

            settingDiv.querySelector('.custom-select__trigger span').innerHTML = current;

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

        for (const option of document.querySelectorAll(".custom-option")) {
            option.addEventListener('click', function () {
                const value: string = option.getAttribute('value');
                const mode: string = option.getAttribute('settingMode');

                gameList.innerHTML = '';

                if (!option.classList.contains('selected')) {
                    option.parentNode.querySelector('.custom-option.selected')?.classList.remove('selected');
                    option.classList.add('selected');
                    option.closest('.custom-select').querySelector('.custom-select__trigger span').textContent = option.textContent;
                }

                userTime[mode] = Number(value);
                userTime.unixDate = Math.round(new Date(userTime.year + "." + (monthNames[userTime.month])).getTime() / 1000);

                if (userTime.month !== 11) {
                    userTime.unixEndDate = Math.round(new Date(userTime.year + "." + (monthNames[userTime.month + 1])).getTime() / 1000);
                } else {
                    userTime.unixEndDate = Math.round(new Date([userTime.year - 1] + "." + (monthNames[0])).getTime() / 1000);
                }

                displayedGames.begin = 0;
                displayedGames.end = 10;

                that.printGameList(userTime.unixDate, userTime.unixEndDate, 0, 10, displayedGames.end);

                showAll.classList.remove('active');
            })
        }
    }

    private setDisplayMoreGames() {
        loadMore.addEventListener('click', () => {
            if (showMoreGames === false || (loadMore.classList.contains('more-active') && moreGames === false)) {
                if (!loadMore.classList.contains('more-active')) {
                    loadMore.classList.add('more-active');
                }

                showMoreGames = true;
            } else {
                displayedGames.begin = displayedGames.end;
                displayedGames.end = displayedGames.end + 10;

                const begin: number = displayedGames.begin + 1;
                const end: number = displayedGames.end + 1;

                this.printGameList(userTime.unixDate, userTime.unixEndDate, begin, end, 10);
                loadMore.classList.remove('more-active');

                showMoreGames = false;
            }
        })
    }

    private setDetailedGamesListener() {
        let gameSummary = document.getElementsByClassName('game-summary');

        const that: any = this;

        for (let i = 0; i < gameSummary.length; i++) {
            gameSummary[i].addEventListener('click', function (this: any) {
                that.displayDetailedStats(this);
            })
        }
    }

    private displayDetailedStats(that: any) {
        const keyIDB = Number(that.id);

        document.getElementById('right-roundstats').innerHTML = '';

        console.log(keyIDB);

        const promise = database.readFromIDB('savedMatches', keyIDB, 'timeStamp')
            .then(match => {
                const owId = match.self.id;

                let matchesScoreboardHTMLBlue = '', matchesScoreboardHTMLOrange = '', matchesRoundStatsHTMLHeader = '';

                for (const key in match.matchStats) {
                    if (match.matchStats.hasOwnProperty(key)) {
                        // if ((match.matchStats[key].userTeam === match.self.userTeam && match.self.matchOutcome === 'victory') || (match.matchStats[key].userTeam !== match.self.userTeam && match.self.matchOutcome === 'defeat')) {
                        //     match.matchStats[key].score + 2000;
                        // }

                        let temp;

                        const elementsRank: any = document.getElementsByClassName('th-rank');
                        const elementsLiveScoreboard: any = document.getElementsByClassName('th-liveScoreboard');

                        if (match.matchStats[key].user && match.matchStats[key].liveScoreboard && match.matchStats[key].name) {
                            match.matchStats[key].user.rank = match.matchStats[key].user.rank ? match.matchStats[key].user.rank : 0;

                            temp = `
                                <div class="player-tr" id="${key}">
                                    <div class="stat player-rankImg"><img src="/img/ranks/rank${match.matchStats[key].user.rank}.svg" alt="rank"><span>${match.matchStats[key].user.mmr}</span></div>
                                    <div class="stat player-name">${match.matchStats[key].name}</div>
                                    <div class="stat player-kills">${match.matchStats[key].kills}</div>
                                    <div class="stat player-deaths">${match.matchStats[key].deaths}</div>
                                    <div class="stat player-kd">${kd(match.matchStats[key].kills, match.matchStats[key].deaths)}</div>
                                    <div class="stat player-kpr">${kd(match.matchStats[key].kills, Object.keys(match.roundStats).length)}</div>
                                    <div class="stat player-entry">${match.matchStats[key].liveScoreboard.entreeKills} - ${match.matchStats[key].liveScoreboard.entreeDeaths}</div>
                                    <div class="stat player-kost">${(match.matchStats[key].liveScoreboard.kost * 100).toFixed(0)}%</div>
                                    <div class="stat player-rating">${match.matchStats[key].liveScoreboard.playerRating.toFixed(2)}%</div>
                                    <div class="stat player-score">${match.matchStats[key].score}</div>
                                </div>`;

                            for (let i = 0; i < elementsRank.length; i++) {
                                elementsRank[i].style.display = 'block';
                            }
                            for (let i = 0; i < elementsLiveScoreboard.length; i++) {
                                elementsLiveScoreboard[i].style.display = 'block';
                            }
                        } else if (match.matchStats[key].user && !match.matchStats[key].liveScoreboard && match.matchStats[key].name) {
                            match.matchStats[key].user.rank = match.matchStats[key].user.rank ? match.matchStats[key].user.rank : 0;

                            temp = `
                                <div class="player-tr" id="${key}">
                                    <div class="stat player-rankImg"><img src="/img/ranks/rank${match.matchStats[key].user.rank}.svg" alt="rank"><span>${match.matchStats[key].user.mmr}</span></div>
                                    <div class="stat player-name">${match.matchStats[key].name}</div>
                                    <div class="stat player-kills">${match.matchStats[key].kills}</div>
                                    <div class="stat player-deaths">${match.matchStats[key].deaths}</div>
                                    <div class="stat player-kd">${kd(match.matchStats[key].kills, match.matchStats[key].deaths)}</div>
                                    <div class="stat player-score">${match.matchStats[key].score}</div>
                                </div>`;

                            for (let i = 0; i < elementsRank.length; i++) {
                                elementsRank[i].style.display = 'block';
                            }
                            for (let i = 0; i < elementsLiveScoreboard.length; i++) {
                                elementsLiveScoreboard[i].style.display = 'none';
                            }
                        } else if (!match.matchStats[key].user && match.matchStats[key].name) {
                            temp = `
                                <div class="player-tr" id="${key}">
                                    <div class="stat player-name">${match.matchStats[key].name}</div>
                                    <div class="stat player-kills">${match.matchStats[key].kills}</div>
                                    <div class="stat player-deaths">${match.matchStats[key].deaths}</div>
                                    <div class="stat player-kd">${kd(match.matchStats[key].kills, match.matchStats[key].deaths)}</div>
                                    <div class="stat player-score">${match.matchStats[key].score}</div>
                                </div>`;

                            for (let i = 0; i < elementsRank.length; i++) {
                                elementsRank[i].style.display = 'none';
                            }
                            for (let i = 0; i < elementsLiveScoreboard.length; i++) {
                                elementsLiveScoreboard[i].style.display = 'none';
                            }
                        } else {
                            temp = '';
                        }

                        if (match.matchStats[key].team === "Orange") {
                            matchesScoreboardHTMLOrange += temp;
                        } else {
                            matchesScoreboardHTMLBlue += temp;
                        }
                    }
                }

                document.getElementById('orange-player-table').innerHTML = matchesScoreboardHTMLOrange;
                document.getElementById('blue-player-table').innerHTML = matchesScoreboardHTMLBlue;

                if (match.self.userTeam === 'Orange') {
                    document.getElementById('blue-table').before(document.getElementById('orange-table'));
                } else {
                    document.getElementById('orange-table').before(document.getElementById('blue-table'));
                }

                for (const key in match.roundStats) {
                    if (match.roundStats.hasOwnProperty(key)) {
                        let matchesRoundStatsHTMLOrange = '', matchesRoundStatsHTMLBlue = '', killsArray: any = [], aceBadge: string | boolean = false, spectating = [], survided = [], died = [], roundOutcome;

                        if (typeof match.roundStats[key].roundOutcome != 'undefined') {
                            roundOutcome = match.roundStats[key].roundOutcome;
                        } else {
                            roundOutcome = 'unknown';
                        }

                        matchesRoundStatsHTMLHeader = `
                            <div id="round-${key}" class="rounds-stats">
                                <h1>Round<span>${key}</span></h1>
                                <p class="round-${roundOutcome}">${roundOutcome.toUpperCase()}</p>
                                <div id="player-round-stats-${key}" class="round-stats"></div>
                            </div>`;

                        document.getElementById('right-roundstats').innerHTML += matchesRoundStatsHTMLHeader;

                        for (const player in match.roundStats[key]) {
                            if (match.roundStats[key].hasOwnProperty(player)) {
                                if (player !== 'roundOutcome' && match.roundStats[key][player].name) {
                                    let roundOperator = match.roundStats[key][player].operator, operatorImg: string;

                                    killsArray.push(match.roundStats[key][player].kills);

                                    if (roundOperator === 0 || roundOperator === undefined) {
                                        operatorImg = 'https://cdn3.iconfinder.com/data/icons/account-1/64/Account-06-512.png';
                                    } else {
                                        operatorImg = 'https://api.statsdb.net/r6/assets/operators/' + operators[roundOperator].operator_name.toLowerCase() + '/badge';
                                    }

                                    if (match.roundStats[key][player].kills === 5) {
                                        aceBadge = player;
                                    }

                                    if (match.roundStats[key][player].deaths === 0 && match.roundStats[key][player].score === 0) {
                                        spectating.push(player);
                                    }
                                    if (match.roundStats[key][player].deaths === 0 && match.roundStats[key][player].score > 0) {
                                        survided.push(player);
                                    }
                                    if (match.roundStats[key][player].deaths > 0) {
                                        died.push(player)
                                    }

                                    const playerRound = `
                                        <div id="player-${player}" class="player-round-stats">
                                            <img src="${operatorImg}">
                                            <div class="player-stats">
                                                <div class="stat-div">
                                                    <div><span>${match.roundStats[key][player].name}</span></div>
                                                    <div id="badge-${key}-${player}" class="badge-container">

                                                    </div>
                                                </div>
                                                <div class="stat-div">
                                                    <div>kills: <span>${match.roundStats[key][player].kills}</span></div>
                                                    <div>deaths: <span>${match.roundStats[key][player].deaths}</span></div>
                                                    <div>k/d: <span>${kd(match.roundStats[key][player].kills, match.roundStats[key][player].deaths)}</span></div>
                                                    <div>score: <span>${match.roundStats[key][player].score}</span></div>
                                                </div>
                                            </div>
                                        </div>`;

                                    if (match.roundStats[key][player].team === 'Orange') {
                                        matchesRoundStatsHTMLOrange += playerRound;
                                    } else {
                                        matchesRoundStatsHTMLBlue += playerRound;
                                    }
                                }
                            }
                        }

                        if (match.self.userTeam === 'Orange') {
                            document.getElementById('player-round-stats-' + key).innerHTML = matchesRoundStatsHTMLOrange + matchesRoundStatsHTMLBlue;
                        } else {
                            document.getElementById('player-round-stats-' + key).innerHTML = matchesRoundStatsHTMLBlue + matchesRoundStatsHTMLOrange;
                        }

                        var indexes = getAllIndexes(killsArray, killsArray.reduce((a: number, b: number) => { return Math.max(a, b) }));

                        setTagLoop(spectating, key, 'spectating', 'Spectating');
                        setTagLoop(survided, key, 'survided', 'Survided');
                        setTagLoop(died, key, 'died', 'Died');

                        if (aceBadge) {
                            document.getElementById(`badge-${key}-${aceBadge}`).innerHTML += `
                                <div class="badge-ace badge">
                                    ACE
                                <div>
                            `;
                        }

                        setTagLoop(indexes, key, 'kills', 'K/D');
                    }
                }
            })
    }

    private setShowAllBtn() {
        showAll.addEventListener('click', () => {
            if (!showAll.classList.contains('active')) {
                gameList.innerHTML = '';

                userTime.unixDate = null;
                userTime.unixEndDate = Math.round(new Date().getTime() / 1000);

                displayedGames.begin = 0;
                displayedGames.end = 10;

                this.printGameList(userTime.unixDate, userTime.unixEndDate, 0, 10, displayedGames.end);

                showAll.classList.add('active');
            }
        })
    }

    private setToggleHotkeyBehavior() {
        const toggleInGameWindow = async hotkeyResult => {
            console.log(`pressed hotkey "${hotkeyResult.featureId}"`);

            if (mode !== 'desktop') {
                const inGameState = await this.getWindowState();
                if (inGameState.window_state === 'normal' || inGameState.window_state === 'maximized') {
                    this.currWindow.minimize();
                } else if (inGameState.window_state === 'minimized' || inGameState.window_state === 'closed') {
                    this.currWindow.restore();
                }

                owWindow.changeWindowLocation('center-center', 'statistics_in_game');
            }
        }

        OWHotkeys.onHotkeyDown(hotkeys.toggle, toggleInGameWindow);
    }
}

overwolf.windows.getOpenWindows(data => {
    const windows = Object.keys(data);

    if (windows.includes('website_desktop') || windows.includes('website_in_game')) {
        mode2 = 'website';
    } else {
        mode2 = 'statistics';
    }

    if (windows.includes('in_lobby_desktop_only') || windows.includes('in_game_desktop_only') || windows.includes('desktop')) {
        mode = 'desktop';

        if (mode2 === 'website') {
            owWindow = new OWWindow(windowNames.websiteDesktopOnly);
        } else {
            owWindow = new OWWindow(windowNames.statisticsDesktopOnly);
        }
    } else {
        if (mode2 === 'website') {
            owWindow = new OWWindow(windowNames.website);
        } else {
            owWindow = new OWWindow(windowNames.statistics);
        }
    }

    if (mode2 === 'website') {
        Statistics.instance('website');
    } else {
        Statistics.instance('statistics');
    }
});