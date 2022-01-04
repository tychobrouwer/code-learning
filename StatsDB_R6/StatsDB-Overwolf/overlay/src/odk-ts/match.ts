import { Database } from './database';
import { seasonColors, rankOffset } from '../consts';

let players: any = {};
let date = new Date();

export class Match {
    private database: Database;
    private gameMode: string;
    private timeStamp: number;
    private matchId: string;
    private mapId: string;

    constructor(gameMode: string, matchId: string) {
        this.database = new Database();
        this.gameMode = gameMode;
        this.matchId = matchId;
        this.timeStamp = Math.round(new Date().getTime() / 1000);

        console.log(this.matchId);
    }

    public setMapId(mapId: string) {
        this.mapId = mapId;
    }

    public async playerJoin(id: string, stats, info): Promise<any> {
        const that = this;

        return new Promise<any>(async resolve => {
            const promise = that.playerSearch(id, stats, info)
                .then(() => {
                    that.addPlayer(id, stats);

                    resolve(players);
                })
        })
    }

    private async playerSearch(id: string, stats, info): Promise<void> {
        const that = this;
        date = new Date();
        // @ts-ignore
        let token = generateAuthToken(Math.round(date.getTime() / 1000))

        // this.sendPlayerPing(stats.name, stats.team, this.matchId);

        return new Promise<void>(async resolve => {
            const url = `https://api.statsdb.net/r6/overlay/${stats.name}`;

            that.fetch(url, { cache: 'no-cache', headers: { 'X-API-KEY': token } }, 10)
                .then(result => {
                    if ('payload' in result) {
                        players[id] = result.payload;
                        players[id].team = stats.team;

                        players[id].stats.rank.matchesplayed = players[id].stats.rank.wins + players[id].stats.rank.losses;

                        if (players[id].stats.rank.max_mmr === 0) {
                            players[id].stats.rank.max_mmr = players[id].stats.rank.mmr;
                        }

                        if (players[id].stats.rank.rank === 0) {
                            players[id].stats.rank.previous_rank = players[id].stats.rank.rank;
                        } else {
                            players[id].stats.rank.previous_rank = players[id].stats.rank.rank - 1;
                        }

                        if (players[id].stats.rank.rank === 23 || players[id].stats.rank.rank === 0) {
                            players[id].stats.rank.next_rank = players[id].stats.rank.rank;
                        } else {
                            players[id].stats.rank.next_rank = players[id].stats.rank.rank + 1;
                        }

                        players[id].stats.rank.kd = ~~Math.round(players[id].stats.rank.kills / players[id].stats.rank.deaths * 100) / 100;
                        players[id].stats.ranked.kd = ~~Math.round(players[id].stats.ranked.kills / players[id].stats.ranked.deaths * 100) / 100;
                        players[id].stats.casual.kd = ~~Math.round(players[id].stats.casual.kills / players[id].stats.casual.deaths * 100) / 100;
                        players[id].stats.general.kd = ~~Math.round(players[id].stats.general.kills / players[id].stats.general.deaths * 100) / 100;

                        players[id].stats.rank.wl = ~~Math.round(players[id].stats.rank.wins / players[id].stats.rank.matchesplayed * 1000) / 10;
                        players[id].stats.ranked.wl = ~~Math.round(players[id].stats.ranked.wins / players[id].stats.ranked.matchesplayed * 1000) / 10;
                        players[id].stats.casual.wl = ~~Math.round(players[id].stats.casual.wins / players[id].stats.casual.matchesplayed * 1000) / 10;
                        players[id].stats.general.wl = ~~Math.round(players[id].stats.general.wins / players[id].stats.general.matchesplayed * 1000) / 10;

                        players[id].stats.general.penetration_ratio = (players[id].stats.general.penetrations / players[id].stats.general.kills) * 100;
                        players[id].stats.general.headshot_ratio = (players[id].stats.general.headshots / players[id].stats.general.kills) * 100;

                        resolve();
                    } else {
                        resolve();
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        })
    }

    private async fetch(url: string, options, tries: number) {
        const that = this;

        return fetch(encodeURI(url), options)
            .then(response => response.json())
            .then(data => {
                if (!data.error) {
                    return data;
                }

                if (tries > 0) {
                    return that.fetch(url, options, tries - 1);
                } else {
                    throw new Error(data);
                }
            })
            .catch(console.error);
    }

    private sendPlayerPing(name: string, team: string, lobbyId: string) {
        const pingUserData = {
            name: name,
            team: team.toLowerCase(),
            lobbyId: lobbyId,
        }

        const formData = new FormData();

        for (const key in pingUserData) {
            if (pingUserData.hasOwnProperty(key)) {
                formData.append(key, pingUserData[key]);
            }
        }

        fetch('https://staging-api.statsdb.net/r6/overlay/ping', { method: 'POST', body: formData });

        console.log(`website ping "${name}", "${team}", "${lobbyId}"`);
    }

    private addPlayer(id: string, stats) {
        const playerStats = players[id];
        const settings = JSON.parse(localStorage.settings);

        let table: HTMLElement, tablelive: HTMLElement;

        if (stats.team === 'Blue') {
            table = document.getElementById('team-blue-tbody');
            tablelive = document.getElementById('team-blue-tbody-live');
        } else if (stats.team === 'Orange') {
            table = document.getElementById('team-orange-tbody');
            tablelive = document.getElementById('team-orange-tbody-live');
        }

        if (settings.allCaps == true) {
            stats.name = stats.name.toUpperCase();
        }

        const statsObject = {
            "Empty": {
                0: true,
                1: true,
                2: true
            },
            "Country": {
                0: `<img src="https://api.statsdb.net/assets/flags/${playerStats.user.countryCode}" alt="${playerStats.user.countryCode}" class="img-country">`,
                1: `<img src="https://api.statsdb.net/assets/flags/${playerStats.user.countryCode}" alt="${playerStats.user.countryCode}" class="img-country">`,
                2: `<img src="https://api.statsdb.net/assets/flags/${playerStats.user.countryCode}" alt="${playerStats.user.countryCode}" class="img-country">`
            },
            "LVL": {
                0: playerStats.stats.progression.level,
                1: playerStats.stats.progression.level,
                2: playerStats.stats.progression.level
            },
            // "Hacker %" : {
            //     0 : playerStats.hacker_percentage + '%',
            //     1 : playerStats.hacker_percentage + '%',
            //     2 : playerStats.hacker_percentage + '%'
            // },
            "Hacker %": {
                0: '0%',
                1: '0%',
                2: '0%'
            },
            "Kills": {
                0: playerStats.stats.rank.kills,
                1: playerStats.stats.ranked.kills,
                2: playerStats.stats.casual.kills
            },
            "Deaths": {
                0: playerStats.stats.rank.deaths,
                1: playerStats.stats.ranked.deaths,
                2: playerStats.stats.casual.deaths
            },
            "K/D": {
                0: playerStats.stats.rank.kd.toFixed(2),
                1: playerStats.stats.ranked.kd.toFixed(2),
                2: playerStats.stats.casual.kd.toFixed(2)
            },
            "Wins": {
                0: playerStats.stats.rank.wins,
                1: playerStats.stats.ranked.wins,
                2: playerStats.stats.casual.wins
            },
            "Losses": {
                0: playerStats.stats.rank.losses,
                1: playerStats.stats.ranked.losses,
                2: playerStats.stats.casual.losses
            },
            "W/L": {
                0: playerStats.stats.rank.wl.toFixed(1) + "%",
                1: playerStats.stats.ranked.wl.toFixed(1) + "%",
                2: playerStats.stats.casual.wl.toFixed(1) + "%",
            },
            "Max MMR": {
                0: Math.trunc(playerStats.stats.rank.max_mmr),
                1: Math.trunc(playerStats.stats.rank.max_mmr),
                2: Math.trunc(playerStats.stats.rank.max_mmr)
            },
            "HS/K": {
                0: playerStats.stats.general.headshot_ratio.toFixed(1) + '%',
                1: playerStats.stats.general.headshot_ratio.toFixed(1) + '%',
                2: playerStats.stats.general.headshot_ratio.toFixed(1) + '%'
            },
            "PEN/K": {
                0: playerStats.stats.general.penetration_ratio.toFixed(2) + '%',
                1: playerStats.stats.general.penetration_ratio.toFixed(2) + '%',
                2: playerStats.stats.general.penetration_ratio.toFixed(2) + '%'
            },
            "Games played": {
                0: playerStats.stats.rank.wins + playerStats.stats.rank.losses,
                1: playerStats.stats.ranked.matchesplayed,
                2: playerStats.stats.casual.matchesplayed
            },
            "MMR change": {
                0: playerStats.stats.rank.last_match_mmr_change,
                1: playerStats.stats.rank.last_match_mmr_change,
                2: playerStats.stats.rank.last_match_mmr_change
            },
            "Alpha %": {
                0: Math.round(playerStats.stats.progression.lootbox_probability / 100) + "%",
                1: Math.round(playerStats.stats.progression.lootbox_probability / 100) + "%",
                2: Math.round(playerStats.stats.progression.lootbox_probability / 100) + "%"
            }
        }

        const cusTStats = JSON.parse(localStorage.valuesTable);
        const playerTrValueLive = `<div class="player-tr" id="live${id}">
                <div class="stat name">
                    <div class="img">
                        <img src="/img/ranks/rank${playerStats.stats.rank.rank}.svg" alt="rank">
                        ${playerStats.stats.rank.mmr}
                    </div>
                    <div class="player-name">${stats.name}</div>
                    <div id="tKD${id}" class="teamKillDot"></div>
                </div>

                <div class="stat live current" id="live0${id}"></div>
                <div class="stat live current" id="live1${id}"></div>
                <div class="stat live current" id="live2${id}"></div>
                <div class="stat live current" id="live3${id}"></div>
                <div class="stat live current" id="live4${id}"></div>
                <div class="stat live current" id="live5${id}"></div>
                <div class="stat live current" id="live6${id}"></div>
                <div class="stat live current" id="live7${id}"></div>
                <div class="stat live current" id="live8${id}"></div>
                <div class="stat live current" id="live9${id}"></div>
            </div>`;

        const playerTrValue = `
            <div class="player-tr" id="${id}">
                <div class="stat name">
                    <div class="img">
                        <img src="/img/ranks/rank${playerStats.stats.rank.rank}.svg" alt="rank">
                        ${playerStats.stats.rank.mmr}
                    </div>
                    <div class="player-name">${stats.name}</div>
                </div>

                <div class="stat ranked current" id="ranked0${id}">${statsObject[cusTStats[0]][1]}</div>
                <div class="stat casual" id="casual0${id}">${statsObject[cusTStats[0]][2]}</div>
                <div class="stat seasonal" id="seasonal0${id}">${statsObject[cusTStats[0]][0]}</div>
                <div class="stat ranked current" id="ranked1${id}">${statsObject[cusTStats[1]][1]}</div>
                <div class="stat casual" id="casual1${id}">${statsObject[cusTStats[1]][2]}</div>
                <div class="stat seasonal" id="seasonal1${id}">${statsObject[cusTStats[1]][0]}</div>
                <div class="stat ranked current" id="ranked2${id}">${statsObject[cusTStats[2]][1]}</div>
                <div class="stat casual" id="casual2${id}">${statsObject[cusTStats[2]][2]}</div>
                <div class="stat seasonal" id="seasonal2${id}">${statsObject[cusTStats[2]][0]}</div>
                <div class="stat ranked current" id="ranked3${id}">${statsObject[cusTStats[3]][1]}</div>
                <div class="stat casual" id="casual3${id}">${statsObject[cusTStats[3]][2]}</div>
                <div class="stat seasonal" id="seasonal3${id}">${statsObject[cusTStats[3]][0]}</div>
                <div class="stat ranked current" id="ranked4${id}">${statsObject[cusTStats[4]][1]}</div>
                <div class="stat casual" id="casual4${id}">${statsObject[cusTStats[4]][2]}</div>
                <div class="stat seasonal" id="seasonal4${id}">${statsObject[cusTStats[4]][0]}</div>
                <div class="stat ranked current" id="ranked5${id}">${statsObject[cusTStats[5]][1]}</div>
                <div class="stat casual" id="casual5${id}">${statsObject[cusTStats[5]][2]}</div>
                <div class="stat seasonal" id="seasonal5${id}">${statsObject[cusTStats[5]][0]}</div>
                <div class="stat ranked current" id="ranked6${id}">${statsObject[cusTStats[6]][1]}</div>
                <div class="stat casual" id="casual6${id}">${statsObject[cusTStats[6]][2]}</div>
                <div class="stat seasonal" id="seasonal6${id}">${statsObject[cusTStats[6]][0]}</div>
                <div class="stat ranked current" id="ranked7${id}">${statsObject[cusTStats[7]][1]}</div>
                <div class="stat casual" id="casual7${id}">${statsObject[cusTStats[7]][2]}</div>
                <div class="stat seasonal" id="seasonal7${id}">${statsObject[cusTStats[7]][0]}</div>
                <div class="stat ranked current" id="ranked8${id}">${statsObject[cusTStats[8]][1]}</div>
                <div class="stat casual" id="casual8${id}">${statsObject[cusTStats[8]][2]}</div>
                <div class="stat seasonal" id="seasonal8${id}">${statsObject[cusTStats[8]][0]}</div>
            </div>`;

        if (!document.getElementById(id)) {
            table.innerHTML += playerTrValue;

            for (const index in cusTStats) {
                if (cusTStats.hasOwnProperty(index)) {
                    const customStat = cusTStats[index];

                    if (customStat === 'Empty') {
                        document.getElementById(`ranked${index + id}`).style.display = 'none';
                        document.getElementById(`casual${index + id}`).style.display = 'none';
                        document.getElementById(`seasonal${index + id}`).style.display = 'none';

                        let thead: any = document.getElementsByClassName('value-' + index);

                        for (let i = 0; i < thead.length; i++) {
                            thead[i].style.display = 'none';
                        }
                    }
                }
            }

            console.log(`player joined "${playerStats.user.nickname}, ${id}"`);
        }

        if (!document.getElementById('live' + id)) {
            tablelive.innerHTML += playerTrValueLive;
        }
    }

    public async playerLeave(id: string): Promise<void> {
        return new Promise<void>(async resolve => {
            if (document.getElementById(id)) {
                document.getElementById(id).remove();
                const player = players[id];

                console.log(`player left "${players[id].user.nickname}, ${id}"`);

                delete players[id];
            }

            if (document.getElementById('live' + id)) {
                document.getElementById('live' + id).remove();
            }

            resolve();
        })
    }

    public printDetailedPlayer(playerTr: HTMLElement) {
        if (!playerTr) {
            return;
        }

        const rosterId = playerTr.id;
        const playerStats = players[rosterId];

        let timeplayed: any = {
            generalSec: parseInt(playerStats.stats.general.timeplayed, 10) + parseInt(playerStats.stats.pve.timeplayed, 10),
            rankedSec: parseInt(playerStats.stats.ranked.timeplayed, 10),
            casualSec: parseInt(playerStats.stats.casual.timeplayed, 10),
        };

        timeplayed.generalHours = Math.floor(timeplayed.generalSec / 3600);
        timeplayed.generalMinutes = Math.floor(timeplayed.generalSec / 60) % 60;
        timeplayed.rankedHours = Math.floor(timeplayed.rankedSec / 3600);
        timeplayed.rankedMinutes = Math.floor(timeplayed.rankedSec / 60) % 60;
        timeplayed.casualHours = Math.floor(timeplayed.casualSec / 3600);
        timeplayed.casualMinutes = Math.floor(timeplayed.casualSec / 60) % 60;

        let seasonRankBar: string, seasonRankBarText: string;

        if (playerStats.stats.rank.rank !== 0 && playerStats.stats.rank.next_rank_mmr > playerStats.stats.rank.mmr) {
            seasonRankBar = ((playerStats.stats.rank.mmr - playerStats.stats.rank.previous_rank_mmr) / (playerStats.stats.rank.next_rank_mmr - playerStats.stats.rank.previous_rank_mmr) * 100).toString();
        } else {
            seasonRankBar = '100';
        }

        if (playerStats.stats.rank.rank !== 0 && playerStats.stats.rank.next_rank_mmr > playerStats.stats.rank.mmr) {
            seasonRankBarText = playerStats.stats.rank.mmr + ' / ' + playerStats.stats.rank.next_rank_mmr;
        } else {
            seasonRankBarText = playerStats.stats.rank.mmr;
        }

        const detailedSeasonal = `
            <div class="stats-row-headline">
                <h2>Seasonal Statistics</h2>
            </div>
            <div class="stats-row">
                <div class="stats-row-placeholder season-rank-row-placeholder">
                    <div class="season-rank">
                        <div class="season-previous-img">
                            <img id="season-previous-img" src="/img/ranks/rank${playerStats.stats.rank.rank}.svg" alt="rank img">
                        </div>
                        <div class="season-rank-div">
                            <div class="season-max-mmr-div">
                                <p id="season-max-mmr">${playerStats.stats.rank.max_mmr}<span> Max Mmr</span></p>
                            </div>
                            <div class="season-current-rank">
                                <div id="season-rank-bar" style="width:${seasonRankBar}%;"></div>
                                <p id="season-rank-bar-text">${seasonRankBarText}</p>
                            </div>
                        </div>
                        <div class="season-next-img">
                            <img id="season-next-img" src="/img/ranks/rank${playerStats.stats.rank.next_rank}.svg" alt="rank img">
                        </div>
                        <div class="season-max-rank">
                            <div class="season-max-img">
                                <img id="season-max-img" src="/img/ranks/rank${playerStats.stats.rank.max_rank}.svg" alt="rank img">
                            </div>
                            <div class="season-max-rank-text" id="max-rank-text">
                                <p>Max Rank</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="stats-row-placeholder">
                    <h3>Kills</h3>
                    <p>${playerStats.stats.rank.kills}</p>
                </div>
                <div class="stats-row-placeholder">
                    <h3>Deaths</h3>
                    <p>${playerStats.stats.rank.deaths}</p>
                </div>
                <div class="stats-row-placeholder">
                    <h3>K/D</h3>
                    <p>${playerStats.stats.rank.kd.toFixed(2)}</p>
                </div>
                <div class="stats-row-placeholder">
                    <h3>Wins</h3>
                    <p>${playerStats.stats.rank.wins}</p>
                </div>
                <div class="stats-row-placeholder">
                    <h3>Losses</h3>
                    <p>${playerStats.stats.rank.losses}</p>
                </div>
                <div class="stats-row-placeholder">
                    <h3>W/L</h3>
                    <p>${playerStats.stats.rank.wl.toFixed(1)}%</p>
                </div>
            </div>`;

        const detailedRanked = `
            <div class="stats-row-headline">
                <h2>Ranked Statistics</h2>
            </div>
            <div class="stats-row">
                <div class="stats-row-placeholder overall-row-placeholder">
                    <h3>Time Played</h3>
                    <p>${timeplayed['rankedHours']}h ${timeplayed['rankedMinutes']}m</p>
                </div>
                <div class="stats-row-placeholder overall-row-placeholder">
                    <h3>K/D</h3>
                    <p>${playerStats.stats.ranked.kd.toFixed(2)}</p>
                </div>
                <div class="stats-row-placeholder overall-row-placeholder">
                    <h3>Kills</h3>
                    <p>${playerStats.stats.ranked.kills}</p>
                </div>
                <div class="stats-row-placeholder overall-row-placeholder">
                    <h3>Deaths</h3>
                    <p>${playerStats.stats.ranked.deaths}</p>
                </div>
                <div class="stats-row-placeholder overall-row-placeholder">
                    <h3>Games Played</h3>
                    <p>${playerStats.stats.ranked.matchesplayed}</p>
                </div>
                <div class="stats-row-placeholder overall-row-placeholder">
                    <h3>W/L</h3>
                    <p>${playerStats.stats.ranked.wl.toFixed(1)}%</p>
                </div>
                <div class="stats-row-placeholder overall-row-placeholder">
                    <h3>Wins</h3>
                    <p>${playerStats.stats.ranked.wins}</p>
                </div>
                <div class="stats-row-placeholder overall-row-placeholder">
                    <h3>Losses</h3>
                    <p>${playerStats.stats.ranked.losses}</p>
                </div>
            </div>`;

        const detailedCasual = `
            <div class="stats-row-headline">
                <h2>Casual Statistics</h2>
            </div>
            <div class="stats-row">
                <div class="stats-row-placeholder overall-row-placeholder">
                    <h3>Time Played</h3>
                    <p>${timeplayed['casualHours']}h ${timeplayed['casualMinutes']}m</p>
                </div>
                <div class="stats-row-placeholder overall-row-placeholder">
                    <h3>K/D</h3>
                    <p>${playerStats.stats.casual.kd.toFixed(2)}</p>
                </div>
                <div class="stats-row-placeholder overall-row-placeholder">
                    <h3>Kills</h3>
                    <p>${playerStats.stats.casual.kills}</p>
                </div>
                <div class="stats-row-placeholder overall-row-placeholder">
                    <h3>Deaths</h3>
                    <p>${playerStats.stats.casual.deaths}</p>
                </div>
                <div class="stats-row-placeholder overall-row-placeholder">
                    <h3>Games Played</h3>
                    <p>${playerStats.stats.casual.matchesplayed}</p>
                </div>
                <div class="stats-row-placeholder overall-row-placeholder">
                    <h3>W/L</h3>
                    <p>${playerStats.stats.casual.wl.toFixed(1)}%</p>
                </div>
                <div class="stats-row-placeholder overall-row-placeholder">
                    <h3>Wins</h3>
                    <p>${playerStats.stats.casual.wins}</p>
                </div>
                <div class="stats-row-placeholder overall-row-placeholder">
                    <h3>Losses</h3>
                    <p>${playerStats.stats.casual.losses}</p>
                </div>
            </div>`;

        const detailedPlayer = `
            <div class="stats-row-headline">
                <h2>Player Statistics</h2>
            </div>
            <div class="stats-row">
                <div class="stats-row-placeholder overall-row-placeholder">
                    <h3>Travelled</h3>
                    <p>${Math.floor(playerStats.stats.general.distancetravelled / 1000)}km</p>
                </div>
                <div class="stats-row-placeholder overall-row-placeholder">
                    <h3>Barricades</h3>
                    <p>${playerStats.stats.general.barricadedeployed}</p>
                </div>
                <div class="stats-row-placeholder overall-row-placeholder">
                    <h3>Reinforcements</h3>
                    <p>${playerStats.stats.general.reinforcementdeploy}</p>
                </div>
                <div class="stats-row-placeholder overall-row-placeholder">
                    <h3>Suicides</h3>
                    <p>${playerStats.stats.general.suicide}</p>
                </div>
                <div class="stats-row-placeholder overall-row-placeholder">
                    <h3>Revives</h3>
                    <p>${playerStats.stats.general.revives}</p>
                </div>
                <div class="stats-row-placeholder overall-row-placeholder">
                    <h3>DBNO</h3>
                    <p>${playerStats.stats.general.dbno}</p>
                </div>
                <div class="stats-row-placeholder overall-row-placeholder">
                    <h3>DBNO Assists</h3>
                    <p>${playerStats.stats.general.dbnoassists}</p>
                </div>
                <div class="stats-row-placeholder overall-row-placeholder">
                    <h3>Gadgets Destroyed</h3>
                    <p>${playerStats.stats.general.gadgetdestroy}</p>
                </div>
            </div>`;

        const detailedGeneral = `
            <div class="stats-row-headline">
                <h2>General Statistics</h2>
            </div>
            <div class="stats-row">
                <div class="general-row-placeholder">
                    <h3>K/D</h3>
                    <p>${playerStats.stats.general.kd}</p>
                </div>
                <div class="general-row-placeholder">
                    <h3>Kills</h3>
                    <p>${playerStats.stats.general.kills}</p>
                </div>
                <div class="general-row-placeholder">
                    <h3>Deaths</h3>
                    <p>${playerStats.stats.general.deaths}</p>
                </div>
                <div class="general-row-placeholder">
                    <h3>Time Played</h3>
                    <p>${timeplayed['generalHours']}h ${timeplayed['generalMinutes']}m</p>
                </div>
                <div class="general-row-placeholder">
                    <h3>HS Kills</h3>
                    <p>${playerStats.stats.general.headshots}</p>
                </div>
                <div class="general-row-placeholder">
                    <h3>HS/K</h3>
                    <p>${playerStats.stats.general.headshot_ratio.toFixed(2)}</p>
                </div>
                <div class="general-row-placeholder">
                    <h3>PEN Kills</h3>
                    <p>${playerStats.stats.general.penetrations}</p>
                </div>
                <div class="general-row-placeholder">
                    <h3>PEN/K</h3>
                    <p>${playerStats.stats.general.penetration_ratio.toFixed(2)}</p>
                </div>
                <div class="general-row-placeholder">
                    <h3>W/L</h3>
                    <p>${playerStats.stats.general.wl}</p>
                </div>
                <div class="general-row-placeholder">
                    <h3>Wins</h3>
                    <p>${playerStats.stats.general.wins}</p>
                </div>
                <div class="general-row-placeholder">
                    <h3>Losses</h3>
                    <p>${playerStats.stats.general.losses}</p>
                </div>
                <div class="general-row-placeholder">
                    <h3>Games Played</h3>
                    <p>${playerStats.stats.general.matchesplayed}</p>
                </div>
                <div class="general-row-placeholder">
                    <h3>Assists</h3>
                    <p>${playerStats.stats.general.assists}</p>
                </div>
                <div class="general-row-placeholder">
                    <h3>Melee Kills</h3>
                    <p>${playerStats.stats.general.melees}</p>
                </div>
                <div class="general-row-placeholder">
                    <h3>Blind Kills</h3>
                    <p>${playerStats.stats.general.blindkills}</p>
                </div>
                <div class="general-row-placeholder">
                    <h3>Hacker %</h3>
                    <p>0%</p>
                </div>
            </div>`;

        document.getElementById('detailedStats-name').innerHTML = playerStats.user.nickname;
        document.getElementById('detailedStats-level').innerHTML = playerStats.stats.progression.level;
        (document.getElementById('detailedStats-profileImg') as HTMLImageElement).src = playerStats.user.smallAvatar;
        document.getElementById('detailedSeasonal').innerHTML = detailedSeasonal;
        document.getElementById('detailedRanked').innerHTML = detailedRanked;
        document.getElementById('detailedCasual').innerHTML = detailedCasual;
        document.getElementById('detailedPlayer').innerHTML = detailedPlayer;
        document.getElementById('detailedGeneral').innerHTML = detailedGeneral;

        console.log(`shown detailed player "${playerStats.user.nickname}"`);

        // @ts-ignore
        let token = generateAuthToken(Math.round(date.getTime() / 1000))

        fetch('https://api.statsdb.net/r6/config', {
            headers: {
                "X-API-KEY": token,
                "AUTHORIZATION": "Bearer ZGlzY29yZGJvdDpmMmZjMTNhYi1iMDc5LTQ5NTctODNiYi0xMTAzMjg1ZTYyM2Q="
            }
        })
            .then(response => response.json())
            .then(data => {
                fetch(`https://api.statsdb.net/r6/player/${playerStats.user.id}`, {
                    headers: {
                        "X-API-KEY": token,
                        "AUTHORIZATION": "Bearer ZGlzY29yZGJvdDpmMmZjMTNhYi1iMDc5LTQ5NTctODNiYi0xMTAzMjg1ZTYyM2Q="
                    }
                })
                    .then(response2 => response2.json())
                    .then(userData => {
                        const historyStats = userData.payload.stats.history;
                        const numberOfSeasons = Object.keys(data.payload.seasons).length;

                        let seasonsHTML = '';

                        for (let i = 0; i < 14; i++) {
                            const season = numberOfSeasons - i;

                            let seasonData: any = { rank: 0, mmr: 2500, kills: 0, deaths: 0 };

                            let mPRegion = {
                                gamesPlayed: 0,
                                region: 'emea',
                            }

                            for (const region in historyStats[season]) {
                                if (historyStats[season].hasOwnProperty(region)) {
                                    const regionStats = historyStats[season][region];
                                    const gamesPlayed = regionStats.wins + regionStats.losses;

                                    if (regionStats.noMatchesPlayed === false && gamesPlayed > mPRegion.gamesPlayed) {
                                        mPRegion.gamesPlayed = gamesPlayed;
                                        mPRegion.region = region;
                                    }
                                }
                            }

                            if (historyStats[season][mPRegion.region].noMatchesPlayed === false) {
                                seasonData = historyStats[season][mPRegion.region];
                            }

                            if (seasonData.deaths + seasonData.kills !== 0) {
                                seasonData.kd = "K/D:" + (seasonData.kills / seasonData.deaths).toFixed(2);
                            } else {
                                seasonData.kd = "";
                            }

                            if (seasonData.max_mmr !== undefined && seasonData.max_mmr !== 0) {
                                seasonData.max_rank = this.rankOffset(season, seasonData.max_rank);
                                seasonData.max_mmr = Math.trunc(seasonData.max_mmr);
                            } else {
                                seasonData.max_rank = 0;
                                seasonData.max_mmr = "2500";
                            }

                            seasonsHTML += `
                                <div class="box">
                                    <div class="box-left">
                                        <img src="/img/ranks/rank${seasonData.max_rank}.svg" alt="rank img">
                                    </div>
                                    <div class="box-right">
                                        <h4 style="color:${seasonColors[season]}">${data.payload.seasons[season].name}</h4>
                                        <h3>MMR:${seasonData.max_mmr}</h3>
                                        <h3 class="seasonKD">${seasonData.kd}</h3>
                                    </div>
                                </div>
                            `;

                            document.getElementById('seasonsStats').innerHTML = seasonsHTML;
                        }
                    })
            })
    }

    private rankOffset(a: number, b: number) {
        if (a < 15) {
            return rankOffset[b];
        } else {
            return b;
        }
    }

    public storeMatchData(matchStats, matchOutcome: string, roundStats, self) {
        const today: any = new Date();
        const firstDayOfYear: any = new Date(today.getFullYear(), 0, 1);
        const pastDaysOfYear: any = (today - firstDayOfYear) / 86400000;

        const keyIDBDays = today.getDate() + ',' + (today.getMonth() + 1) + ',' + today.getFullYear();
        const keyIDBWeeks = `${Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)},${today.getFullYear()}`;
        const dayOfWeek = today.getDay();

        const promise1 = this.storeDaily(keyIDBDays, matchStats, matchOutcome, self);
        const promise2 = this.storeWeekly(keyIDBWeeks, dayOfWeek, matchStats, matchOutcome, self);
        const promise3 = this.storeMatch(matchStats, roundStats, matchOutcome, self);

        Promise.all([promise1, promise2, promise3])
            .then(result => console.log(`storeMatch "${result}"`));
    }

    private storeDaily(keyIDB: string, matchStats, matchOutcome: string, self) {
        return new Promise<any>(async (resolve) => {
            const promise = this.database.readFromIDB('days', keyIDB)
                .then(dbResult => {
                    const id = self.id;

                    if (matchStats[id].kills && !isNaN(matchStats[id].kills)) {
                        dbResult[this.gameMode].kills += matchStats[id].kills;
                    }

                    if (matchStats[id].deaths && !isNaN(matchStats[id].deaths)) {
                        dbResult[this.gameMode].deaths += matchStats[id].deaths;
                    }

                    if (matchOutcome === 'victory') {
                        dbResult[this.gameMode].wins++;
                    } else if (matchOutcome === 'defeat') {
                        dbResult[this.gameMode].losses++;
                    }

                    const promise = this.database.storeToIDB('days', dbResult, false)
                        .then(result => {
                            console.log(result);

                            resolve(result);
                        })
                })
        })
    }

    private storeWeekly(keyIDB: string, dayOfWeek: number, matchStats, matchOutcome: string, self) {
        return new Promise<any>(async (resolve) => {
            const promise = this.database.readFromIDB('weeks', keyIDB)
                .then(dbResult => {
                    const id = self.id;

                    if (matchStats[id].kills && !isNaN(matchStats[id].kills)) {
                        dbResult[dayOfWeek][this.gameMode].kills += matchStats[id].kills;
                    }

                    if (matchStats[id].deaths && !isNaN(matchStats[id].deaths)) {
                        dbResult[dayOfWeek][this.gameMode].deaths += matchStats[id].deaths;
                    }

                    if (matchOutcome === 'victory') {
                        dbResult[dayOfWeek][this.gameMode].wins++;
                    } else if (matchOutcome === 'defeat') {
                        dbResult[dayOfWeek][this.gameMode].losses++;
                    }

                    const promise = this.database.storeToIDB('weeks', dbResult, false)
                        .then(result => {
                            console.log(result);

                            resolve(result);
                        })
                })
        })
    }

    private storeMatch(matchStats, roundStats, matchOutcome: string, self) {
        return new Promise<any>(async (resolve) => {
            const dbValue = {
                matchId: this.matchId,
                map: this.mapId,
                timeStamp: this.timeStamp,
                timeStampIndex: this.timeStamp,
                gameMode: this.gameMode,
                matchOutcome: matchOutcome,
                matchStats: matchStats,
                roundStats: roundStats,
                self: self,
            };

            const promise = this.database.readFromIDB('savedMatches', this.matchId)
                .then(result => {
                    if (result && !dbValue.roundStats[Object.keys(result.roundStats).reverse()[0]]) {
                        console.log('UPDATEUPDATE');
                        let owIds = {};

                        for (const owId in dbValue.matchStats) {
                            if (dbValue.matchStats.hasOwnProperty(owId)) {
                                owIds[dbValue.matchStats[owId].name] = owId;
                            }
                        }

                        for (const owId in result.matchStats) {
                            if (result.matchStats.hasOwnProperty(owId) && owId) {
                                const newOwId = owIds[result.matchStats[owId].name];

                                if (!dbValue.matchStats[newOwId]) {
                                    dbValue.matchStats[newOwId] = {};
                                }

                                dbValue.matchStats[newOwId].name = result.matchStats[owId].name;
                                dbValue.matchStats[newOwId].team = result.matchStats[owId].team;
                                dbValue.matchStats[newOwId].user = result.matchStats[owId].user;

                                if (!isNaN(result.matchStats[owId].deaths)) {
                                    dbValue.matchStats[newOwId].deaths += result.matchStats[owId].deaths;
                                }
                                if (!isNaN(result.matchStats[owId].kills)) {
                                    dbValue.matchStats[newOwId].kills += result.matchStats[owId].kills;
                                }
                                if (!isNaN(result.matchStats[owId].score)) {
                                    dbValue.matchStats[newOwId].score += result.matchStats[owId].score;
                                }
                            }
                        }

                        for (const roundNumber in result.roundStats) {
                            if (result.roundStats.hasOwnProperty(roundNumber)) {
                                if (!dbValue.roundStats[roundNumber]) {
                                    dbValue.roundStats[roundNumber] = {};
                                }

                                dbValue.roundStats[roundNumber].roundOutcome = result.roundStats[roundNumber].roundOutcome;

                                for (const owId in result.roundStats[roundNumber]) {
                                    if (result.roundStats[roundNumber].hasOwnProperty(owId) && owId) {
                                        const newOwId = owIds[result.roundStats[roundNumber][owId].name];

                                        dbValue.roundStats[roundNumber][newOwId] = {
                                            name: result.roundStats[roundNumber][owId].name,
                                            is_local: result.roundStats[roundNumber][owId].is_local,
                                            team: result.roundStats[roundNumber][owId].team,
                                            health: result.roundStats[roundNumber][owId].health,
                                            operator: result.roundStats[roundNumber][owId].operator,
                                            deaths: result.roundStats[roundNumber][owId].deaths,
                                            kills: result.roundStats[roundNumber][owId].kills,
                                            score: result.roundStats[roundNumber][owId].score,
                                        };
                                    }
                                }
                            }
                        }
                    }

                    if (dbValue.matchId) {
                        const promise1 = this.database.storeToIDB('savedMatches', dbValue, false)
                            .then(result => {
                                console.log(result);

                                resolve(result);
                            })
                    }
                })
        })
    }
}