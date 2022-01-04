import { AppWindow } from '../AppWindow';
import { OWGamesEvents } from '../../odk-ts/ow-games-events';
import { OWHotkeys } from '../../odk-ts/ow-hotkeys';
import { OWWindow } from '../../odk-ts/ow-window';
import { Database } from '../../odk-ts/database';
import { Controllers } from '../../odk-ts/controllers';
import { Localstorage } from '../../odk-ts/localstorage';
import { PlayerCompare } from '../../odk-ts/player-compare';
import { Match } from '../../odk-ts/match';
const chroma = require('chroma-js');
import { interestingFeatures1, hotkeys, windowNames, gameModesPVE } from '../../consts';

const blueTeamDiv = document.getElementById('team-blue');
const orangeTeamDiv = document.getElementById('team-orange');
const blueTeamDivLive = document.getElementById('team-blue-live');
const orangeTeamDivLive = document.getElementById('team-orange-live');
const compareTeamDiv = document.getElementById('team-compare-div');
const compareTeamDivLive = document.getElementById('team-compare-div-live');
const navBtn = document.getElementsByClassName('nav-btn');
const mainTabs = ['season', 'ranked', 'casual', 'live scoreboard', 'search player'];
const table = document.getElementsByClassName("player-tr");
const backBtn = document.getElementById('detailed-back-btn');

let count = 0, matchStats: any = {}, matchOutcome: string, roundsStats: any = {}, roundNumber: number, self: any = {}, currentTab: string, windowId: string, owWindow: OWWindow, countPlayers = -1, detailedstatus = false, matchData, players = {}, circleStats: any, entreeKill: boolean = false, entreeDeath: boolean = false, lastBlueKill: any = {}, lastOrangeKill: any = {}, blueDeaths: number = 0, orangeDeaths: number = 0, defuse: any = {};

if (localStorage.desktopOnly === '"0"') {
    owWindow = new OWWindow(windowNames.inGame);
} else {
    owWindow = new OWWindow(windowNames.inGameDesktopOnly);
}

const controllers = new Controllers();
const database = new Database();
const localstorage = new Localstorage();
const playerCompare = new PlayerCompare();

owWindow.minimize();

const promise1 = localstorage.initiateLocalStorage()
    .then(() => controllers.setTheme());

if (localStorage.desktopOnly === '"0"') {
    windowId = 'in_game';
} else {
    windowId = 'in_game_desktop_only';
}

const valuesCustom = JSON.parse(localStorage.valuesTable);

// Remove this in the future. Added in 1.5.0.0
Object.keys(valuesCustom).forEach(e => {
    valuesCustom[e] = valuesCustom[e] === 'Hacker %' || valuesCustom[e] === 'Country' ? 'Empty' : valuesCustom[e];
});
localStorage.valuesTable = JSON.stringify(valuesCustom);

const local = JSON.parse(localStorage.settings);

for (let i = 0; i < Object.keys(valuesCustom).length; i++) {
    const playerTableThs = document.querySelectorAll('.value-' + i);

    for (let j = 0; j < playerTableThs.length; j++) {
        playerTableThs[j].innerHTML = valuesCustom[i];
    }
}

let statsNavBtn = document.getElementsByClassName('sec-nav-btn');

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

class InGame extends AppWindow {
    private static _instance: InGame;
    private _rainbowGameEventsListener: OWGamesEvents;
    private _eventsLog: HTMLElement;
    private _infoLog: HTMLElement;
    private profileId: string;
    private profileName: string;
    private gameMode: string;
    private matchId: string;
    private mapId: string;

