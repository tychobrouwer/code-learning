"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokemonBattle = void 0;
const constants_1 = require("../utils/constants");
const FONT_CHARACTERS = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '.',
    ',',
    '|',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    '\'',
    '`',
    '!',
    '?',
    '^',
    '#',
    '/',
    '_',
    '“',
    '”',
    '‘',
    '’',
];
const POKEMON_INDEX = {
    0: {
        0: {
            zigzagoon: {
                name: 'Zigzagoon',
                level: [2, 3],
                encounterRate: 45,
                tilePosX: 10,
                tilePosY: 10
            },
            wurmple: {
                name: 'Wurmple',
                level: [2, 3],
                encounterRate: 45,
                tilePosX: 10,
                tilePosY: 10
            },
            poochyena: {
                name: 'Poochyena',
                level: [2, 3],
                encounterRate: 10,
                tilePosX: 10,
                tilePosY: 10
            }
        }
    }
};
class PokemonBattle {
    constructor(context, loader, route, environment) {
        this.loader = loader;
        this.environment = environment;
        this.route = route;
        this.ctx = context;
        this.pokemon = this.init();
    }
    init() {
        const candinates = POKEMON_INDEX[this.route][this.environment];
        const items = [];
        for (const pokemon of Object.keys(candinates)) {
            for (let i = 1; i <= candinates[pokemon].encounterRate; i++) {
                items.push(pokemon);
            }
        }
        this.battleAssets = this.loader.loadImageToCanvas('battleAssets', constants_1.constants.ASSETS_BATTLE_HEIGHT, constants_1.constants.ASSETS_BATTLE_WIDTH);
        this.font = this.loader.loadImageToCanvas('font', constants_1.constants.ASSETS_FONT_HEIGHT, constants_1.constants.ASSETS_FONT_WIDTH);
        // this.pokemonGeneration1 = this.loader.loadImageToCanvas('pokemonGeneration1', constants.ASSETS_POKEMON_HEIGHT, constants.ASSETS_POKEMON_WIDTH);
        return candinates[items[Math.floor(Math.random() * items.length)]];
    }
    getPokemon() {
        return this.pokemon;
    }
    battle() {
        return __awaiter(this, void 0, void 0, function* () {
            const playerPokemon = 'playerPokemon';
            this.drawBattleScene();
            this.drawBattleBox();
            yield this.drawSlidePokemonIn();
            yield this.writeTextToBattleBox('Wild ' + this.pokemon.name.toUpperCase() + ' appeared!|');
            yield this.writeTextToBattleBox('GO! ' + playerPokemon + '!');
            const battleResult = true;
            return yield Promise.resolve(battleResult);
        });
    }
    writeTextToBattleBox(text) {
        return new Promise((resolve) => {
            for (let i = 1; i < text.length + 1; i++) {
                const textToDisplay = text.slice(0, i);
                setTimeout(() => {
                    this.drawText(textToDisplay, 16, 122);
                }, 20 * i);
            }
            setTimeout(() => {
                this.drawBattleBox();
                resolve(true);
            }, 20 * text.length + 1500);
        });
    }
    drawBattleScene() {
        if (this.battleAssets) {
            this.ctx.drawImage(this.battleAssets, this.environment % 3 * constants_1.constants.GAME_WIDTH, ((0.5 + this.environment / 3) << 0) * 112, constants_1.constants.GAME_WIDTH, 112, 0, 0, constants_1.constants.GAME_WIDTH, 112);
        }
    }
    drawBattleBox() {
        if (this.battleAssets) {
            this.ctx.drawImage(this.battleAssets, 0, 448, constants_1.constants.GAME_WIDTH, 48, 0, 112, constants_1.constants.GAME_WIDTH, 48);
        }
    }
    drawSlidePokemonIn() {
        return new Promise((resolve) => {
            for (let i = 0; i < constants_1.constants.GAME_WIDTH + 1; i++) {
                setTimeout(() => {
                    this.drawBattleScene();
                    if (this.battleAssets) {
                        this.ctx.drawImage(this.battleAssets, this.environment % 3 * 128, ((0.5 + this.environment / 3) << 0) * 32 + 496, 128, 32, i - 128, 48, 128, 32);
                        this.ctx.drawImage(this.battleAssets, this.environment % 3 * 128, ((0.5 + this.environment / 3) << 0) * 32 + 496, 128, 32, constants_1.constants.GAME_WIDTH - i, 100, 128, 32);
                    }
                    this.drawBattleBox();
                }, 2 * i);
            }
            setTimeout(() => {
                resolve(true);
            }, 2 * constants_1.constants.GAME_WIDTH + 500);
        });
    }
    drawText(text, posX, posY) {
        for (let i = 0; i < text.length; i++) {
            const positions = {
                posX: FONT_CHARACTERS.indexOf(text[i]) % 39 * 6,
                posY: Math.floor(FONT_CHARACTERS.indexOf(text[i]) / 39) * 14,
            };
            let width = 6;
            if (text[i] === '|') { // caret is 7 pixels wide
                width = 7;
            }
            if (this.font) {
                this.ctx.drawImage(this.font, positions.posX, positions.posY, width, 14, posX + 6 * i, posY, width, 14);
            }
        }
    }
}
exports.PokemonBattle = PokemonBattle;
//# sourceMappingURL=pokemon.js.map