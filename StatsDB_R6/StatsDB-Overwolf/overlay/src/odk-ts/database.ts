import { databaseObject } from '../consts';

export class Database {
    public async createIDB(nameIDB: string, keyPathIDB: string, version: number, indexes = null): Promise<any> {
        return new Promise<any>(async (resolve) => {
            const request = indexedDB.open('statsDB', version);

            console.log(`database creating ${nameIDB}, ${version}`);

            request.onerror = function () {
                console.log(request.error);

                resolve(request.error);
            };

            request.onupgradeneeded = function (event: any) {
                const db = request.result;
                let objectStore: IDBObjectStore;

                try {
                    objectStore = db.createObjectStore(nameIDB, { keyPath: keyPathIDB });
                } catch {
                    const transaction = event.target.transaction;
                    objectStore = transaction.objectStore(nameIDB);
                }

                if (indexes) {
                    indexes.forEach(index => {
                        try {
                            objectStore.createIndex(index, index);
                        } catch { }
                    });
                }

                db.close();

                resolve(objectStore);
            }

            resolve(request);
        })
    }

    public async storeToIDB(nameIDB: string, valueIDB, initiateIDB: boolean): Promise<any> {
        return new Promise<any>(async (resolve) => {
            const request = indexedDB.open('statsDB');

            request.onerror = function () {
                console.log(request.error);

                resolve(request.error);
            }

            request.onsuccess = function () {
                const db = request.result;

                const dbObjectStore = db.transaction(nameIDB, 'readwrite').objectStore(nameIDB);

                if (!initiateIDB) {
                    const result = dbObjectStore.put(valueIDB);

                    result.onsuccess = () => {
                        db.close();

                        resolve(result);
                    }

                    result.onerror = function () {
                        db.close();

                        resolve(result.error);
                    }
                } else if (initiateIDB) {
                    const result = dbObjectStore.add(valueIDB);

                    result.onsuccess = () => {
                        db.close();

                        resolve(result);
                    }

                    result.onerror = function () {
                        db.close();

                        resolve(result.error);
                    }
                }
            }
        })
    }

    public async readFromIDB(nameIDB: string, keyIDB: number | string, index: string = null): Promise<any> {
        return new Promise<any>(async (resolve) => {
            const requestDb = indexedDB.open('statsDB');

            requestDb.onerror = function () {
                console.log(requestDb.error);

                resolve(requestDb.error);
            };

            requestDb.onsuccess = function () {
                const db = requestDb.result;
                const dbObjectStore = db.transaction(nameIDB, 'readonly').objectStore(nameIDB);

                let request;

                if (index) {
                    request = dbObjectStore.index(index).get(keyIDB);
                } else {
                    request = dbObjectStore.get(keyIDB);
                }

                request.onerror = function () {
                    console.log(request.error);
                    db.close();

                    resolve(request.error);
                };

                request.onsuccess = function () {
                    db.close();

                    resolve(request.result);
                }
            }
        })
    }

    public async readFromIDBRange(nameIDB: string, index: string, beginRange: string, endRange: string, begin: number, end: number): Promise<any> {
        return new Promise<any>(async (resolve) => {
            const requestDb = indexedDB.open('statsDB');
            let keyRangeValue: IDBKeyRange;

            if (beginRange && endRange) {
                keyRangeValue = IDBKeyRange.bound(beginRange, endRange);
            } else if (beginRange && !endRange) {
                keyRangeValue = IDBKeyRange.lowerBound(beginRange);
            } else if (!beginRange && endRange) {
                keyRangeValue = IDBKeyRange.upperBound(endRange);
            } else if (!beginRange && !endRange) {
                keyRangeValue = IDBKeyRange.lowerBound(0);
            }

            requestDb.onerror = function () {
                console.log(requestDb.error);

                resolve(requestDb.error);
            };

            requestDb.onsuccess = function () {
                const db = requestDb.result;
                const objectStore = db.transaction(nameIDB, 'readonly').objectStore(nameIDB);
                const request = objectStore.index(index).openCursor(keyRangeValue, 'prev');

                let i = 0, j = 0, result = new Object;

                request.onerror = function () {
                    console.log(request.error);
                    db.close();

                    resolve(request.error);
                };

                request.onsuccess = function () {
                    const cursor = request.result;

                    if (cursor) {
                        if (begin !== 0 && i === 0) {
                            try {
                                cursor.advance(begin);
                                i = begin;
                            } catch {
                                db.close();

                                resolve(result);
                            }
                        } else if (cursor && i <= end && i >= begin) {
                            result[cursor.value.timeStamp] = JSON.parse(JSON.stringify(cursor.value));

                            i++;
                            j++;
                        } else if (!cursor) {
                            db.close();

                            resolve(result);
                        }

                        try {
                            cursor.continue();
                        } catch { }
                    } else {
                        db.close();

                        resolve(result);
                    }
                }
            }
        })
    }

