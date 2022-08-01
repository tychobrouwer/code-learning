export interface PlayerDataType {
  location: string;
  position: {
    x: number;
    y: number;
  };
  pokemon: PokemonDataType[];
  currentPokemon: number;
}

export interface PokemonDataType {
  pokemonId: number;
  generation: number;
  pokemonName: string;
  level: number;
  health: number;
  gender: number;
  ability: {
    ability: string;
    is_hidden: boolean;
    slot: number;
  };
  shininess: boolean;
  size: number;
  height: number;
  pokeball: number,
  personality: number;
  nature: PokemonStatsType;
  EV: PokemonStatsType;
  IV: PokemonStatsType;
  stats: PokemonStatsType;
  xSource: number;
  ySource: number;
}

interface PokemonStatsType {
  hp: number;
  attack: number;
  defense: number;
  specialDefense: number;
  specialAttack: number;
  speed: number;
}

export interface AssetsLocationTilesType {
  [location: string]: {
    width: number;
    height: number;
  }
}

export interface MapType {
  COLS: number;
  ROWS: number;

  layers: number[][];
}

export interface MapsType {
  [mapName: string] : MapType;
}

export interface AddMapReturnType {
  currentMap: MapType;
  diff: number[]
}

export interface MapLocation {
  [coordinate: string]: number;
}

export interface Keyboard {
  LEFT: string;
  RIGHT: string;
  UP: string;
  DOWN: string;
  ENTER: string;

  _keys: Keys;
  listenForEvents: (keys: string[]) => void;
  _onKeyDown: (event: KeyboardEvent) => void;
  _onKeyUp: (event: KeyboardEvent) => void;
  isDown: (keyCode: string) => boolean;
}

export interface Keys {
  a: boolean;
  d: boolean;
  w: boolean;
  s: boolean;
  enter: boolean;
}

export interface PokemonType {
  rate: number;
  level: number[];
}

export interface EncounterTableType {
  [route: string]: {
    [encounterMethod: string]: {
      [id: number]: PokemonType;
    }
  }
}

export interface SizeTableType {
  [maxSize: number]: {
    x: number;
    y: number;
    z: number;
  }
}

export interface PokemonInfoType {
  id: number;
  name: string;
  order: number;
  species: string;
  game_index: number;
  weight: number;
  height: number;
  base_experience: number;
  is_default: boolean;
  forms: string[];
  stats: {
    base_stat: number;
    effort: number;
    stat: string;
  }[]
  abilities: {
    ability: string;
    is_hidden: boolean;
    slot: number;
  }[];
  held_items: {
    item: string;
  }[];
  moves: {
    move: string;
  }[];
  types: {
    slot: number;
    type: string;
  }[];
}

export interface PokedexType { 
  [id_string: string]: PokemonInfoType;
}