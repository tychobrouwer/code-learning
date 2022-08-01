import * as pokedex from '../pokedex.json';

import { getLocalStorage, setLocalStorage, generatePokemon } from '../utils/helper';

import { PokedexType, PlayerDataType } from '../utils/types';

export class Player {
  public playerData!: PlayerDataType;
  private pokedex: PokedexType;

  constructor() {
    this.playerData = getLocalStorage('playerData');
    this.pokedex = pokedex;
  }

  getPlayerData() {
    return this.playerData;
  }

  getStoredPlayerData(key: string) {
    return getLocalStorage(key);
  }

  setPlayerPosition(location: string, x: number, y: number) {
    this.playerData.location = location;
    this.playerData.position.x = x;
    this.playerData.position.y = y;
  }

  addPlayerPokemon(pokemonId: number, levelRange: number[]) {
    this.playerData.pokemon.push(generatePokemon(this.pokedex[pokemonId.toString()], levelRange, pokemonId, 2));

    console.log(this.playerData.pokemon);
  }

  createNewPlayer(male: boolean): PlayerDataType {
    const avatar = male ? 'Brendan' : 'May';

    this.playerData = {
      position: {
        x: 100,
        y: 420,
      },
      location: 'littleroot town',
      pokemon: [],
      currentPokemon: 0,
    }

    const accountData = {
      avatar: avatar,
    }

    setLocalStorage('playerData', this.playerData);
    setLocalStorage('accountData', accountData);

    return this.playerData;
  }
}