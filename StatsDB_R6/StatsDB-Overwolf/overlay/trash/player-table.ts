import { PlayerCompare } from './player-compare';
import { tableStats } from '../consts';

let allPlayerStats: any = {}, userTeam;

const playerCompare = new PlayerCompare();

export class PlayerTable {
    public async searchPlayer(playerName, tries) {
        const self = this;

        const url = 'https://www.r6lookup.com/getStats/getStatsAPI.php?username=' + playerName + '&platform=uplay&appcode=809965';

        return fetch(encodeURI(url), {cache: "no-cache"})
            .then(response => response.json())
            .then(data => {
                if (data.profileId) {
                    return data;
                }

                if (tries > 0) {
                    return self.searchPlayer(playerName, tries - 1);
                } else {
                    throw new Error(data);
                }
            })
            .catch(console.error);
    }

    public printPlayer(id, name, team, playerStats, gameStats, table, userTeamName) {
        userTeam = userTeamName;
        for (let i = 0; i < tableStats.length; i++) {
            if (!playerStats[tableStats[i]]) {
                playerStats[tableStats[i]] = 0;
            }
        }

        const statsObject = {
            "LVL" : {
                0 : playerStats.level,
                1 : playerStats.level,
                2 : playerStats.level
            },
            "Hacker %" : {
                0 : playerStats.hacker_percentage + '%',
                1 : playerStats.hacker_percentage + '%',
                2 : playerStats.hacker_percentage + '%'
            },
            "Kills" : {
                0 : playerStats.kills,
                1 : playerStats.rankedpvp_kills,
                2 : playerStats.casualpvp_kills
            },
            "Deaths" : {
                0 : playerStats.deaths,
                1 : playerStats.rankedpvp_death,
                2 : playerStats.casualpvp_death
            },
            "K/D" : {
                0 : playerStats.seasonalpvp_kd.toFixed(2),
                1 : playerStats.rankedpvp_kd.toFixed(2),
                2 : playerStats.casualpvp_kd.toFixed(2)
            },
            "Wins" : {
                0 : playerStats.wins,
                1 : playerStats.rankedpvp_matchwon,
                2 : playerStats.casualpvp_matchwon
            },
            "Losses" : {
                0 : playerStats.losses,
                1 : playerStats.rankedpvp_matchlost,
                2 : playerStats.casualpvp_matchlost
            },
            "W/L" : {
                0 : playerStats.seasonalpvp_winloss.toFixed(1) + "%",
                1 : playerStats.rankedpvp_winloss.toFixed(1) + "%",
                2 : playerStats.casualpvp_winloss.toFixed(1) + "%"
            },
            "Max MMR" : {
                0 : Math.trunc(playerStats.max_mmr),
                1 : Math.trunc(playerStats.max_mmr),
                2 : Math.trunc(playerStats.max_mmr)
            },
            "HS/K" : {
                0 : playerStats.generalpvp_headshotratio.toFixed(2),
                1 : playerStats.generalpvp_headshotratio.toFixed(2),
                2 : playerStats.generalpvp_headshotratio.toFixed(2)
            },
            "PEN/K" : {
                0 : playerStats.generalpvp_penetrationratio.toFixed(2),
                1 : playerStats.generalpvp_penetrationratio.toFixed(2),
                2 : playerStats.generalpvp_penetrationratio.toFixed(2)
            },
            "Games played" : {
                0 : playerStats.wins + playerStats.losses,
                1 : playerStats.rankedpvp_matchwon + playerStats.rankedpvp_matchlost,
                2 : playerStats.casualpvp_matchwon + playerStats.casualpvp_matchlost
            },
            "MMR change" : {
                0 : playerStats.last_match_mmr_change,
                1 : playerStats.last_match_mmr_change,
                2 : playerStats.last_match_mmr_change
            },
            "Alpha %" : {
                0 : Math.trunc(playerStats.lootbox_probability / 100) + "%",
                1 : Math.trunc(playerStats.lootbox_probability / 100) + "%",
                2 : Math.trunc(playerStats.lootbox_probability / 100) + "%"
            }
        }

        if (!allPlayerStats[team]) {
            allPlayerStats[team] = {};
        }
        allPlayerStats[team][id] = playerStats;

        const valuesCustom = JSON.parse(localStorage.valuesTable);
        const value =
        '<div class="player-tr" id="' + id + '">' +
            '<div class="name">' +
                '<div class="img-mmr">' +
                    '<img src="' + playerStats.rankInfo.image + '" alt="rank">' +
                    playerStats.mmr +
                '</div>' +
                '<span>' + name + '</span>' +
            '</div>' +

            '<div class="ranked current" id="ranked0' + id + '">' + statsObject[valuesCustom[0]][1] + '</div>' +
            '<div class="casual" id="casual0' + id + '">' + statsObject[valuesCustom[0]][2] + '</div>' +
            '<div class="seasonal" id="seasonal0' + id + '">' + statsObject[valuesCustom[0]][0] + '</div>' +
            '<div class="ranked current" id="ranked1' + id + '">' + statsObject[valuesCustom[1]][1] + '</div>' +
            '<div class="casual" id="casual1' + id + '">' + statsObject[valuesCustom[1]][2] + '</div>' +
            '<div class="seasonal" id="seasonal1' + id + '">' + statsObject[valuesCustom[1]][0] + '</div>' +
            '<div class="ranked current" id="ranked2' + id + '">' + statsObject[valuesCustom[2]][1] + '</div>' +
            '<div class="casual" id="casual2' + id + '">' + statsObject[valuesCustom[2]][2] + '</div>' +
            '<div class="seasonal" id="seasonal2' + id + '">' + statsObject[valuesCustom[2]][0] + '</div>' +
            '<div class="ranked current" id="ranked3' + id + '">' + statsObject[valuesCustom[3]][1] + '</div>' +
            '<div class="casual" id="casual3' + id + '">' + statsObject[valuesCustom[3]][2] + '</div>' +
            '<div class="seasonal" id="seasonal3' + id + '">' + statsObject[valuesCustom[3]][0] + '</div>' +
            '<div class="ranked current" id="ranked4' + id + '">' + statsObject[valuesCustom[4]][1] + '</div>' +
            '<div class="casual" id="casual4' + id + '">' + statsObject[valuesCustom[4]][2] + '</div>' +
            '<div class="seasonal" id="seasonal4' + id + '">' + statsObject[valuesCustom[4]][0] + '</div>' +
            '<div class="ranked current" id="ranked5' + id + '">' + statsObject[valuesCustom[5]][1] + '</div>' +
            '<div class="casual" id="casual5' + id + '">' + statsObject[valuesCustom[5]][2] + '</div>' +
            '<div class="seasonal" id="seasonal5' + id + '">' + statsObject[valuesCustom[5]][0] + '</div>' +
            '<div class="ranked current" id="ranked6' + id + '">' + statsObject[valuesCustom[6]][1] + '</div>' +
            '<div class="casual" id="casual6' + id + '">' + statsObject[valuesCustom[6]][2] + '</div>' +
            '<div class="seasonal" id="seasonal6' + id + '">' + statsObject[valuesCustom[6]][0] + '</div>' +
            '<div class="ranked current" id="ranked7' + id + '">' + statsObject[valuesCustom[7]][1] + '</div>' +
            '<div class="casual" id="casual7' + id + '">' + statsObject[valuesCustom[7]][2] + '</div>' +
            '<div class="seasonal" id="seasonal7' + id + '">' + statsObject[valuesCustom[7]][0] + '</div>' +
        '</div>';

        // table[id].innerHTML += value;

        playerCompare.teamsCompare(allPlayerStats, userTeam);

        this.logLine('log', 'updated', 'id: ' + id + ', trId: ' + table[id].id + ', name: ' + name + ', team: ' + team);
    }

