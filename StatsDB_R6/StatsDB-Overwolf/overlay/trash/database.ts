import { databaseStats } from '../consts';

const kdCircleDaily = document.getElementById('kd-circle-daily');
const wlCircleDaily = document.getElementById('wl-circle-daily');
const kdCircleDailyText = document.getElementById('kd-circle-daily-text');
const wlCircleDailyText = document.getElementById('wl-circle-daily-text');
const kdCircleWeekly = document.getElementById('kd-circle-weekly');
const wlCircleWeekly = document.getElementById('wl-circle-weekly');
const kdCircleWeeklyText = document.getElementById('kd-circle-weekly-text');
const wlCircleWeeklyText = document.getElementById('wl-circle-weekly-text');

export class OldDatabase {
    public createDatabase(): Promise < void > {
        const self = this;

        return new Promise < void > (async (resolve) => {
            const openRequestDays = indexedDB.open('days');
            let result;

            openRequestDays.onerror = function(event) {
                self.logLine('error', 'database', openRequestDays.error);
                result = openRequestDays.error;
            };

            openRequestDays.onupgradeneeded = function(event: any) {
                const dbDays = openRequestDays.result;
                const objectStoreDays = dbDays.createObjectStore('days', { keyPath: 'date' });
            }

            const openRequestWeek = indexedDB.open('week');

            openRequestWeek.onerror = function(event) {
                self.logLine('error', 'database', openRequestWeek.error);
                result = openRequestWeek.error;
            };

            openRequestWeek.onupgradeneeded = function(event: any) {
                const dbWeek = openRequestWeek.result;
                const objectStoreWeek = dbWeek.createObjectStore('week', { keyPath: 'week' });
            }

            resolve();
        })
    }

    public initiateIDB() {
        const newDate = new Date();
        const rawDay = newDate.getDate();
        const rawDate = newDate.getMonth();
        const rawYear = newDate.getFullYear();

        const daysJsonKey = rawDay + ',' + (rawDate + 1) + ',' + rawYear;
        const self = this;

        const openRequestDays = indexedDB.open('days');

        openRequestDays.onerror = function(event) {
            self.logLine('error', 'database', openRequestDays.error);
        };

        openRequestDays.onsuccess = function(event: any) {
            const dbDays = openRequestDays.result;
            const daysObjectStore = dbDays.transaction('days', 'readwrite').objectStore('days').get(daysJsonKey);

            daysObjectStore.onerror = function(event) {
                self.logLine('error', 'database', daysObjectStore.error);
            };

            daysObjectStore.onsuccess = function(event) {
                const resultDays = daysObjectStore.result;

                if (!resultDays) {
                    const daysAdd = dbDays.transaction('days', 'readwrite').objectStore('days').add(
                        { date: daysJsonKey, MATCHMAKING_PVP_RANKED: { kills: 0, deaths: 0, wins: 0, losses: 0 }, MATCHMAKING_PVP: { kills: 0, deaths: 0, wins: 0, losses: 0 }, MATCHMAKING_PVP_UNRANKED: { kills: 0, deaths: 0, wins: 0, losses: 0 }}
                    );
                }
            }
        }

        const openRequestWeek = indexedDB.open('week');

        openRequestWeek.onerror = function(event) {
            self.logLine('error', 'database', openRequestWeek.error);
        };

        openRequestWeek.onsuccess = function(event: any) {
            const dbWeek = openRequestWeek.result;
            const weekObjectStore = dbWeek.transaction('week', 'readwrite').objectStore('week').get('week');

            weekObjectStore.onerror = function(event) {
                self.logLine('error', 'database', weekObjectStore.error);
            };

            weekObjectStore.onsuccess = function(event) {
                const resultWeek = weekObjectStore.result;

                if (!resultWeek) {
                    let week = {};
                    const date = new Date();

                    for (let i = 0; i < 7; i++) {
                        const dateDay = date.getDate();
                        const dateDate = date.getMonth();
                        const dateYear = date.getFullYear();
                        const daysWeekJsonKey = dateDay + ',' + (dateDate + 1) + ',' + dateYear;

                        week[i] = { date: daysWeekJsonKey, MATCHMAKING_PVP_RANKED: { kills: 0, deaths: 0, wins: 0, losses: 0 }, MATCHMAKING_PVP: { kills: 0, deaths: 0, wins: 0, losses: 0 }, MATCHMAKING_PVP_UNRANKED: { kills: 0, deaths: 0, wins: 0, losses: 0 }};

                        date.setDate(date.getDate() - 1);
                    }
                    week['week'] = 'week';

                    const weekAdd = dbWeek.transaction('week', 'readwrite').objectStore('week').add({week: 'week', value: week});
                }
            }
        }
    }

