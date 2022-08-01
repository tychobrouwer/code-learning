"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePokemon = exports.drawText = exports.getLocalStorage = exports.setLocalStorage = exports.randomFromMinMax = exports.randomFromArray = void 0;
const constants_1 = require("../utils/constants");
function randomFromArray(propbabilityArray) {
    return propbabilityArray[Math.floor(Math.random() * propbabilityArray.length)];
}
exports.randomFromArray = randomFromArray;
function randomFromMinMax(min, max) {
    return (max !== -1) ? Math.floor(Math.random() * (max - min + 1)) + min : min;
}
exports.randomFromMinMax = randomFromMinMax;
function setLocalStorage(key, data) {
    if (data) {
        localStorage.setItem(key, JSON.stringify(data));
    }
}
exports.setLocalStorage = setLocalStorage;
function getLocalStorage(key) {
    const data = localStorage.getItem(key);
    if (!data) {
        return {};
    }
    return JSON.parse(data);
}
exports.getLocalStorage = getLocalStorage;
function drawText(ctx, font, text, fontsize, fontColor, posX, posY) {
    for (let i = 0; i < text.length; i++) {
        const positions = {
            posX: constants_1.constants.CHAR_IN_FONT.indexOf(text[i]) % 40 * constants_1.constants.FONT_WIDTH[fontsize],
            posY: ((constants_1.constants.CHAR_IN_FONT.indexOf(text[i]) / 40) << 0) * constants_1.constants.FONT_HEIGHT[fontsize],
        };
        let width = constants_1.constants.FONT_WIDTH[fontsize];
        if (text[i] === '|') { // characters that are seven pixels wide
            width = 7;
        }
        if (text[i] === ' ' || text[i] === 'l' || text[i] === '.') { // characters that are three pixels wide
            width = 3;
        }
        if (text[i] === 'i') { // characters that are four pixels wide
            width = 4;
        }
        const yOffset = (fontsize === 0) ? fontColor * 2 * constants_1.constants.FONT_HEIGHT[fontsize] : 56 + fontColor * 2 * constants_1.constants.FONT_HEIGHT[fontsize];
        ctx.drawImage(font, positions.posX, positions.posY + yOffset, width, constants_1.constants.FONT_HEIGHT[fontsize], posX + constants_1.constants.FONT_WIDTH[fontsize] * i
            - 3 * (text.substring(0, i).match(/ |l|\./g) || []).length
            - 2 * (text.substring(0, i).match(/i/g) || []).length, posY, width, constants_1.constants.FONT_HEIGHT[fontsize]);
    }
}
exports.drawText = drawText;
function generatePokemon(pokedexEntry, levelRange, pokemonId, pokeball) {
    const level = randomFromMinMax(levelRange[0], levelRange[1]);
    const personality = randomFromMinMax(0, 24);
    const nature = {
        hp: 1,
        attack: (constants_1.constants.POKEMON_PERSONALITIES.increase.attack.includes(personality)) ? 1.1 :
            (constants_1.constants.POKEMON_PERSONALITIES.decrease.attack.includes(personality)) ? 0.9 :
                1,
        defense: (constants_1.constants.POKEMON_PERSONALITIES.increase.defense.includes(personality)) ? 1.1 :
            (constants_1.constants.POKEMON_PERSONALITIES.decrease.defense.includes(personality)) ? 0.9 :
                1,
        specialDefense: (constants_1.constants.POKEMON_PERSONALITIES.increase.specialDefense.includes(personality)) ? 1.1 :
            (constants_1.constants.POKEMON_PERSONALITIES.decrease.specialDefense.includes(personality)) ? 0.9 :
                1,
        specialAttack: (constants_1.constants.POKEMON_PERSONALITIES.increase.specialAttack.includes(personality)) ? 1.1 :
            (constants_1.constants.POKEMON_PERSONALITIES.decrease.specialAttack.includes(personality)) ? 0.9 :
                1,
        speed: (constants_1.constants.POKEMON_PERSONALITIES.increase.speed.includes(personality)) ? 1.1 :
            (constants_1.constants.POKEMON_PERSONALITIES.decrease.speed.includes(personality)) ? 0.9 :
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
    for (const [maxSize, values] of Object.entries(constants_1.constants.SIZE_TABLE)) {
        if (size <= parseInt(maxSize)) {
            height = Math.floor(pokedexEntry.height * Math.floor((size - values.z) / values.y + values.x) / 10);
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
        pokeball: pokeball,
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
        xSource: (pokemonId - constants_1.constants.ASSETS_GENERATION_OFFSET[generation] - 1) % 3 * constants_1.constants.POKEMON_SPRITE_WIDTH,
        ySource: (((pokemonId - constants_1.constants.ASSETS_GENERATION_OFFSET[generation] - 1) / 3) << 0) * constants_1.constants.POKEMON_SIZE,
    };
    return pokemonData;
}
exports.generatePokemon = generatePokemon;
//# sourceMappingURL=helper.js.map