    public async copyMatchDatabase(newDatabase: string, oldDatabase: string): Promise<any> {
        return new Promise<any>(async (resolve) => {
            const that: any = this;
            const requestDb = indexedDB.open('statsDB');

            requestDb.onerror = function () {
                console.log(requestDb.error);

                resolve(requestDb.error);
            };

            requestDb.onsuccess = function () {
                const db = requestDb.result;
                const objectStore = db.transaction(oldDatabase, 'readonly').objectStore(oldDatabase);
                const request = objectStore.openCursor();

                let result = new Object;

                request.onerror = function () {
                    console.log(request.error);

                    resolve(request.error);
                };

                request.onsuccess = function () {
                    const cursor = request.result;

                    if (cursor) {
                        if (cursor.value.matchId) {
                            result[cursor.value.matchId] = JSON.parse(JSON.stringify(cursor.value));
                        }

                        cursor.continue();
                    } else {
                        let i = 0;

                        for (const matchId in result) {
                            const promise = that.storeToIDB(newDatabase, result[matchId], false)
                                .then(() => {
                                    i++;

                                    if (i >= Object.keys(result).length) {
                                        db.close();

                                        resolve(result);
                                    }
                                })
                        }
                    }
                }
            }
        })
    }

    public async initAllIDB(): Promise<any> {
        return new Promise<any>(async (resolve) => {
            const that: any = this;

            const today: any = new Date();
            const firstDayOfYear: any = new Date(today.getFullYear(), 0, 1);
            const pastDaysOfYear: any = (today - firstDayOfYear) / 86400000;

            const keyIDBWeeks = `${Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)},${today.getFullYear()}`;
            const keyIDBDays = today.getDate() + ',' + (today.getMonth() + 1) + ',' + today.getFullYear();

            let valueIDBWeeks: any = {};
            for (let i = 0; i < 7; i++) {
                valueIDBWeeks[i] = JSON.parse(JSON.stringify(databaseObject));
            }
            valueIDBWeeks.week = keyIDBWeeks;

            let valueIDBDays: any = JSON.parse(JSON.stringify(databaseObject));
            valueIDBDays.date = keyIDBDays;

            const promise1 = this.storeToIDB('weeks', valueIDBWeeks, true);
            const promise2 = this.storeToIDB('days', valueIDBDays, true);

            const requestDb = indexedDB.open('statsDB');

            requestDb.onerror = function () {
                console.log(requestDb.error);

                resolve(requestDb.error);
            };

            requestDb.onsuccess = function () {
                const db = requestDb.result;

                if (db.objectStoreNames.contains('matches')) {
                    console.log('copying matches to new database...');

                    db.close();

                    const promise = that.copyMatchDatabase('savedMatches', 'matches');
                }
            }

            Promise.all([promise1, promise2])
                .then(result => resolve(result));
        })
    }