    private constructor() {
        if (localStorage.desktopOnly === '"0"') {
            super(windowNames.inGame, 'ingame');

            const promise = owWindow.scaleWindow('in_game', 1600, 900, JSON.parse(localStorage.scaleSlider))
                .then(() => owWindow.changeWindowLocation('center-center', 'in_game'));

            if (local.maximize === '1') {
                owWindow.restore();
            }
        } else {
            super(windowNames.inGameDesktopOnly, 'desktop');

            owWindow.scaleWindow('in_game_desktop_only', 1600, 900, JSON.parse(localStorage.scaleSlider));
            owWindow.restore();
        }

        this.setToggleHotkeyBehavior();
        this.setTableTabDefault();
        this.setTableTabSelector();
        this.setHotkeyText();
        this.setOwKeyListener();
        this.setDetailedBackBtn();

        overwolf.games.events.getInfo(function (info) {
            that.setThisValue(info.res.me.account_id, 'profileId');
            that.setThisValue(info.res.me.name, 'profileName');
            that.setThisValue(info.res.match_info.match_id, 'matchId');
            that.setThisValue(info.res.match_info.game_mode, 'gameMode');

            matchData = new Match(info.res.match_info.game_mode, info.res.match_info.match_id);
        })

        this._rainbowGameEventsListener = new OWGamesEvents({
            onInfoUpdates: this.onInfoUpdates.bind(this),
            onNewEvents: this.onNewEvents.bind(this)
        }, interestingFeatures1);

        const promise = database.initAllIDB()
            .then(() => database.displayDailyWeekly())
            .then(result => circleStats = result);

        const that: any = this;
    }

    public static instance() {
        if (!this._instance) {
            this._instance = new InGame();
        }

        return this._instance;
    }

    public run() {
        this._rainbowGameEventsListener.start();
    }