    public localStoreMatch(gameMode, outcome, latestStats) {
        const newDate = new Date();
        const rawDay = newDate.getDate();
        const rawDate = newDate.getMonth();
        const rawYear = newDate.getFullYear();

        const daysJsonKey = rawDay + ',' + (rawDate + 1) + ',' + rawYear;
        const self = this;

        const openRequestDays = indexedDB.open('days');

        openRequestDays.onerror = function(event) {
            self.logLine('error', 'database', openRequestDays.error);
        };

        openRequestDays.onsuccess = function(event: any) {
            const dbDays = openRequestDays.result;
            const daysObjectStore = dbDays.transaction('days', 'readwrite').objectStore('days').get(daysJsonKey);

            daysObjectStore.onerror = function(event) {
                self.logLine('error', 'database', daysObjectStore.error);
            };

            daysObjectStore.onsuccess = function(event) {
                const resultDay = daysObjectStore.result;

                if (latestStats.kills !== 0) {
                    resultDay[gameMode].kills += latestStats.kills;
                }

                if (latestStats.deaths !== 0) {
                    resultDay[gameMode].deaths += latestStats.deaths;
                }

                if (outcome === 'victory') {
                    resultDay[gameMode].wins ++;
                } else if (outcome === 'defeat') {
                    resultDay[gameMode].losses ++;
                }

                const daysAdd = dbDays.transaction('days', 'readwrite').objectStore('days').put(resultDay);
            }
        }

        const openRequestWeek = indexedDB.open('week');

        openRequestWeek.onerror = function(event) {
            self.logLine('error', 'database', openRequestWeek.error);
        };

        openRequestWeek.onsuccess = function(event: any) {
            const dbWeek = openRequestWeek.result;
            const weekObjectStore = dbWeek.transaction('week', 'readwrite').objectStore('week').get('week');

            weekObjectStore.onerror = function(event) {
                self.logLine('error', 'database', weekObjectStore.error);
            };

            weekObjectStore.onsuccess = function(event) {
                const resultWeek = weekObjectStore.result.value;
                const resultWeekArray: any = Object.values(resultWeek);

                let week;
                let dayExists = null;

                for (let i = 0; i < 7; i++) {
                    if (resultWeekArray[i].date === daysJsonKey) {
                        dayExists = i;
                        break;
                    }
                }

                if (dayExists !== null) {
                    week = resultWeekArray[dayExists];
                } else {
                    week = { date: daysJsonKey, MATCHMAKING_PVP_RANKED: { kills: 0, deaths: 0, wins: 0, losses: 0 }, MATCHMAKING_PVP: { kills: 0, deaths: 0, wins: 0, losses: 0 }, MATCHMAKING_PVP_UNRANKED: { kills: 0, deaths: 0, wins: 0, losses: 0 }};
                }

                if (latestStats.kills !== 0) {
                    week[gameMode].kills += latestStats.kills;
                }

                if (latestStats.deaths !== 0) {
                    week[gameMode].deaths += latestStats.deaths;
                }

                if (outcome === 'victory') {
                    week[gameMode].wins ++;
                } else if (outcome === 'defeat') {
                    week[gameMode].losses ++;
                }

                if (dayExists !== null) {
                    resultWeekArray[dayExists] = week;
                } else {
                    resultWeekArray.unshift(week);
                    resultWeekArray.pop();
                }

                const finalResultWeek = Object.assign({}, resultWeekArray);

                self.logLine('log', 'weekResult', finalResultWeek);

                const weekAdd = dbWeek.transaction('week', 'readwrite').objectStore('week').put({week: 'week', value: finalResultWeek});
            }
        }
    }

