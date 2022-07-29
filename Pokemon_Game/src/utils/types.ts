export interface PlayerDataType {
  location: string;
  position: {
    x: number;
    y: number;
  };
  pokemon: {
    [pokemonName: string]: pokemonDataType;
  };
}

export interface pokemonDataType {
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
  personality: number;
  nature: pokemonStatsType;
  EV: pokemonStatsType;
  IV: pokemonStatsType;
  stats: pokemonStatsType;
  xSource: number;
  ySource: number;
}

interface pokemonStatsType {
  hp: number;
  attack: number;
  defense: number;
  specialDefense: number;
  specialAttack: number;
  speed: number;
}

export interface MapType {
  COLS: number;
  ROWS: number;

  layers: number[][];
}

export interface MapsType {
  [mapName: string] : MapType;
}

export interface addMapReturnType {
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

interface Keys {
  a: boolean;
  d: boolean;
  w: boolean;
  s: boolean;
  enter: boolean;
}

export interface pokemonType {
  rate: number;
  level: number[];
}

export interface encounterTableType {
  [route: string]: {
    [encounterMethod: string]: {
      [id: number]: pokemonType;
    }
  }
}

export interface sizeTableType {
  [maxSize: number]: {
    x: number;
    y: number;
    z: number;
  }
}

export interface pokemonInfoType {
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

export interface pokedexType { 
  [id_string: string]: pokemonInfoType;
}