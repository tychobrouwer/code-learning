"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const helper_1 = require("../utils/helper");
class Player {
    getPlayerData(key) {
        return (0, helper_1.getLocalStorage)(key);
    }
    // setPlayerData(key: string, playerData: PlayerDataType) {
    //   return setLocalStorage(key, playerData);
    // }
    createNewPlayer(male) {
        const avatar = male ? 'Brendan' : 'May';
        const playerData = {
            position: {
                x: 100,
                y: 420,
            },
            location: 'littleroot town',
            pokemon: {}
        };
        const accountData = {
            avatar: avatar,
        };
        (0, helper_1.setLocalStorage)('playerData', playerData);
        (0, helper_1.setLocalStorage)('accountData', accountData);
        return playerData;
    }
}
exports.Player = Player;
//# sourceMappingURL=player.js.map