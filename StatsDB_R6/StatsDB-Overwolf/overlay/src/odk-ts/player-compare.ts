export class PlayerCompare {
    private htmlElements: any;

    constructor() {
        this.htmlElements = {
            compareTeamBlues: document.querySelectorAll('.blueStat'),
            compareTeamOranges: document.querySelectorAll('.orangeStat'),
            compareVSText: document.querySelectorAll('.teamVSText.aggro'),
        }
    }

    public async calculateTeamStats(allPlayerStats, userTeam: string): Promise<void> {
        return new Promise<void>(async resolve => {
            let teamStats: any = {}, teamMMRV: string, teamKDV: string, teamWLV: string, teamGamesPlayedV: string;

            for (const id in allPlayerStats) {
                if (allPlayerStats.hasOwnProperty(id)) {
                    const playerStats: any = allPlayerStats[id];
                    const teamName = playerStats.team;

                    if (!teamStats[teamName]) {
                        teamStats[teamName] = {};
                        teamStats[teamName].mmr = [];
                        teamStats[teamName].kd = [];
                        teamStats[teamName].wl = [];
                        teamStats[teamName].gamesPlayed = [];
                    }

                    teamStats[teamName].mmr.push(playerStats.stats.rank.mmr);
                    teamStats[teamName].kd.push(playerStats.stats.rank.kd);
                    teamStats[teamName].wl.push(playerStats.stats.rank.wl);
                    teamStats[teamName].gamesPlayed.push(playerStats.stats.rank.matchesplayed);

                    teamMMRV = this.calculateAvg(teamStats[teamName].mmr, "trunc", null);
                    teamKDV = this.calculateAvg(teamStats[teamName].kd, "tofixed", 2);
                    teamWLV = this.calculateAvg(teamStats[teamName].wl, "tofixed", 1);
                    teamGamesPlayedV = this.calculateAvg(teamStats[teamName].gamesPlayed, "trunc", null);

                    document.getElementById(`team${teamName}Mmr`).innerHTML = teamMMRV;
                    document.getElementById(`team${teamName}Kd`).innerHTML = teamKDV;
                    document.getElementById(`team${teamName}Wl`).innerHTML = teamWLV + '%';
                    document.getElementById(`team${teamName}GamesPlayed`).innerHTML = teamGamesPlayedV;
                    document.getElementById(`team${teamName}Mmr-live`).innerHTML = teamMMRV;
                    document.getElementById(`team${teamName}Kd-live`).innerHTML = teamKDV;
                    document.getElementById(`team${teamName}Wl-live`).innerHTML = teamWLV + '%';
                    document.getElementById(`team${teamName}GamesPlayed-live`).innerHTML = teamGamesPlayedV;

                    if (userTeam) {
                        for (let i = 0; i < this.htmlElements.compareTeamBlues.length; i++) {
                            if (userTeam === 'Blue') {
                                this.htmlElements.compareVSText[i].before(this.htmlElements.compareTeamBlues[i]);
                                this.htmlElements.compareVSText[i].after(this.htmlElements.compareTeamOranges[i]);
                            } else if (userTeam === 'Orange') {
                                this.htmlElements.compareVSText[i].before(this.htmlElements.compareTeamOranges[i]);
                                this.htmlElements.compareVSText[i].after(this.htmlElements.compareTeamBlues[i]);
                            }
                        }
                    }

                    this.teamWinningOdds(allPlayerStats, teamStats);

                    resolve();
                }
            }
        })
    }

    private calculateAvg(statArray, mode: string, decimals: number) {
        let output: any = 0;

        if (typeof statArray === "object") {
            for (let i = 0; i < statArray.length; i++) {
                output += statArray[i];
            }
        }

        output = output / statArray.length;

        if (mode === "trunc") {
            output = Math.trunc(output).toString();
        } else if (mode === "tofixed") {
            output = output.toFixed(decimals);
        }

        return output;
    }

    private teamWinningOdds(allPlayerStats, teamStats) {
        let startPerc: number, smallChance: number, largeChance: number, blueBIG: boolean, oddsBlue: number, oddsOrange: number, blueTot = 0, orangeTot = 0, teamsPoint: any = { Blue: 0, Orange: 0 }, team: string;

        Object.keys(allPlayerStats).forEach(i => {
            const playerStats = allPlayerStats[i];
            team = playerStats.team
            let wlWeight = 0, kdWeight = 0, hsWeight = 0;

            if (playerStats.stats.rank.rank > 0 && playerStats.stats.rank.wins + playerStats.stats.rank.losses > 40) {
                if (playerStats.stats.rank.kd > 1.4) {
                    if (playerStats.stats.rank.wins + playerStats.stats.rank.losses > 150) {
                        kdWeight = 2.5;
                    } else {
                        kdWeight = 2.2;
                    }
                } else if (playerStats.stats.rank.kd > 1.2) {
                    kdWeight = 1.6;
                } else if (playerStats.stats.rank.kd > 1.0) {
                    kdWeight = 1.5;
                } else if (playerStats.stats.rank.kd < 1.0) {
                    kdWeight = 1.2;
                }

                if (playerStats.generalpvp_kills > 100) {
                    if ((playerStats.stats.general.headshots / playerStats.stats.general.kills) > 0.55) {
                        hsWeight = 1.3;
                    } else if ((playerStats.stats.general.headshots / playerStats.stats.general.kills) > 0.50) {
                        hsWeight = 1.2;
                    } else if ((playerStats.stats.general.headshots / playerStats.stats.general.kills) > 0.47) {
                        hsWeight = 1.1;
                    }
                }

                if (playerStats.stats.rank.wins + playerStats.stats.rank.losses > 100) {
                    if (playerStats.stats.rank.wl > 75) {
                        wlWeight = 1.3;
                    } else if (playerStats.stats.rank.wl > 63) {
                        wlWeight = 1.2;
                    } else if (playerStats.stats.rank.wl > 50) {
                        wlWeight = 1.1;
                    }
                }
            }
            if (playerStats.stats.history[19].emea.rank > 0 && playerStats.stats.history[19].emea.wins + playerStats.stats.history[19].emea.losses > 40) {
                if (playerStats.stats.history[19].emea.kd > 1.4) {
                    if (playerStats.playerStats.stats.history[19].emea.wins + playerStats.stats.history[19].emea.losses > 150) {
                        kdWeight += 1.25;
                    } else {
                        kdWeight += 1.1;
                    }
                } else if (playerStats.stats.history[19].emea.kd > 1.2) {
                    kdWeight += 0.8;
                } else if (playerStats.stats.history[19].emea.kd > 1.0) {
                    kdWeight += 0.75;
                } else if (playerStats.stats.history[19].emea.kd < 1.0) {
                    kdWeight += 0.6;
                }

                if (playerStats.stats.history[19].emea.wins + playerStats.stats.history[19].emea.losses > 100) {
                    if (playerStats.stats.history[19].emea.wl > 75) {
                        wlWeight += 0.65;
                    } else if (playerStats.stats.history[19].emea.wl > 63) {
                        wlWeight += 0.6;
                    } else if (playerStats.stats.history[19].emea.wl > 50) {
                        wlWeight += 0.55;
                    }
                }
            }

            teamsPoint[team] += kdWeight * (playerStats.stats.rank.rank / 3);
            teamsPoint[team] += hsWeight * (playerStats.stats.rank.rank / 3);
            teamsPoint[team] += wlWeight * (playerStats.stats.rank.rank / 5);
        });

        if (teamStats.Blue) {
            blueTot += parseFloat(teamStats.Blue.mmr) / 1000;
            blueTot += parseFloat(teamStats.Blue.kd) * 2;
        }
        teamsPoint.Blue += blueTot;

        if (teamStats.Orange) {
            orangeTot += parseFloat(teamStats.Orange.mmr) / 1000;
            orangeTot += parseFloat(teamStats.Orange.kd) * 2;
        }
        teamsPoint.Orange += orangeTot;

        if (teamsPoint.Blue > teamsPoint.Orange) {
            startPerc = (teamsPoint.Blue - teamsPoint.Orange) / (teamsPoint.Blue + teamsPoint.Orange) * 100;
            blueBIG = true;
        } else {
            startPerc = (teamsPoint.Orange - teamsPoint.Blue) / (teamsPoint.Orange + teamsPoint.Blue) * 100;
            blueBIG = false;
        }

        largeChance = 50 + startPerc / 2;
        smallChance = 50 - startPerc / 2;

        if (blueBIG === true) {
            oddsBlue = largeChance;
            oddsOrange = smallChance;
        } else if (blueBIG === false) {
            oddsBlue = smallChance;
            oddsOrange = largeChance;
        }

        document.getElementById("oddsBlue").innerHTML = oddsBlue.toFixed(1) + "%";
        document.getElementById("oddsOrange").innerHTML = oddsOrange.toFixed(1) + "%";
    }
}