    private onInfoUpdates(info) {
        if ('round' in info) {
            if (!isNaN(info.round.number)) {
                console.log(`roundNumber "${info.round.number}"`);

                roundNumber = info.round.number;

                overwolf.games.events.getInfo(function (info) {
                    matchData.setMapId(info.res.match_info.map_id);

                    console.log(info.res.match_info.map_id);
                })
            }
        }

        if ('players' in info && (info.players.roster_0 != null || Object.values(info.players)[0] != null)) {
            for (let i = 0; i < Object.keys(info.players).length; i++) {
                if (Object.values(info.players)[i] !== null) {
                    const statsRaw = Object.values(info.players)[i];
                    const stats = JSON.parse(JSON.parse(JSON.stringify(statsRaw)));
                    const id = Object.keys(info.players)[i].substr(7);

                    if (this.profileName === stats.name) {
                        self.userTeam = stats.team;
                        self.id = id;
                        self.name = stats.name;

                        if (self.userTeam === 'Blue') {
                            compareTeamDiv.before(blueTeamDiv);
                            compareTeamDiv.after(orangeTeamDiv);
                            compareTeamDivLive.before(blueTeamDivLive);
                            compareTeamDivLive.after(orangeTeamDivLive);

                            if (gameModesPVE.includes(this.gameMode)) {
                                blueTeamDiv.style.display = 'block';
                                orangeTeamDiv.style.display = 'none';
                                blueTeamDivLive.style.display = 'block';
                                orangeTeamDivLive.style.display = 'none';

                                console.log(`displayed team "blue"`);
                            }
                        } else if (self.userTeam === 'Orange') {
                            compareTeamDiv.before(orangeTeamDiv);
                            compareTeamDiv.after(blueTeamDiv);
                            compareTeamDivLive.before(orangeTeamDivLive);
                            compareTeamDivLive.after(blueTeamDivLive);

                            if (gameModesPVE.includes(this.gameMode)) {
                                blueTeamDiv.style.display = 'none';
                                orangeTeamDiv.style.display = 'block';
                                blueTeamDivLive.style.display = 'none';
                                orangeTeamDivLive.style.display = 'block';

                                console.log(`displayed team "orange"`);
                            }
                        }
                    }

                    if (!roundsStats[roundNumber]) {
                        roundsStats[roundNumber] = {};
                    }

                    if (!roundsStats[roundNumber][id]) {
                        roundsStats[roundNumber][id] = {};
                    }

                    if (!roundsStats[roundNumber][id].entreeKills) {
                        roundsStats[roundNumber][id].entreeKills = false;
                    }

                    if (!roundsStats[roundNumber][id].entreeDeaths) {
                        roundsStats[roundNumber][id].entreeDeaths = false;
                    }

                    if (!roundsStats[roundNumber][id].tradedKill) {
                        roundsStats[roundNumber][id].tradedKills = 0;
                    }

                    if (!roundsStats[roundNumber][id].clutchKills) {
                        roundsStats[roundNumber][id].clutchKills = 0;
                    }

                    if (!roundsStats[roundNumber][id].teamKills) {
                        roundsStats[roundNumber][id].teamKills = 0;
                    }

                    if (!roundsStats[roundNumber][id].defuse) {
                        roundsStats[roundNumber][id].defuse = 0;
                    }

                    if (!defuse[id]) {
                        defuse[id] = {};

                        defuse[id].firstPoints = false;
                        defuse[id].secondPoints = false;
                    }

                    if (roundsStats[roundNumber][id].kills !== stats.kills && stats.kills !== 0) {
                        const time = Date.now();

                        if (stats.team === 'Blue') {
                            console.log(time - lastOrangeKill.time);
                            console.log((time - lastOrangeKill.time) < 5000);

                            if ((time - lastOrangeKill.time) < 5000) {
                                roundsStats[roundNumber][id].tradedKills++;

                                console.log(roundsStats[roundNumber][id].tradedKills);
                            }

                            lastBlueKill.time = time;
                            lastBlueKill.killerId = id;

                            if (blueDeaths === 4) {
                                roundsStats[roundNumber][id].clutchKills++;
                            }
                        } else if (stats.team === 'Orange') {
                            console.log(time - lastBlueKill.time);
                            console.log((time - lastBlueKill.time) < 5000);

                            if ((time - lastBlueKill.time) < 5000) {
                                roundsStats[roundNumber][id].tradedKills++;

                                console.log(roundsStats[roundNumber][id].tradedKills);
                            }

                            lastOrangeKill.time = time;
                            lastOrangeKill.killerId = id;

                            if (orangeDeaths === 4) {
                                roundsStats[roundNumber][id].clutchKills++;
                            }
                        }
                    }

                    if (roundsStats[roundNumber][id].deaths !== stats.deaths && stats.deaths !== 0) {
                        if (stats.team === 'Blue') {
                            blueDeaths++;
                        } else if (stats.team === 'Orange ') {
                            orangeDeaths++;
                        }
                    }

                    if (!roundsStats[roundNumber].roundOutcome && (roundsStats[roundNumber][id].score - stats.score) === 100) {
                        roundsStats[roundNumber][id].teamKills++;

                        console.log(roundsStats[roundNumber][id].teamKills);
                    }

                    if (!roundsStats[roundNumber].roundOutcome && (stats.score - roundsStats[roundNumber][id].score) === 100) {
                        if (defuse[id].firstPoints === false) {
                            defuse[id].time = Date.now();
                            defuse[id].firstPoints = true;
                        } else if (defuse[id].firstPoints === true) {
                            if ((Date.now() - defuse[id].time) < 100) {
                                defuse[id].secondPoints = true;
                            } else {
                                defuse[id].secondPoints = false;
                                defuse[id].firstPoints = false;
                            }
                        }
                    }

                    //if (!roundsStats[roundNumber].roundOutcome) {
                    //    roundsStats[roundNumber][id].team = stats.team;
                    //    roundsStats[roundNumber][id].kills = stats.kills;
                    //    roundsStats[roundNumber][id].deaths = stats.deaths;
                    //    roundsStats[roundNumber][id].operator = stats.operator;
                    //    roundsStats[roundNumber][id].health = stats.health;
                    //    roundsStats[roundNumber][id].defuser = stats.defuser;
                    //    roundsStats[roundNumber][id].headshots = stats.headshots;
                    //    roundsStats[roundNumber][id].is_local = stats.is_local;
                    //}

                    roundsStats[roundNumber][id].kills = !roundsStats[roundNumber][id].kills ? 0 : roundsStats[roundNumber][id].kills;
                    roundsStats[roundNumber][id].deaths = !roundsStats[roundNumber][id].deaths ? 0 : roundsStats[roundNumber][id].deaths;
                    roundsStats[roundNumber][id].score = !roundsStats[roundNumber][id].score ? 0 : roundsStats[roundNumber][id].score;
                    roundsStats[roundNumber][id].operator = !roundsStats[roundNumber][id].operator ? 0 : roundsStats[roundNumber][id].operator;
                    roundsStats[roundNumber][id].health = !roundsStats[roundNumber][id].health ? 0 : roundsStats[roundNumber][id].health;
                    roundsStats[roundNumber][id].defuser = !roundsStats[roundNumber][id].defuser ? 0 : roundsStats[roundNumber][id].defuser;
                    roundsStats[roundNumber][id].headshots = !roundsStats[roundNumber][id].headshots ? 0 : roundsStats[roundNumber][id].headshots;

                    roundsStats[roundNumber][id].name = stats.name;
                    roundsStats[roundNumber][id].is_local = stats.is_local;
                    roundsStats[roundNumber][id].team = stats.team;
                    roundsStats[roundNumber][id].kills = stats.kills !== 0 ? stats.kills : roundsStats[roundNumber][id].kills;
                    roundsStats[roundNumber][id].deaths = stats.deaths !== 0 ? stats.deaths : roundsStats[roundNumber][id].deaths;
                    roundsStats[roundNumber][id].score = stats.score !== 0 ? stats.score : roundsStats[roundNumber][id].score;
                    roundsStats[roundNumber][id].operator = stats.operator !== 0 ? stats.operator : roundsStats[roundNumber][id].operator;
                    roundsStats[roundNumber][id].health = stats.health !== 0 ? stats.health : roundsStats[roundNumber][id].health;
                    roundsStats[roundNumber][id].defuser = stats.defuser !== 0 ? stats.defuser : roundsStats[roundNumber][id].defuser;
                    roundsStats[roundNumber][id].headshots = stats.headshots !== 0 ? stats.headshots : roundsStats[roundNumber][id].headshots;

                    if (!roundsStats[roundNumber].roundOutcome && entreeKill === false && stats.kills !== 0) {
                        roundsStats[roundNumber][id].entreeKills = true;
                        entreeKill = true;
                    }

                    if (!roundsStats[roundNumber].roundOutcome && entreeDeath === false && stats.deaths !== 0) {
                        roundsStats[roundNumber][id].entreeDeaths = true;
                        entreeDeath = true;
                    }

                    if (stats.kills !== 0 || stats.defuser !== 0) {
                        roundsStats[roundNumber][id].kostpoint = true;
                    }

                    if (!document.getElementById(id)) {
                        const promise = matchData.playerJoin(id, stats, info)
                            .then(data => {
                                if (data) {
                                    players = JSON.parse(JSON.stringify(data));
                                }

                                playerCompare.calculateTeamStats(players, self.userTeam);
                                controllers.setTableTab(currentTab);
                                this.updateLive(id);
                                this.setDetailedOnClick();
                            })
                    } else {
                        this.updateLive(id);
                    }

                    console.log(`playerUpdate "${statsRaw}"`);
                }
            }
        } else if ('players' in info) {
            for (let i = 0; i < Object.keys(info.players).length; i++) {
                const id = Object.keys(info.players)[i].substr(7);

                delete matchStats[id];

                const promise = matchData.playerLeave(id)
                    .then((data) => {
                        if (data) {
                            players = JSON.parse(JSON.stringify(data));
                        }
                        playerCompare.calculateTeamStats(players, self.userTeam);
                    })

                console.log(`playerLeft "${id}"`);
            }
        }
    }