    public printDailyWeekly() {
        const newDate = new Date();
        const rawDay = newDate.getDate();
        const rawDate = newDate.getMonth();
        const rawYear = newDate.getFullYear();

        const daysJsonKey = rawDay + ',' + (rawDate + 1) + ',' + rawYear;
        const self = this;

        const openRequestDay = indexedDB.open('days');

        openRequestDay.onerror = function(event) {
            self.logLine('error', 'database', openRequestDay.error);
        };

        openRequestDay.onsuccess = function(event: any) {
            const dbDay = openRequestDay.result;
            const dayObjectStore = dbDay.transaction('days', 'readwrite').objectStore('days').get(daysJsonKey);

            dayObjectStore.onerror = function(event) {
                self.logLine('error', 'database', dayObjectStore.error);
            };

            dayObjectStore.onsuccess = function(event) {
                const resultDay = dayObjectStore.result;

                const kills = resultDay.MATCHMAKING_PVP.kills + resultDay.MATCHMAKING_PVP_RANKED.kills + resultDay.MATCHMAKING_PVP_UNRANKED.kills;
                const deaths = resultDay.MATCHMAKING_PVP.deaths + resultDay.MATCHMAKING_PVP_RANKED.deaths + resultDay.MATCHMAKING_PVP_UNRANKED.deaths;
                const losses = resultDay.MATCHMAKING_PVP.losses + resultDay.MATCHMAKING_PVP_RANKED.losses + resultDay.MATCHMAKING_PVP_UNRANKED.losses;
                const wins = resultDay.MATCHMAKING_PVP.wins + resultDay.MATCHMAKING_PVP_RANKED.wins + resultDay.MATCHMAKING_PVP_UNRANKED.wins;

                let attributeValueKD;
                let attributeValueWL;
                let kd;
                let wl;

                if (deaths !== 0) {
                    kd = Math.round(((kills / deaths) + Number.EPSILON) * 100) / 100;
                    attributeValueKD = Math.round(kills / deaths * 33) + ', 100';
                } else if (deaths !== 0 && kills !== 0) {
                    kd = 'INF';
                    attributeValueKD = '100, 100';
                } else {
                    kd = '0.00';
                    attributeValueKD = '0, 100';
                }

                if ((wins + losses) !== 0) {
                    wl = Math.round(wins / (wins + losses) * 100);
                    attributeValueWL = wl + ', 100';
                } else {
                    wl = '0';
                    attributeValueWL = '0, 100';
                }

                kdCircleDaily.setAttribute('stroke-dasharray', attributeValueKD);
                wlCircleDaily.setAttribute('stroke-dasharray', attributeValueWL);
                kdCircleDailyText.innerHTML = parseFloat(kd).toFixed(2);
                wlCircleDailyText.innerHTML = wl + '%';

                self.logLine('log', 'dailyKD', kd);
                self.logLine('log', 'dailyWL', wl);
            }
        }

        const openRequestWeek = indexedDB.open('week');

        openRequestWeek.onerror = function(event) {
            self.logLine('error', 'database', openRequestWeek.error);
        };

        openRequestWeek.onsuccess = function(event: any) {
            const dbWeek = openRequestWeek.result;
            const weekObjectStore = dbWeek.transaction('week', 'readwrite').objectStore('week').get('week');

            weekObjectStore.onerror = function(event) {
                self.logLine('error', 'database', weekObjectStore.error);
            };

            weekObjectStore.onsuccess = function(event) {
                const resultWeekArray = weekObjectStore.result;
                const resultWeek = resultWeekArray.value;

                let kills = 0;
                let deaths = 0;
                let losses = 0;
                let wins = 0;

                for (let i = 0; i < 7; i++) {
                    kills += resultWeek[i].MATCHMAKING_PVP.kills;
                    deaths += resultWeek[i].MATCHMAKING_PVP.deaths;
                    wins += resultWeek[i].MATCHMAKING_PVP.wins;
                    losses += resultWeek[i].MATCHMAKING_PVP.losses;
                    kills += resultWeek[i].MATCHMAKING_PVP_RANKED.kills;
                    deaths += resultWeek[i].MATCHMAKING_PVP_RANKED.deaths;
                    wins += resultWeek[i].MATCHMAKING_PVP_RANKED.wins;
                    losses += resultWeek[i].MATCHMAKING_PVP_RANKED.losses;
                    kills += resultWeek[i].MATCHMAKING_PVP_UNRANKED.kills;
                    deaths += resultWeek[i].MATCHMAKING_PVP_UNRANKED.deaths;
                    wins += resultWeek[i].MATCHMAKING_PVP_UNRANKED.wins;
                    losses += resultWeek[i].MATCHMAKING_PVP_UNRANKED.losses;
                }

                let attributeValueKD;
                let attributeValueWL;
                let kd;
                let wl;

                if (deaths !== 0) {
                    kd = Math.round(((kills / deaths) + Number.EPSILON) * 100) / 100;
                    attributeValueKD = Math.round(kills / deaths * 33) + ', 100';
                } else if (deaths === 0 && kills !== 0) {
                    kd = 'INF';
                    attributeValueKD = '100, 100';
                } else {
                    kd = '0.00';
                    attributeValueKD = '0, 100';
                }

                if ((wins + losses) !== 0) {
                    wl = Math.round(wins / (wins + losses) * 100);
                    attributeValueWL = wl + ', 100';
                } else {
                    wl = '0';
                    attributeValueWL = '0, 100';
                }

                kdCircleWeekly.setAttribute('stroke-dasharray', attributeValueKD);
                wlCircleWeekly.setAttribute('stroke-dasharray', attributeValueWL);
                kdCircleWeeklyText.innerHTML = parseFloat(kd).toFixed(2);
                wlCircleWeeklyText.innerHTML = wl + '%';

                self.logLine('log', 'weeklyKD', kd);
                self.logLine('log', 'weeklyWL', wl);
            }
        }
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

////////////////// DONT USE YET /////////////////////
export class Database {
    public async createIDB(nameIDB, keyPathIDB) {
        return new Promise <any> (async (resolve) => {
            const request = indexedDB.open(nameIDB);

            request.onerror = function(event: any) {
                resolve(request.error);
            };

            request.onupgradeneeded = function(event: any) {
                const db = event.target.result;

                resolve(db.createObjectStore(nameIDB, { keyPath: keyPathIDB }));
            }
        })
    }

    public async storeToIDB(nameIDB, keyIDB, valueIDB, initiateIDB) {
        return new Promise <any> (async (resolve) => {
            const request = indexedDB.open(nameIDB);

            request.onerror = function(event: any) {
                resolve(request.error);
            };

            request.onsuccess = function(event: any) {
                let db = event.target.result;

                const dbObjectStore = db.transaction(nameIDB, 'readwrite').objectStore(nameIDB)
                const dbGet = dbObjectStore.get(keyIDB);

                dbGet.onerror = function(event) {
                    resolve(request.error);
                };

                dbGet.onsuccess = function(event) {
                    const dbResult = dbGet.result;

                    if (!initiateIDB || !dbResult) {
                        resolve(dbObjectStore.put(valueIDB));
                    }
                }
            }
        })
    }

    public async readFromIDB(nameIDB, keyIDB) {
        return new Promise <any> (async (resolve) => {
            const request = indexedDB.open(nameIDB);

            request.onerror = function(event: any) {
                resolve(request.error);
            };

            request.onsuccess = function(event: any) {
                const db = event.target.result;

                const dbObjectStore = db.transaction(nameIDB, 'readwrite').objectStore(nameIDB).get(keyIDB);

                dbObjectStore.onerror = function(event) {
                    resolve(request.error);
                };

                dbObjectStore.onsuccess = function(event) {
                    resolve(event.target.result);
                }
            }
        })
    }

    public async initAllIDB() {
        return new Promise <any> (async (resolve) => {
            let dbResult: any = {};

            const today: any = new Date();
            const firstDayOfYear: any = new Date(today.getFullYear(), 0, 1);
            const pastDaysOfYear: any = (today - firstDayOfYear) / 86400000;

            const keyIDBWeeks = `${Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)},${today.getFullYear()}`;

            let valueIDBWeeks: any = {};
            for (let i = 0; i < 7; i++) {
                valueIDBWeeks[i] = databaseStats;
            }
            valueIDBWeeks.week = keyIDBWeeks;

            dbResult.weeks = this.storeToIDB('weeks', keyIDBWeeks, valueIDBWeeks, true);

            const keyIDBDays = today.getDate() + ',' + (today.getMonth() + 1) + ',' + today.getFullYear();

            let valueIDBDays: any = databaseStats;
            valueIDBDays.date = keyIDBDays;

            dbResult.days = this.storeToIDB('days', keyIDBDays, valueIDBDays, true);

            resolve(dbResult);
        })
    }

    public async displayDailyWeekly() {
        return new Promise <any> (async (resolve) => {
            let dbResult: any = {};

            const today: any = new Date();
            const firstDayOfYear: any = new Date(today.getFullYear(), 0, 1);
            const pastDaysOfYear: any = (today - firstDayOfYear) / 86400000;

            const keyIDBWeeks = `${Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)},${today.getFullYear()}`;
            const keyIDBDays = today.getDate() + ',' + (today.getMonth() + 1) + ',' + today.getFullYear();

            const promise1 = this.readFromIDB('weeks', keyIDBWeeks)
                .then(resultWeek => {
                    let kills = 0;
                    let deaths = 0;
                    let losses = 0;
                    let wins = 0;

                    for (let i = 0; i < 7; i++) {
                        kills += resultWeek[i].MATCHMAKING_PVP.kills;
                        deaths += resultWeek[i].MATCHMAKING_PVP.deaths;
                        wins += resultWeek[i].MATCHMAKING_PVP.wins;
                        losses += resultWeek[i].MATCHMAKING_PVP.losses;
                        kills += resultWeek[i].MATCHMAKING_PVP_RANKED.kills;
                        deaths += resultWeek[i].MATCHMAKING_PVP_RANKED.deaths;
                        wins += resultWeek[i].MATCHMAKING_PVP_RANKED.wins;
                        losses += resultWeek[i].MATCHMAKING_PVP_RANKED.losses;
                        kills += resultWeek[i].MATCHMAKING_PVP_UNRANKED.kills;
                        deaths += resultWeek[i].MATCHMAKING_PVP_UNRANKED.deaths;
                        wins += resultWeek[i].MATCHMAKING_PVP_UNRANKED.wins;
                        losses += resultWeek[i].MATCHMAKING_PVP_UNRANKED.losses;
                    }

                    let attributeValueKD;
                    let attributeValueWL;
                    let kd;
                    let wl;

                    if (deaths !== 0) {
                        kd = Math.round(((kills / deaths) + Number.EPSILON) * 100) / 100;
                        attributeValueKD = Math.round(kills / deaths * 33) + ', 100';
                    } else if (deaths === 0 && kills !== 0) {
                        kd = 'INF';
                        attributeValueKD = '100, 100';
                    } else {
                        kd = '0.00';
                        attributeValueKD = '0, 100';
                    }

                    if ((wins + losses) !== 0) {
                        wl = Math.round(wins / (wins + losses) * 100);
                        attributeValueWL = wl + ', 100';
                    } else {
                        wl = '0';
                        attributeValueWL = '0, 100';
                    }

                    kdCircleWeekly.setAttribute('stroke-dasharray', attributeValueKD);
                    wlCircleWeekly.setAttribute('stroke-dasharray', attributeValueWL);
                    kdCircleWeeklyText.innerHTML = parseFloat(kd).toFixed(2);
                    wlCircleWeeklyText.innerHTML = wl + '%';

                    console.log(`weekly KD "${kd}"`);
                    console.log(`weekly WL "${wl}"`);
                });

            const promise2 = this.readFromIDB('days', keyIDBDays)
                .then(resultDay => {
                    const kills = resultDay.MATCHMAKING_PVP.kills + resultDay.MATCHMAKING_PVP_RANKED.kills + resultDay.MATCHMAKING_PVP_UNRANKED.kills;
                    const deaths = resultDay.MATCHMAKING_PVP.deaths + resultDay.MATCHMAKING_PVP_RANKED.deaths + resultDay.MATCHMAKING_PVP_UNRANKED.deaths;
                    const losses = resultDay.MATCHMAKING_PVP.losses + resultDay.MATCHMAKING_PVP_RANKED.losses + resultDay.MATCHMAKING_PVP_UNRANKED.losses;
                    const wins = resultDay.MATCHMAKING_PVP.wins + resultDay.MATCHMAKING_PVP_RANKED.wins + resultDay.MATCHMAKING_PVP_UNRANKED.wins;

                    let attributeValueKD;
                    let attributeValueWL;
                    let kd;
                    let wl;

                    if (deaths !== 0) {
                        kd = Math.round(((kills / deaths) + Number.EPSILON) * 100) / 100;
                        attributeValueKD = Math.round(kills / deaths * 33) + ', 100';
                    } else if (deaths !== 0 && kills !== 0) {
                        kd = 'INF';
                        attributeValueKD = '100, 100';
                    } else {
                        kd = '0.00';
                        attributeValueKD = '0, 100';
                    }

                    if ((wins + losses) !== 0) {
                        wl = Math.round(wins / (wins + losses) * 100);
                        attributeValueWL = wl + ', 100';
                    } else {
                        wl = '0';
                        attributeValueWL = '0, 100';
                    }

                    kdCircleDaily.setAttribute('stroke-dasharray', attributeValueKD);
                    wlCircleDaily.setAttribute('stroke-dasharray', attributeValueWL);
                    kdCircleDailyText.innerHTML = parseFloat(kd).toFixed(2);
                    wlCircleDailyText.innerHTML = wl + '%';

                    console.log(`daily KD "${kd}"`);
                    console.log(`daily WL "${wl}"`);
                })
        })
    }
}