    public clearPlayer(id, tr) {
        tr[id].remove();

        if (allPlayerStats.Blue[id]) {
            delete allPlayerStats.Blue[id];
        } else {
            delete allPlayerStats.Orange[id];
        }

        playerCompare.teamsCompare(allPlayerStats, userTeam);

        this.logLine('log', 'left', 'id: ' + id + ', trId: ' + tr[id].id);
    }

    public printDetailedPlayer(this: any, org) {
        const playerTrIdRaw = org.id;
        const rawId = org.childNodes[1].id;
        let playerTeam = playerTrIdRaw.split('-')[1];

        if (playerTeam === 'blue') {
            playerTeam = 'Blue';
        } else {
            playerTeam = 'Orange';
        }

        const rosterId = parseInt(rawId.match('.0(.*)')[1][0]);
        const statsPlayer = allPlayerStats[playerTeam][rosterId];

        // Right info
        let sec_num = parseInt(statsPlayer.generalpvp_timeplayed + statsPlayer.generalpve_timeplayed, 10);
        let hours   = Math.floor(sec_num / 3600);
        let minutes = Math.floor(sec_num / 60) % 60;

        (document.getElementById('detailedStats-profileImg') as HTMLImageElement).src = 'https://ubisoft-avatars.akamaized.net/' + statsPlayer.profileId + '/default_146_146.png';
        document.getElementById('detailedStats-name').innerHTML = statsPlayer.nameOnPlatform;
        document.getElementById('detailedStats-level').innerHTML = statsPlayer.level;
        document.getElementById('detailedStats-timePlayed').innerHTML = hours + 'h ' + minutes + 'm';
        document.getElementById('detailedStats-hsKills').innerHTML = statsPlayer.generalpvp_headshot;
        document.getElementById('detailedStats-hs').innerHTML = statsPlayer.generalpvp_headshotratio.toFixed(2);
        document.getElementById('detailedStats-penKills').innerHTML = statsPlayer.generalpvp_penetrationkills;
        document.getElementById('detailedStats-pen').innerHTML = statsPlayer.generalpvp_penetrationratio.toFixed(2);
        // Season
        (document.getElementById('season-previous-img') as HTMLImageElement).src = statsPlayer.rankInfo.image;
        if (statsPlayer.max_mmr !== 0) {
            document.getElementById('season-max-mmr').innerHTML = statsPlayer.max_mmr + '<span> Max Mmr</span>';
        } else {
            document.getElementById('season-max-mmr').innerHTML = statsPlayer.mmr + '<span> Max Mmr</span>';
        }
        if (statsPlayer.next_rank_mmr < statsPlayer.mmr && statsPlayer.next_rank_mmr !== 0) {
            document.getElementById('season-rank-bar').style.width = '100%';
        } else {
            document.getElementById('season-rank-bar').style.width = (statsPlayer.mmr - statsPlayer.previous_rank_mmr) / (statsPlayer.next_rank_mmr - statsPlayer.previous_rank_mmr) * 100 + '%';
        }
        if (statsPlayer.rank !== 0 && statsPlayer.next_rank_mmr > statsPlayer.mmr) {
            document.getElementById('season-rank-bar-text').innerHTML = statsPlayer.mmr + ' / ' + statsPlayer.next_rank_mmr;
        } else {
            document.getElementById('season-rank-bar-text').innerHTML = statsPlayer.mmr;
        }
        (document.getElementById('season-next-img') as HTMLImageElement).src = statsPlayer.nextRankInfo.image;
        (document.getElementById('season-max-img') as HTMLImageElement).src = statsPlayer.maxRankInfo.image;
        document.getElementById('detailedStats-kills').innerHTML = statsPlayer.kills;
        document.getElementById('detailedStats-deaths').innerHTML = statsPlayer.deaths;
        document.getElementById('detailedStats-kd').innerHTML = statsPlayer.seasonalpvp_kd.toFixed(2);
        document.getElementById('detailedStats-wins').innerHTML = statsPlayer.wins;
        document.getElementById('detailedStats-losses').innerHTML = statsPlayer.losses;
        document.getElementById('detailedStats-wl').innerHTML = statsPlayer.seasonalpvp_winloss.toFixed(2);
        document.getElementById('detailedStats-hacker-perc').innerHTML = statsPlayer.hacker_percentage + '%';

        sec_num = parseInt(statsPlayer.rankedpvp_timeplayed, 10);
        hours   = Math.floor(sec_num / 3600);
        minutes = Math.floor(sec_num / 60) % 60;

        document.getElementById('detailedStats-timePlayed-ranked').innerHTML = hours + 'h ' + minutes + 'm';
        document.getElementById('detailedStats-kills-ranked').innerHTML = statsPlayer.rankedpvp_kills;
        document.getElementById('detailedStats-deaths-ranked').innerHTML = statsPlayer.rankedpvp_death;
        document.getElementById('detailedStats-kd-ranked').innerHTML = statsPlayer.rankedpvp_kd.toFixed(2);
        document.getElementById('detailedStats-matchplayed-ranked').innerHTML = statsPlayer.rankedpvp_matchplayed;
        document.getElementById('detailedStats-wins-ranked').innerHTML = statsPlayer.rankedpvp_matchwon;
        document.getElementById('detailedStats-losses-ranked').innerHTML = statsPlayer.rankedpvp_matchlost;
        document.getElementById('detailedStats-wl-ranked').innerHTML = statsPlayer.rankedpvp_winloss.toFixed(2);
        // Casual
        sec_num = parseInt(statsPlayer.casualpvp_timeplayed, 10);
        hours   = Math.floor(sec_num / 3600);
        minutes = Math.floor(sec_num / 60) % 60;

        document.getElementById('detailedStats-timePlayed-casual').innerHTML = hours + 'h ' + minutes + 'm';
        document.getElementById('detailedStats-kills-casual').innerHTML = statsPlayer.casualpvp_kills;
        document.getElementById('detailedStats-deaths-casual').innerHTML = statsPlayer.casualpvp_death;
        document.getElementById('detailedStats-kd-casual').innerHTML = statsPlayer.casualpvp_kd.toFixed(2);
        document.getElementById('detailedStats-matchplayed-casual').innerHTML = statsPlayer.casualpvp_matchplayed;
        document.getElementById('detailedStats-wins-casual').innerHTML = statsPlayer.casualpvp_matchwon;
        document.getElementById('detailedStats-losses-casual').innerHTML = statsPlayer.casualpvp_matchlost;
        document.getElementById('detailedStats-wl-casual').innerHTML = statsPlayer.casualpvp_winloss.toFixed(2);

        // Player
        document.getElementById('detailedStats-distancetravelled').innerHTML = Math.floor(statsPlayer.generalpvp_distancetravelled / 1000) + 'km';
        document.getElementById('detailedStats-barricades-deployed').innerHTML = statsPlayer.generalpvp_barricadedeployed;
        document.getElementById('detailedStats-reinforcements-deployed').innerHTML = statsPlayer.generalpvp_reinforcementdeploy;
        document.getElementById('detailedStats-suicides').innerHTML = statsPlayer.generalpvp_suicide;
        document.getElementById('detailedStats-revives').innerHTML = statsPlayer.generalpvp_revive;
        document.getElementById('detailedStats-dbno').innerHTML = statsPlayer.generalpvp_dbno;
        document.getElementById('detailedStats-dbno-assists').innerHTML = statsPlayer.generalpvp_dbnoassists;
        document.getElementById('detailedStats-gadgets-destroyed').innerHTML = statsPlayer.generalpvp_gadgetdestroy;

        // general
        document.getElementById('detailedStats-kd-general').innerHTML = statsPlayer.generalpvp_kd;
        document.getElementById('detailedStats-kills-general').innerHTML = statsPlayer.generalpvp_kills;
        document.getElementById('detailedStats-deaths-general').innerHTML = statsPlayer.generalpvp_death;
        document.getElementById('detailedStats-wl-general').innerHTML = statsPlayer.generalpvp_wl;
        document.getElementById('detailedStats-wins-general').innerHTML = statsPlayer.generalpvp_matchwon;
        document.getElementById('detailedStats-losses-general').innerHTML = statsPlayer.generalpvp_winloss;

        document.getElementById('detailedStats-matches-played-general').innerHTML = statsPlayer.generalpvp_matchplayed;
        document.getElementById('detailedStats-assists-general').innerHTML = statsPlayer.generalpvp_killassists;
        document.getElementById('detailedStats-melee-kills-general').innerHTML = statsPlayer.generalpvp_meleekills;
        document.getElementById('detailedStats-blind-kills-general').innerHTML = statsPlayer.generalpvp_blindkills;
    }

    // for testing, Appends a new line to the specified log
    private logLine(type, log, data) {
        const logLine = '"' + log + '": ' + JSON.stringify(data, undefined, 2);

        if (type === 'log') {
            console.log(logLine);
        } else if (type === 'error') {
            console.error(logLine);
        } else if (type === 'warn') {
            console.warn(logLine);
        }
    }
}

export {
    allPlayerStats
}