    private onNewEvents(eventInfo) {
        if ('events' in eventInfo && eventInfo.events[0].name === 'roundOutcome' && (this.gameMode === 'MATCHMAKING_PVP' || this.gameMode === 'MATCHMAKING_PVP_RANKED' || this.gameMode === 'MATCHMAKING_PVP_UNRANKED' || this.gameMode === 'CUSTOMGAME_PVP_DEDICATED')) {
            let wonTeam: string;

            roundsStats[roundNumber].roundOutcome = eventInfo.events[0].data;

            entreeKill = false;
            entreeDeath = false;

            if (roundsStats[roundNumber].roundOutcome === 'victory') {
                wonTeam = self.userTeam;
            } else if (roundsStats[roundNumber].roundOutcome === 'defeat' && self.userTeam === 'Orange') {
                wonTeam = 'Blue';
            } else {
                wonTeam = 'Orange';
            }

            for (const id in roundsStats[roundNumber]) {
                if (roundsStats[roundNumber][id].team === wonTeam && defuse[id].firstPoints === true && defuse[id].secondPoints === true) {
                    roundsStats[roundNumber][id].defuse++;
                }
            }

            console.log("------------------    ROUND OUTCOME    ------------------");

            const promise = database.initAllIDB()
                .then(() => this.setMatchStats())
                .then(() => setTimeout(function () { matchData.storeMatchData(matchStats, matchOutcome, roundsStats, self); }, 200));
        }

        if ('events' in eventInfo && eventInfo.events[0].name === 'matchOutcome' && (this.gameMode === 'MATCHMAKING_PVP' || this.gameMode === 'MATCHMAKING_PVP_RANKED' || this.gameMode === 'MATCHMAKING_PVP_UNRANKED' || this.gameMode === 'CUSTOMGAME_PVP_DEDICATED')) {
            matchOutcome = eventInfo.events[0].data;

            console.log("------------------    MATCH OUTCOME    ------------------");

            owWindow.minimize();
            const promise = database.initAllIDB()
                .then(() => this.setMatchStats())
                .then(() => setTimeout(function () { matchData.storeMatchData(matchStats, matchOutcome, roundsStats, self); }, 200));
        }

        console.log(`infoEvent "${eventInfo.events[0].name}" "${eventInfo.events[0].data}"`);
    }

