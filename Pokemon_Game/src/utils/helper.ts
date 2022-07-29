import { constants } from '../utils/constants';

import { pokemonType, pokemonDataType, pokemonInfoType } from '../utils/types';

export function randomFromArray(propbabilityArray: number[]) {
  return propbabilityArray[Math.floor(Math.random() * propbabilityArray.length)];
}

export function randomFromMinMax(min: number, max: number): number {
  return (max !== -1) ? Math.floor(Math.random() * (max - min + 1)) + min : min;
}

export function setLocalStorage(key: string, data: object): void {
  localStorage.setItem(key, JSON.stringify(data))
}

export function getLocalStorage(key: string): any {
  const data = localStorage.getItem(key);

  if (!data) {
    return {};
  }

  return JSON.parse(data);
}

export function generatePokemon(pokedexEntry: pokemonInfoType, candinate: pokemonType, pokemonId: number): pokemonDataType {
  const level = randomFromMinMax(candinate.level[0], candinate.level[1]);
  const personality = randomFromMinMax(0, 24);
  const nature = {
    hp: 1,
    attack: (constants.POKEMON_PERSONALITIES.increase.attack.includes(personality)) ? 1.1 : 
            (constants.POKEMON_PERSONALITIES.decrease.attack.includes(personality)) ? 0.9 :
            1,
    defense:  (constants.POKEMON_PERSONALITIES.increase.defense.includes(personality)) ? 1.1 : 
              (constants.POKEMON_PERSONALITIES.decrease.defense.includes(personality)) ? 0.9 :
              1,
    specialDefense: (constants.POKEMON_PERSONALITIES.increase.specialDefense.includes(personality)) ? 1.1 : 
                    (constants.POKEMON_PERSONALITIES.decrease.specialDefense.includes(personality)) ? 0.9 :
                    1,
    specialAttack:  (constants.POKEMON_PERSONALITIES.increase.specialAttack.includes(personality)) ? 1.1 : 
                    (constants.POKEMON_PERSONALITIES.decrease.specialAttack.includes(personality)) ? 0.9 :
                    1,
    speed:  (constants.POKEMON_PERSONALITIES.increase.speed.includes(personality)) ? 1.1 : 
            (constants.POKEMON_PERSONALITIES.decrease.speed.includes(personality)) ? 0.9 :
            1,
  };
  const IV = {
    hp: randomFromMinMax(0, 31),
    attack: randomFromMinMax(0, 31),
    defense: randomFromMinMax(0, 31),
    specialDefense: randomFromMinMax(0, 31),
    specialAttack: randomFromMinMax(0, 31),
    speed: randomFromMinMax(0, 31),
  };
  const EV = {
    hp: pokedexEntry.stats[0].effort,
    attack: pokedexEntry.stats[1].effort,
    defense: pokedexEntry.stats[2].effort,
    specialAttack: pokedexEntry.stats[3].effort,
    specialDefense: pokedexEntry.stats[4].effort,
    speed: pokedexEntry.stats[5].effort,
  };

  const health = Math.floor((2 * pokedexEntry.stats[0].base_stat + IV.hp + Math.floor(EV.hp / 4)) * level / 100) + level + 10;
  const generation = (pokemonId <= 151) ? 0 : (pokemonId < 251) ? 1 : 2;
  let height = 0;
  const size = randomFromMinMax(0, 65535);

  for (const [maxSize, values] of Object.entries(constants.SIZE_TABLE)) {
    if (size <= parseInt(maxSize)) {
      height = Math.floor(pokedexEntry.height * Math.floor((size - values.z) / values.y + values.x) / 10)

      break;
    }
  } 

  const pokemonData = {
    pokemonId: pokemonId,
    generation: generation,
    pokemonName: pokedexEntry.name,
    level: level,
    health: health,
    gender: randomFromMinMax(0, 1),
    ability: pokedexEntry.abilities[randomFromMinMax(0, 1)],
    shininess: (randomFromMinMax(1, 8192) === 1) ? true : false,
    size: size,
    height: height,
    personality: personality,
    nature: nature,
    EV: EV,
    IV: IV,
    stats: {
      hp: health,
      attack: Math.floor((Math.floor((2 * pokedexEntry.stats[1].base_stat + IV.attack + Math.floor(EV.attack / 4)) * level / 100) + 5) * nature.hp),
      defense: Math.floor((Math.floor((2 * pokedexEntry.stats[2].base_stat + IV.defense + Math.floor(EV.defense / 4)) * level / 100) + 5) * nature.defense),
      specialAttack: Math.floor((Math.floor((2 * pokedexEntry.stats[3].base_stat + IV.specialAttack + Math.floor(EV.specialAttack / 4)) * level / 100) + 5) * nature.specialAttack),
      specialDefense: Math.floor((Math.floor((2 * pokedexEntry.stats[4].base_stat + IV.specialDefense + Math.floor(EV.specialDefense / 4)) * level / 100) + 5) * nature.specialDefense),
      speed: Math.floor((Math.floor((2 * pokedexEntry.stats[5].base_stat + IV.speed + Math.floor(EV.speed / 4)) * level / 100) + 5) * nature.speed),
    },
    xSource: (pokemonId - constants.ASSETS_GENERATION_OFFSET[generation] - 1) % 3 * constants.POKEMON_SPRITE_WIDTH,
    ySource: (((pokemonId - constants.ASSETS_GENERATION_OFFSET[generation] - 1) / 3) << 0) * constants.POKEMON_SIZE,
  }

  return pokemonData;
}
