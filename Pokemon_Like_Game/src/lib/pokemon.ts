type pokemonIndexType = {
  [level: number]: {
    [environment: string]: {
      [name: string]: pokemonType
    }
  }
}

type pokemonType = {
  name: string,
  level: Array<number>,
  encounterRate: number
}

const pokemonIndex: pokemonIndexType = {
  1: {
    grassland: {
      zigzagoon: {
        name: 'Zigzagoon',
        level: [2, 3],
        encounterRate: 45
      },
      wurmple: {
        name: 'Wurmple',
        level: [2, 3],
        encounterRate: 45
      },
      poochyena: {
        name: 'Poochyena',
        level: [2, 3],
        encounterRate: 10
      }
    }  
  },
  2: {
    
  }
}

export class Pokemon {
  pokemon: pokemonType;

  constructor(route: number, environment: string) {
    const candinates = pokemonIndex[route][environment];

    const items: Array<string> = [];

    for (const pokemon in candinates) {
      for (let i = 1; i <= candinates[pokemon].encounterRate; i++) {
        items.push(pokemon)
      }
    }

    this.pokemon = candinates[items[Math.floor(Math.random() * items.length)]];
  }

  getPokemon(): pokemonType {
    return this.pokemon;
  }
}