    private updateLive(id) {
        let kills = 0, deaths = 0, score = 0, entreeKills = 0, entreeDeaths = 0, rounds = 0, kostpoints = 0, fRounds = 0, tradedKills = 0, clutches = 0, plants = 0, teamKills = 0, wonTeam: string, teamKill = false;

        const lastRound = Object.keys(roundsStats).pop();
        const currentPlayerName = roundsStats[lastRound][id].name;

        for (const round in roundsStats) {
            const roundStats = roundsStats[round][id];

            if (roundStats.name === currentPlayerName) {
                kills += isNaN(roundStats.kills) ? 0 : roundStats.kills;
                tradedKills += isNaN(roundStats.tradedKills) ? 0 : roundStats.tradedKills;
                deaths += isNaN(roundStats.deaths) ? 0 : roundStats.deaths;
                score += isNaN(roundStats.score) ? 0 : roundStats.score;
                teamKills += isNaN(roundStats.teamKills) ? 0 : roundStats.teamKills;
                plants = isNaN(roundStats.defuser) ? 0 : roundStats.defuser;

                if (roundStats.entreeKills === true) {
                    entreeKills++;
                }

                if (roundStats.entreeDeaths === true) {
                    entreeDeaths++;
                }

                if (roundStats.teamKills !== 0) {
                    teamKill = true;
                }

                if (roundsStats[round].roundOutcome) {
                    if (roundsStats[round].roundOutcome === 'victory') {
                        wonTeam = self.userTeam;
                    } else if (roundsStats[round].roundOutcome === 'defeat' && self.userTeam === 'Orange') {
                        wonTeam = 'Blue';
                    } else {
                        wonTeam = 'Orange';
                    }

                    if (roundStats.clutchKills !== 0 && roundStats.team === wonTeam) {
                        clutches++;
                    }

                    if (roundStats.kostpoint === true || (roundStats.team === wonTeam && roundStats.deaths === 0)) {
                        kostpoints++;
                    }

                    fRounds++;
                }

                rounds++;
            }
        }

        const kpr = rounds === 0 ? 0 : kills / rounds;
        const srv = rounds === 0 ? 0 : (rounds - deaths) / rounds;
        const kost = fRounds === 0 ? 0 : kostpoints / fRounds;
        const playerRating = ((0.011 * entreeKills) - (0.016 * tradedKills) + (0.714 * kpr) + (0.492 * srv) + (0.471 * kost) + (0.029 * clutches) + (0.034 * plants) + (0.019 * 0) - (0.022 * teamKills));
        //const playerRating = ((0.011 * entreeKills) - (0.016 * tradedKills) + (0.714 * kpr) + (0.492 * srv) + (0.471 * kost) + (0.029 * clutches) + (0.034 * plants) + (0.019 * DEFUSE) - (0.022 * teamkills)) + 0.1;
        const ratingColor = chroma.scale(['red', 'yellow', '#90ee00', 'green']).domain([-0, 0.8, 1, 3]);

        if (matchStats[id]) {
            matchStats[id].liveScoreboard = {
                'entreeKills': entreeKills,
                'entreeDeaths': entreeDeaths,
                'tradedKills': tradedKills,
                'clutches': clutches,
                'kpr': kpr,
                'srv': srv,
                'kost': kost,
                'playerRating': playerRating
            }
        }

        if (teamKill) {
            document.getElementById('tKD' + id).style.display = 'block';
        }

        document.getElementById(`live0${id}`).style.color = `rgb(${ratingColor(playerRating)._rgb[0]}, ${ratingColor(playerRating)._rgb[1]}, ${ratingColor(playerRating)._rgb[2]}`;
        document.getElementById(`live0${id}`).innerHTML = playerRating.toFixed(2).toString();
        document.getElementById(`live1${id}`).innerHTML = entreeKills.toString() + ' - ' + entreeDeaths.toString();
        document.getElementById(`live2${id}`).innerHTML = tradedKills.toString();
        document.getElementById(`live3${id}`).innerHTML = clutches.toString();
        document.getElementById(`live4${id}`).innerHTML = kpr.toFixed(2);
        document.getElementById(`live5${id}`).innerHTML = (srv * 100).toFixed(0) + '%';
        document.getElementById(`live6${id}`).innerHTML = (kost * 100).toFixed(0) + '%';
        document.getElementById(`live7${id}`).innerHTML = kills.toString();
        document.getElementById(`live8${id}`).innerHTML = deaths.toString();
        document.getElementById(`live9${id}`).innerHTML = score.toString();
    }