    public async displayDailyWeekly() {
        return new Promise<any>(async (resolve) => {
            const today: any = new Date();
            const firstDayOfYear: any = new Date(today.getFullYear(), 0, 1);
            const pastDaysOfYear: any = (today - firstDayOfYear) / 86400000;

            const keyIDBWeeks = `${Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)},${today.getFullYear()}`;
            const keyIDBDays = today.getDate() + ',' + (today.getMonth() + 1) + ',' + today.getFullYear();
            const settings = JSON.parse(localStorage.getItem('settings'));

            const promise1 = this.readFromIDB('weeks', keyIDBWeeks)
                .then(resultWeek => {
                    let weeklyStats: any = {
                        "general": {
                            "kills": 0,
                            "deaths": 0,
                            "losses": 0,
                            "wins": 0,
                            "kd": "0",
                            "wl": "0",
                            "attributeValueKD": "0, 100",
                            "attributeValueWL": '0, 100'
                        },
                        "casual": {
                            "kills": 0,
                            "deaths": 0,
                            "losses": 0,
                            "wins": 0,
                            "kd": "0",
                            "wl": "0",
                            "attributeValueKD": "0, 100",
                            "attributeValueWL": '0, 100'
                        },
                        "ranked": {
                            "kills": 0,
                            "deaths": 0,
                            "losses": 0,
                            "wins": 0,
                            "kd": "0",
                            "wl": "0",
                            "attributeValueKD": "0, 100",
                            "attributeValueWL": '0, 100'
                        },
                        "unranked": {
                            "kills": 0,
                            "deaths": 0,
                            "losses": 0,
                            "wins": 0,
                            "kd": "0",
                            "wl": "0",
                            "attributeValueKD": "0, 100",
                            "attributeValueWL": '0, 100'
                        }
                    }

                    for (let i = 0; i < 7; i++) {
                        weeklyStats.general.kills += resultWeek[i].MATCHMAKING_PVP.kills + resultWeek[i].MATCHMAKING_PVP_RANKED.kills + resultWeek[i].MATCHMAKING_PVP_UNRANKED.kills;
                        weeklyStats.general.deaths += resultWeek[i].MATCHMAKING_PVP.deaths + resultWeek[i].MATCHMAKING_PVP_RANKED.deaths + resultWeek[i].MATCHMAKING_PVP_UNRANKED.deaths;
                        weeklyStats.general.wins += resultWeek[i].MATCHMAKING_PVP.wins + resultWeek[i].MATCHMAKING_PVP_RANKED.wins + resultWeek[i].MATCHMAKING_PVP_UNRANKED.wins;
                        weeklyStats.general.losses += resultWeek[i].MATCHMAKING_PVP.losses + resultWeek[i].MATCHMAKING_PVP_RANKED.losses + resultWeek[i].MATCHMAKING_PVP_UNRANKED.losses;
                        weeklyStats.casual.kills += resultWeek[i].MATCHMAKING_PVP.kills;
                        weeklyStats.casual.deaths += resultWeek[i].MATCHMAKING_PVP.deaths;
                        weeklyStats.casual.wins += resultWeek[i].MATCHMAKING_PVP.wins;
                        weeklyStats.casual.losses += resultWeek[i].MATCHMAKING_PVP.losses;
                        weeklyStats.ranked.kills += resultWeek[i].MATCHMAKING_PVP_RANKED.kills;
                        weeklyStats.ranked.deaths += resultWeek[i].MATCHMAKING_PVP_RANKED.deaths;
                        weeklyStats.ranked.wins += resultWeek[i].MATCHMAKING_PVP_RANKED.wins;
                        weeklyStats.ranked.losses += resultWeek[i].MATCHMAKING_PVP_RANKED.losses;
                        weeklyStats.unranked.kills += resultWeek[i].MATCHMAKING_PVP_UNRANKED.kills;
                        weeklyStats.unranked.deaths += resultWeek[i].MATCHMAKING_PVP_UNRANKED.deaths;
                        weeklyStats.unranked.wins += resultWeek[i].MATCHMAKING_PVP_UNRANKED.wins;
                        weeklyStats.unranked.losses += resultWeek[i].MATCHMAKING_PVP_UNRANKED.losses;
                    }

                    Object.keys(weeklyStats).forEach(obj => {
                        let gameMode = weeklyStats[obj];

                        if (gameMode.deaths != 0) {
                            gameMode.kd = ((gameMode.kills / gameMode.deaths).toFixed(2)).toString();
                            gameMode.attributeValueKD = Math.round(gameMode.kills / gameMode.deaths * 33) + ', 100';
                        } else if (gameMode.deaths === 0 && gameMode.kills != 0) {
                            gameMode.kd = 'INF';
                            gameMode.attributeValueKD = '100, 100';
                        } else {
                            gameMode.kd = '0.00';
                            gameMode.attributeValueKD = '0, 100';
                        }

                        if ((gameMode.wins + gameMode.losses) != 0) {
                            gameMode.wl = (Math.round(gameMode.wins / (gameMode.wins + gameMode.losses) * 100)).toString();
                            gameMode.attributeValueWL = gameMode.wl + ', 100';
                        } else {
                            gameMode.wl = '0';
                            gameMode.attributeValueWL = '0, 100';
                        }
                    });

                    document.getElementById('kd-circle-weekly').setAttribute('stroke-dasharray', weeklyStats[settings.circle].attributeValueKD);
                    document.getElementById('wl-circle-weekly').setAttribute('stroke-dasharray', weeklyStats[settings.circle].attributeValueWL);
                    document.getElementById('kd-circle-weekly-text').innerHTML = parseFloat(weeklyStats[settings.circle].kd).toFixed(2);
                    document.getElementById('wl-circle-weekly-text').innerHTML = weeklyStats[settings.circle].wl + '%';

                    console.log("WeeklyStats:", weeklyStats);

                    return weeklyStats;
                });

            const promise2 = this.readFromIDB('days', keyIDBDays)
                .then(resultDay => {
                    let dailyStats: any = {
                        "general": {
                            "kills": resultDay.MATCHMAKING_PVP.kills + resultDay.MATCHMAKING_PVP_RANKED.kills + resultDay.MATCHMAKING_PVP_UNRANKED.kills,
                            "deaths": resultDay.MATCHMAKING_PVP.deaths + resultDay.MATCHMAKING_PVP_RANKED.deaths + resultDay.MATCHMAKING_PVP_UNRANKED.deaths,
                            "losses": resultDay.MATCHMAKING_PVP.losses + resultDay.MATCHMAKING_PVP_RANKED.losses + resultDay.MATCHMAKING_PVP_UNRANKED.losses,
                            "wins": resultDay.MATCHMAKING_PVP.wins + resultDay.MATCHMAKING_PVP_RANKED.wins + resultDay.MATCHMAKING_PVP_UNRANKED.wins,
                            "kd": "0",
                            "wl": "0",
                            "attributeValueKD": "0, 100",
                            "attributeValueWL": '0, 100'
                        },
                        "casual": {
                            "kills": resultDay.MATCHMAKING_PVP.kills,
                            "deaths": resultDay.MATCHMAKING_PVP.deaths,
                            "losses": resultDay.MATCHMAKING_PVP.losses,
                            "wins": resultDay.MATCHMAKING_PVP.wins,
                            "kd": "0",
                            "wl": "0",
                            "attributeValueKD": "0, 100",
                            "attributeValueWL": '0, 100'
                        },
                        "ranked": {
                            "kills": resultDay.MATCHMAKING_PVP_RANKED.kills,
                            "deaths": resultDay.MATCHMAKING_PVP_RANKED.deaths,
                            "losses": resultDay.MATCHMAKING_PVP_RANKED.losses,
                            "wins": resultDay.MATCHMAKING_PVP_RANKED.wins,
                            "kd": "0",
                            "wl": "0",
                            "attributeValueKD": "0, 100",
                            "attributeValueWL": '0, 100'
                        },
                        "unranked": {
                            "kills": resultDay.MATCHMAKING_PVP_UNRANKED.kills,
                            "deaths": resultDay.MATCHMAKING_PVP_UNRANKED.deaths,
                            "losses": resultDay.MATCHMAKING_PVP_UNRANKED.losses,
                            "wins": resultDay.MATCHMAKING_PVP_UNRANKED.wins,
                            "kd": "0",
                            "wl": "0",
                            "attributeValueKD": "0, 100",
                            "attributeValueWL": '0, 100'
                        }
                    }

                    Object.keys(dailyStats).forEach(obj => {
                        let gameMode = dailyStats[obj];

                        if (gameMode.deaths !== 0) {
                            gameMode.kd = ((gameMode.kills / gameMode.deaths).toFixed(2)).toString();
                            gameMode.attributeValueKD = Math.round(gameMode.kills / gameMode.deaths * 33) + ', 100';
                        } else if (gameMode.deaths === 0 && gameMode.kills !== 0) {
                            gameMode.kd = 'INF';
                            gameMode.attributeValueKD = '100, 100';
                        } else {
                            gameMode.kd = '0.00';
                            gameMode.attributeValueKD = '0, 100';
                        }

                        if ((gameMode.wins + gameMode.losses) !== 0) {
                            gameMode.wl = (Math.round(gameMode.wins / (gameMode.wins + gameMode.losses) * 100)).toString();
                            gameMode.attributeValueWL = gameMode.wl + ', 100';
                        } else {
                            gameMode.wl = '0';
                            gameMode.attributeValueWL = '0, 100';
                        }
                    });

                    document.getElementById('kd-circle-daily').setAttribute('stroke-dasharray', dailyStats[settings.circle].attributeValueKD);
                    document.getElementById('wl-circle-daily').setAttribute('stroke-dasharray', dailyStats[settings.circle].attributeValueWL);
                    document.getElementById('kd-circle-daily-text').innerHTML = parseFloat(dailyStats[settings.circle].kd).toFixed(2);
                    document.getElementById('wl-circle-daily-text').innerHTML = dailyStats[settings.circle].wl + '%';

                    console.log("DailyStats:", dailyStats);

                    return dailyStats;
                })

            const statsNavBtn = document.getElementsByClassName('daily-weekly-nav-btn');
            for (let i = 0; i < statsNavBtn.length; i++) {
                statsNavBtn[i].classList.remove('active');
            }

            document.getElementById(settings.circle).classList.add('active');

            Promise.all([promise1, promise2])
                .then(result => resolve(result));
        })
    }
}