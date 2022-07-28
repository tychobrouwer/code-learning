import { getLocalStorage, setLocalStorage } from '../utils/helper';

import { PlayerDataType } from '../utils/types';

export class Player {
  getPlayerData(key: string) {
    return getLocalStorage(key);
  }

  setPlayerData(key: string, playerData: PlayerDataType) {
    return setLocalStorage(key, playerData);
  }

  createNewPlayer(male: boolean): PlayerDataType {
    const avatar = male ? 'Brendan' : 'May';

    const playerData = {
      position: {
        x: 100,
        y: 420,
      },
      location: 'littleroot town',
      pokemon: {}
    }

    const accountData = {
      avatar: avatar,
    }

    setLocalStorage('playerData', playerData);
    setLocalStorage('accountData', accountData);

    return playerData;
  }

}