    private setMatchStats() {
        const latestRound = roundsStats[Object.keys(roundsStats).reverse()[0]];

        for (const owPlayerId in latestRound) {
            if (latestRound.hasOwnProperty(owPlayerId) && owPlayerId !== 'roundOutcome') {
                matchStats[owPlayerId] = {};
                matchStats[owPlayerId].kills = 0;
                matchStats[owPlayerId].deaths = 0;
                matchStats[owPlayerId].score = 0;

                if (!matchStats[owPlayerId].user) {
                    matchStats[owPlayerId].user = {};
                }

                if (players) {
                    if (players[owPlayerId].user.countryCode) {
                        matchStats[owPlayerId].user.country = players[owPlayerId].user.countryCode;
                    }
                    if (players[owPlayerId].stats.progression.level) {
                        matchStats[owPlayerId].user.level = players[owPlayerId].stats.progression.level;
                    }
                    if (players[owPlayerId].stats.rank.rank) {
                        matchStats[owPlayerId].user.rank = players[owPlayerId].stats.rank.rank;
                    }
                    if (players[owPlayerId].stats.rank.mmr) {
                        matchStats[owPlayerId].user.mmr = players[owPlayerId].stats.rank.mmr;
                    }
                }
            }
        }

        for (const round in roundsStats) {
            if (roundsStats.hasOwnProperty(round)) {
                const roundStats = roundsStats[round];

                for (const owPlayerId in roundStats) {
                    if (roundStats.hasOwnProperty(owPlayerId) && owPlayerId !== 'roundOutcome') {
                        const owPlayerStats = roundStats[owPlayerId];

                        if (!matchStats[owPlayerId]) {
                            matchStats[owPlayerId] = {};
                        }

                        matchStats[owPlayerId].name = owPlayerStats.name;
                        matchStats[owPlayerId].team = owPlayerStats.team;
                        matchStats[owPlayerId].kills += owPlayerStats.kills;
                        matchStats[owPlayerId].deaths += owPlayerStats.deaths;
                        matchStats[owPlayerId].score += owPlayerStats.score;
                    }
                }
            }
        }
    }

    private setThisValue(value: string, key: string) {
        this[key] = value;
    }

    private setDetailedOnClick() {
        const playerButton = document.getElementsByClassName('player-tr');

        for (let i = 0; i < playerButton.length; i++) {
            playerButton[i].addEventListener('click', function (this: any) {
                matchData.printDetailedPlayer(this);

                detailedstatus = controllers.showDetailedPlayer(false);
            })
        }
    }

    private setHotkeyText() {
        controllers.setShortcutText(document.getElementById('shortcut-text'));

        overwolf.settings.hotkeys.onChanged.addListener(() => {
            controllers.setShortcutText(document.getElementById('shortcut-text'));
        })
    }

    private setTableTabDefault() {
        count = local.table;

        for (var i = 0; i < navBtn.length; i++) {
            navBtn[i].classList.remove('active');

            if (count == i) {
                navBtn[i].classList.add('active')
            }
        }

        currentTab = mainTabs[count];
        controllers.setTableTab(currentTab);
    }

    private setTableTabSelector() {
        for (let i = 0; i < navBtn.length; i++) {
            navBtn[i].addEventListener('click', function (this: any) {
                currentTab = this.innerText.toLowerCase();

                for (i = 0; i < navBtn.length; i++) {
                    navBtn[i].classList.remove('active');
                }

                this.classList.add('active');
                controllers.setTableTab(currentTab);
            })
        }
    }

    private setOwKeyListener() {
        overwolf.games.inputTracking.onKeyDown.addListener(event => {
            if (event.key === '40' || event.key === '38' || event.key === '13') {
                const playerAmount = document.getElementsByClassName('player-tr');
                const countPlayersMax = playerAmount.length - 1;

                for (let i = 0; i < table.length; i++) {
                    table[i].classList.remove('selected');
                }

                if (event.key === '13') {
                    if (detailedstatus === false) {
                        detailedstatus = false;
                        matchData.printDetailedPlayer(table[countPlayers]);
                    } else {
                        detailedstatus = true;
                    }

                    detailedstatus = controllers.showDetailedPlayer(detailedstatus);
                } else if (event.key === '40') {
                    if (countPlayers === countPlayersMax) {
                        countPlayers = 0;
                    } else {
                        countPlayers++;
                    }

                    if (detailedstatus === true) {
                        matchData.printDetailedPlayer(table[countPlayers]);
                    }
                } else if (event.key === '38') {
                    if (countPlayers === 0) {
                        countPlayers = countPlayersMax;
                    } else {
                        countPlayers--;
                    }

                    if (detailedstatus === true) {
                        matchData.printDetailedPlayer(table[countPlayers]);
                    }
                }

                if (table[countPlayers]) {
                    table[countPlayers].classList.add('selected');
                }
            }

            if (event.key === '39' || event.key === '37') {
                if (event.key === '39') {
                    if (count === 4) {
                        count = 0;
                    } else {
                        count++
                    }
                } else if (event.key === '37') {
                    if (count === 0) {
                        count = 4;
                    } else {
                        count--
                    }
                }

                currentTab = mainTabs[count];

                for (var i = 0; i < navBtn.length; i++) {
                    navBtn[i].classList.remove('active');
                    if (count === i) {
                        navBtn[i].classList.add('active')
                    }
                }

                controllers.setTableTab(currentTab);
            }
        })
    }

    private setDetailedBackBtn() {
        backBtn.addEventListener('click', function () {
            detailedstatus = controllers.showDetailedPlayer(true);
        })
    }

    private setToggleHotkeyBehavior() {
        const toggleInGameWindow = async hotkeyResult => {
            console.log(`pressed hotkey "${hotkeyResult.featureId}"`);

            if (localStorage.desktopOnly === '"0"') {
                const inGameState = await this.getWindowState();
                if (inGameState.window_state === 'normal' || inGameState.window_state === 'maximized') {
                    this.currWindow.minimize();
                } else if (inGameState.window_state === 'minimized' || inGameState.window_state === 'closed') {
                    this.currWindow.restore();
                }

                detailedstatus = controllers.showDetailedPlayer(true);

                for (let i = 0; i < table.length; i++) {
                    table[i].classList.remove('selected');
                }
                countPlayers = -1;

                owWindow.changeWindowLocation('center-center', windowId);

                overwolf.windows.close(windowNames.statistics, () => {
                    console.log('close window' + windowNames.statistics);
                });
                overwolf.windows.close(windowNames.website, () => {
                    console.log('close window' + windowNames.website);
                });
                overwolf.windows.close(windowNames.website, () => {
                    console.log('close window' + windowNames.inLobby);
                });
            } else {
                owWindow.changeWindowSize('in_game_desktop_only', 1600, 900);
            }
        }

        OWHotkeys.onHotkeyDown(hotkeys.toggle, toggleInGameWindow);
    }
}

InGame.instance().run();