"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const pokedex = __importStar(require("../pokedex.json"));
const encounterTable = __importStar(require("../encounter_table.json"));
const helper_1 = require("../utils/helper");
const constants_1 = require("../utils/constants");
const keyboard_1 = require("../utils/keyboard");
const BATTLE_STATUS = [
    'slidePokemonIn',
    'writeAppearText',
    'writeGoText',
    'throwPokemon',
    'playerActionSelect',
    'playerAction',
    'finished',
];
// const BATTLE_ACTIONS = [
//   'fight',
//   'bag',
//   'pokemon',
//   'run'
// ];
class PokemonBattle {
    constructor(context, loader, route, encounterMethod) {
        this.battleAction = 0;
        this.battleResultWin = false;
        this._previousElapsed = 0;
        this.battleStatus = 0;
        this.X_slidePokemonIn = 0;
        this.X_slideEnemyHealth = 0;
        this.X_slidePlayerHealth = 0;
        this.X_throwPokemon = 0;
        this.X_throwPokeball = 0;
        this.pokeballAnimation = 0;
        this.pokemoinAlternativeOpacity = 1;
        this.X_writeTextToBattleBox = 0;
        this.loader = loader;
        this.pokedex = pokedex;
        this.encounterTable = encounterTable;
        this.encounterMethod = encounterMethod;
        this.route = route;
        this.ctx = context;
        // TEMPORARY PLAYER POKEMON //
        const playerPokemonId = '12';
        const pokedexDataPlayer = this.pokedex[playerPokemonId];
        const playerGeneration = (parseInt(playerPokemonId) <= 151) ? 0 : (parseInt(playerPokemonId) < 251) ? 1 : 2;
        this.playerPokemon = {
            pokemon: pokedexDataPlayer,
            health: 19,
            maxHealth: 25,
            generation: playerGeneration,
            level: 5,
            male: false,
            pokeball: 2,
            xSource: (pokedexDataPlayer.id - constants_1.constants.ASSETS_GENERATION_OFFSET[playerGeneration] - 1) % 3 * constants_1.constants.POKEMON_SPRITE_WIDTH,
            ySource: (((pokedexDataPlayer.id - constants_1.constants.ASSETS_GENERATION_OFFSET[playerGeneration] - 1) / 3) << 0) * constants_1.constants.POKEMON_SIZE,
        };
        // //////////////////////// //
        const enemyPokemonData = this.init();
        this.enemyPokemon = enemyPokemonData;
        console.log(this.enemyPokemon);
        console.log(this.playerPokemon);
    }
    init() {
        const candinates = this.encounterTable[this.route][this.encounterMethod.toString()];
        const candinateIds = [];
        for (const pokemonIndex in candinates) {
            candinateIds.push(...Array(candinates[pokemonIndex].rate).fill(parseInt(pokemonIndex)));
        }
        const pokemonId = (0, helper_1.randomFromArray)(candinateIds);
        const enemyPokemon = (0, helper_1.generatePokemon)(this.pokedex[pokemonId.toString()], candinates[pokemonId], pokemonId);
        this.battleAssets = this.loader.loadImageToCanvas('battleAssets', constants_1.constants.ASSETS_BATTLE_HEIGHT, constants_1.constants.ASSETS_BATTLE_WIDTH);
        this.font = this.loader.loadImageToCanvas('font', constants_1.constants.ASSETS_FONT_HEIGHT, constants_1.constants.ASSETS_FONT_WIDTH);
        this.avatarAssets = this.loader.loadImageToCanvas('avatar', constants_1.constants.ASSETS_AVATAR_HEIGHT, constants_1.constants.ASSETS_AVATAR_WIDTH);
        this.enemyPokemonSprite = this.loader.loadImageToCanvas('pokemonGeneration' + (enemyPokemon.generation + 1), constants_1.constants.ASSETS_POKEMON_HEIGHT[enemyPokemon.generation], constants_1.constants.ASSETS_POKEMON_WIDTH);
        if (enemyPokemon.generation === this.playerPokemon.generation) {
            this.playerPokemonSprite = this.enemyPokemonSprite;
        }
        else {
            this.playerPokemonSprite = this.loader.loadImageToCanvas('pokemonGeneration' + (this.playerPokemon.generation + 1), constants_1.constants.ASSETS_POKEMON_HEIGHT[this.playerPokemon.generation], constants_1.constants.ASSETS_POKEMON_WIDTH);
        }
        return enemyPokemon;
    }
    getPokemon() {
        return this.enemyPokemon;
    }
    battle() {
        return __awaiter(this, void 0, void 0, function* () {
            window.requestAnimationFrame(this.tick.bind(this));
            yield this.waitForBattleFinised();
            this.battleResultWin = true;
            this.ctx.clearRect(0, 0, constants_1.constants.GAME_WIDTH, constants_1.constants.GAME_HEIGHT);
            return this.battleResultWin;
        });
    }
    waitForBattleFinised() {
        return new Promise((resolve) => {
            if (BATTLE_STATUS[this.battleStatus] === 'finished') {
                resolve();
            }
            else {
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    yield this.waitForBattleFinised();
                    resolve();
                }), 10);
            }
        });
    }
    nextBattlePhase() {
        this.battleStatus++;
    }
    tick(elapsed) {
        return __awaiter(this, void 0, void 0, function* () {
            let delta = (elapsed - this._previousElapsed) / 1000.0;
            delta = Math.min(delta, 0.25); // maximum delta of 250 ms
            this._previousElapsed = elapsed;
            if (BATTLE_STATUS[this.battleStatus] === 'slidePokemonIn') {
                this.drawBattleArena();
                this.drawEnemyPokemon(delta, true, true);
                this.drawActionBox(false);
            }
            else if (BATTLE_STATUS[this.battleStatus] === 'writeAppearText') {
                this.drawBattleArena();
                this.drawEnemyPokemon(0, true);
                this.drawActionBox(false);
                this.writeTextToBattleBox('Wild ' + this.enemyPokemon.pokemonName.toUpperCase() + ' appeared!|', 0, 1, delta, 1, 0, true, true);
                this.drawEnemyHealth(delta, true);
            }
            else if (BATTLE_STATUS[this.battleStatus] === 'writeGoText') {
                this.writeTextToBattleBox('Go! ' + this.playerPokemon.pokemon.name.toUpperCase() + '!', 0, 1, delta, 0, 0, true, true);
            }
            else if (BATTLE_STATUS[this.battleStatus] === 'throwPokemon') {
                this.drawBattleArena();
                this.drawEnemyPokemon(0);
                this.drawEnemyHealth(0, false);
                this.drawPlayerPokemon(delta, true, true);
                this.drawActionBox(false);
                this.drawText('Go! ' + this.playerPokemon.pokemon.name.toUpperCase() + '!', 0, 1, 16, 122);
            }
            else if (BATTLE_STATUS[this.battleStatus] === 'playerActionSelect') {
                this.drawActionBox(true);
                this.writeTextToBattleBox('What should ', 0, 1, delta, 0, 0, false, false);
                this.writeTextToBattleBox(this.playerPokemon.pokemon.name.toUpperCase() + ' do?', 0, 1, delta, 0, 1, false, false);
                if (keyboard_1.keyboard.isDown(keyboard_1.keyboard.LEFT)) {
                    if (this.battleAction === 1 || this.battleAction === 3) {
                        this.battleAction--;
                    }
                }
                else if (keyboard_1.keyboard.isDown(keyboard_1.keyboard.RIGHT)) {
                    if (this.battleAction === 0 || this.battleAction === 2) {
                        this.battleAction++;
                    }
                }
                else if (keyboard_1.keyboard.isDown(keyboard_1.keyboard.UP)) {
                    if (this.battleAction === 2 || this.battleAction === 3) {
                        this.battleAction -= 2;
                    }
                }
                else if (keyboard_1.keyboard.isDown(keyboard_1.keyboard.DOWN)) {
                    if (this.battleAction === 0 || this.battleAction === 1) {
                        this.battleAction += 2;
                    }
                }
                else if (keyboard_1.keyboard.isDown(keyboard_1.keyboard.ENTER)) {
                    this.nextBattlePhase();
                }
                let xOffset = this.battleAction * 46;
                let yColumn = 0;
                if (this.battleAction === 2 || this.battleAction === 3) {
                    xOffset = (this.battleAction - 2) * 46;
                    yColumn = 1;
                }
                this.drawActionSelector(constants_1.constants.GAME_WIDTH - constants_1.constants.ACTION_BOX_WIDTH + 8 + xOffset, constants_1.constants.GAME_WIDTH - constants_1.constants.ACTION_BOX_WIDTH + 8 + 42 + xOffset, yColumn);
            }
            else if (BATTLE_STATUS[this.battleStatus] === 'playerAction') {
                console.log(this.battleAction);
            }
            if (BATTLE_STATUS[this.battleStatus] !== 'finished') {
                window.requestAnimationFrame(this.tick.bind(this));
                return false;
            }
            else {
                return true;
            }
        });
    }
    drawEnemyPokemon(delta, drawPlayer = false, nextPhase = false) {
        const speed = 176;
        const xPixel = (this.X_slidePokemonIn + delta * speed) << 0;
        this.ctx.drawImage(this.battleAssets, this.encounterMethod % 3 * constants_1.constants.BATTLE_SCENE_WIDTH, ((0.5 + this.encounterMethod / 3) << 0) * constants_1.constants.BATTLE_SCENE_HEIGHT + 3 * constants_1.constants.BATTLE_ARENA_HEIGHT + constants_1.constants.ACTION_BOX_HEIGHT, constants_1.constants.BATTLE_SCENE_WIDTH, constants_1.constants.BATTLE_SCENE_HEIGHT, xPixel - constants_1.constants.BATTLE_SCENE_WIDTH, 48, constants_1.constants.BATTLE_SCENE_WIDTH, constants_1.constants.BATTLE_SCENE_HEIGHT);
        const enemyPokemonCtx = this.enemyPokemonSprite.getContext('2d');
        if (enemyPokemonCtx && xPixel <= constants_1.constants.GAME_WIDTH - 1) {
            this.ctx.globalAlpha = 0.8;
        }
        this.ctx.drawImage(this.enemyPokemonSprite, this.enemyPokemon.xSource, this.enemyPokemon.ySource, constants_1.constants.POKEMON_SIZE, constants_1.constants.POKEMON_SIZE, xPixel - 0.75 * constants_1.constants.BATTLE_SCENE_WIDTH, 48 - constants_1.constants.POKEMON_SIZE / 2, constants_1.constants.POKEMON_SIZE, constants_1.constants.POKEMON_SIZE);
        this.ctx.globalAlpha = 1;
        this.ctx.drawImage(this.battleAssets, this.encounterMethod % 3 * constants_1.constants.BATTLE_SCENE_WIDTH, ((0.5 + this.encounterMethod / 3) << 0) * constants_1.constants.BATTLE_SCENE_HEIGHT + 3 * constants_1.constants.BATTLE_ARENA_HEIGHT + constants_1.constants.ACTION_BOX_HEIGHT, constants_1.constants.BATTLE_SCENE_WIDTH, constants_1.constants.BATTLE_SCENE_HEIGHT, constants_1.constants.GAME_WIDTH - xPixel, 100, constants_1.constants.BATTLE_SCENE_WIDTH, constants_1.constants.BATTLE_SCENE_HEIGHT);
        if (drawPlayer) {
            this.ctx.drawImage(this.avatarAssets, constants_1.constants.AVATAR_BATTLE_OFFSET, 0, constants_1.constants.AVATAR_BATTLE_WIDTH, constants_1.constants.AVATAR_BATTLE_HEIGHT, constants_1.constants.GAME_WIDTH - xPixel + 0.5 * constants_1.constants.BATTLE_SCENE_WIDTH, constants_1.constants.BATTLE_ARENA_HEIGHT - constants_1.constants.AVATAR_BATTLE_HEIGHT, constants_1.constants.AVATAR_BATTLE_WIDTH, constants_1.constants.AVATAR_BATTLE_HEIGHT);
            if (xPixel >= constants_1.constants.GAME_WIDTH && nextPhase) {
                this.nextBattlePhase();
            }
            this.X_slidePokemonIn += delta * speed;
            this.X_throwPokemon = this.X_slidePokemonIn;
        }
    }
    drawEnemyHealth(delta, slideIn) {
        const speed = 224;
        let xPixel = (this.X_slideEnemyHealth + delta * speed - constants_1.constants.ASSETS_ENEMY_HEALTH_WIDTH) << 0;
        if (xPixel > 13)
            xPixel = 13;
        this.ctx.drawImage(this.battleAssets, constants_1.constants.ASSETS_PLAYER_HEALTH_WIDTH, constants_1.constants.ASSETS_HEALTH_OFFSET, constants_1.constants.ASSETS_ENEMY_HEALTH_WIDTH, constants_1.constants.ASSETS_ENEMY_HEALTH_HEIGHT, xPixel, 16, constants_1.constants.ASSETS_ENEMY_HEALTH_WIDTH, constants_1.constants.ASSETS_ENEMY_HEALTH_HEIGHT);
        const healthFrac = this.enemyPokemon.health / this.enemyPokemon.stats.hp;
        const healthbarWidth = (healthFrac * 48) << 0;
        const healthbarOffset = (healthFrac < 0.2) ? 4 : (healthFrac < 0.5) ? 2 : 0;
        this.ctx.drawImage(this.battleAssets, constants_1.constants.ASSETS_ENEMY_HEALTH_WIDTH + constants_1.constants.ASSETS_PLAYER_HEALTH_WIDTH, constants_1.constants.ASSETS_HEALTH_OFFSET + healthbarOffset, healthbarWidth, 2, xPixel + 39, 16 + 17, healthbarWidth, 2);
        this.drawText(this.enemyPokemon.pokemonName.toUpperCase() + ((this.enemyPokemon.gender) ? '#' : '^'), 1, 0, xPixel - 13 + 20, 22);
        this.drawText(this.enemyPokemon.level.toString(), 1, 0, xPixel - 13 + 89, 22);
        if (slideIn) {
            this.X_slideEnemyHealth += delta * speed;
        }
    }
    drawPlayerPokemon(delta, throwPokemon = false, nextPhase = false) {
        const speed = 176;
        const speedPokeball = 48;
        const xPixel = (this.X_throwPokemon + delta * speed) << 0;
        const assetOffset = (xPixel < constants_1.constants.GAME_WIDTH + 0.6 * constants_1.constants.BATTLE_SCENE_WIDTH) ? constants_1.constants.AVATAR_BATTLE_HEIGHT :
            (xPixel < constants_1.constants.GAME_WIDTH + 0.75 * constants_1.constants.BATTLE_SCENE_WIDTH) ? 2 * constants_1.constants.AVATAR_BATTLE_HEIGHT :
                3 * constants_1.constants.AVATAR_BATTLE_HEIGHT;
        let xPixelPokeball = 0;
        if (xPixel >= 340) {
            this.pokeballAnimation = this.pokeballAnimation < 7.2 ? this.pokeballAnimation + 0.2 : 0;
            xPixelPokeball = (this.X_throwPokeball + delta * speedPokeball) << 0;
            const yPixelPokeball = (0.08 * Math.pow(xPixelPokeball, 2) - 2.2 * xPixelPokeball + 70) << 0;
            this.ctx.drawImage(this.battleAssets, constants_1.constants.POKEBALL_OFFSET_X + this.playerPokemon.pokeball * constants_1.constants.POKEBALL_SIZE, constants_1.constants.POKEBALL_OFFSET_Y + 37 + (this.pokeballAnimation << 0) * constants_1.constants.POKEBALL_SIZE, constants_1.constants.POKEBALL_SIZE, constants_1.constants.POKEBALL_SIZE, xPixelPokeball + 25, yPixelPokeball, constants_1.constants.POKEBALL_SIZE, constants_1.constants.POKEBALL_SIZE);
            if (throwPokemon) {
                this.X_throwPokeball += delta * speedPokeball;
            }
        }
        if (xPixelPokeball >= 30) {
            const opacity = (this.pokemoinAlternativeOpacity > 0) ? this.pokemoinAlternativeOpacity : 0;
            this.ctx.globalAlpha = opacity;
            if (opacity > 0) {
                this.ctx.drawImage(this.playerPokemonSprite, this.playerPokemon.xSource + 2 * constants_1.constants.POKEMON_SIZE + constants_1.constants.POKEMON_ALTERNATIVE_OFFSET, this.playerPokemon.ySource, constants_1.constants.POKEMON_SIZE, constants_1.constants.POKEMON_SIZE, (0.5 * (constants_1.constants.BATTLE_SCENE_WIDTH - constants_1.constants.POKEMON_SIZE) + 0.5 * (constants_1.constants.POKEMON_SIZE - (xPixelPokeball - 30) / 40 * constants_1.constants.POKEMON_SIZE) << 0), (constants_1.constants.BATTLE_ARENA_HEIGHT - constants_1.constants.AVATAR_BATTLE_HEIGHT + constants_1.constants.POKEMON_SIZE - (xPixelPokeball - 30) / 40 * constants_1.constants.POKEMON_SIZE) << 0, constants_1.constants.POKEMON_SIZE * (xPixelPokeball - 30) / 40, constants_1.constants.POKEMON_SIZE * (xPixelPokeball - 30) / 40);
            }
            this.ctx.globalAlpha = 1 - opacity;
            if (xPixelPokeball >= 70) {
                this.ctx.drawImage(this.playerPokemonSprite, this.playerPokemon.xSource + 2 * constants_1.constants.POKEMON_SIZE, this.playerPokemon.ySource, constants_1.constants.POKEMON_SIZE, constants_1.constants.POKEMON_SIZE, 0.5 * (constants_1.constants.BATTLE_SCENE_WIDTH - constants_1.constants.POKEMON_SIZE), constants_1.constants.BATTLE_ARENA_HEIGHT - constants_1.constants.AVATAR_BATTLE_HEIGHT, constants_1.constants.POKEMON_SIZE, constants_1.constants.POKEMON_SIZE);
                this.pokemoinAlternativeOpacity -= delta * 8;
                const speedHealth = 224;
                let xPixelPlayerHealth = (this.X_slidePlayerHealth - delta * speedHealth + constants_1.constants.GAME_WIDTH) << 0;
                if (xPixelPlayerHealth < 127)
                    xPixelPlayerHealth = 127;
                this.ctx.drawImage(this.battleAssets, 0, constants_1.constants.ASSETS_HEALTH_OFFSET, constants_1.constants.ASSETS_PLAYER_HEALTH_WIDTH, constants_1.constants.ASSETS_PLAYER_HEALTH_HEIGHT, xPixelPlayerHealth, 75, constants_1.constants.ASSETS_PLAYER_HEALTH_WIDTH, constants_1.constants.ASSETS_PLAYER_HEALTH_HEIGHT);
                const healthFrac = this.playerPokemon.health / this.playerPokemon.maxHealth;
                const healthbarOffset = (healthFrac < 0.2) ? 4 : (healthFrac < 0.5) ? 2 : 0;
                const healthbarWidth = (healthFrac * 48) << 0;
                this.ctx.drawImage(this.battleAssets, constants_1.constants.ASSETS_ENEMY_HEALTH_WIDTH + constants_1.constants.ASSETS_PLAYER_HEALTH_WIDTH, constants_1.constants.ASSETS_HEALTH_OFFSET + healthbarOffset, healthbarWidth, 2, xPixelPlayerHealth + 47, 75 + 17, healthbarWidth, 2);
                this.drawText(this.playerPokemon.pokemon.name.toUpperCase() + ((this.playerPokemon.male) ? '#' : '^'), 1, 0, xPixelPlayerHealth + 14, 74 + 6);
                this.drawText(this.playerPokemon.level.toString(), 1, 0, xPixelPlayerHealth + 84, 75 + 6);
                this.drawText(this.playerPokemon.health.toString().padStart(3, ' ') + '/' + this.playerPokemon.maxHealth.toString().padStart(3, ' '), 1, 0, xPixelPlayerHealth + 59, 75 + 22);
                if (throwPokemon) {
                    this.X_slidePlayerHealth -= delta * speedHealth;
                }
            }
            this.ctx.globalAlpha = 1;
        }
        this.ctx.drawImage(this.avatarAssets, constants_1.constants.AVATAR_BATTLE_OFFSET, assetOffset, constants_1.constants.AVATAR_BATTLE_WIDTH, constants_1.constants.AVATAR_BATTLE_HEIGHT, constants_1.constants.GAME_WIDTH - xPixel + 0.5 * constants_1.constants.BATTLE_SCENE_WIDTH, constants_1.constants.BATTLE_ARENA_HEIGHT - constants_1.constants.AVATAR_BATTLE_HEIGHT, constants_1.constants.AVATAR_BATTLE_WIDTH, constants_1.constants.AVATAR_BATTLE_HEIGHT);
        if (xPixelPokeball >= 100 && nextPhase) {
            this.nextBattlePhase();
        }
        if (throwPokemon) {
            this.X_throwPokemon += delta * speed;
        }
    }
    drawActionSelector(xStart, xEnd, column) {
        this.ctx.beginPath();
        this.ctx.moveTo(xStart, 121 + column * 16 - 0.5);
        this.ctx.lineTo(xEnd - 1, 121 + column * 16 - 0.5);
        this.ctx.moveTo(xEnd - 0.5, 121 + column * 16);
        this.ctx.lineTo(xEnd - 0.5, 121 + 14 + column * 16);
        this.ctx.moveTo(xEnd - 1, 121 + 14 + column * 16 + 0.5);
        this.ctx.lineTo(xStart, 121 + 14 + column * 16 + 0.5);
        this.ctx.moveTo(xStart - 0.5, 121 + 14 + column * 16);
        this.ctx.lineTo(xStart - 0.5, 121 + column * 16);
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = '#f86058';
        this.ctx.stroke();
    }
    writeTextToBattleBox(text, fontsize, fontColor, delta, delayAfter, textLine, writeOut, nextPhase = false) {
        const speed = 304;
        const yText = 122 + 16 * textLine;
        if (writeOut) {
            const i = ((this.X_writeTextToBattleBox + delta * speed) / 6) << 0;
            const textToDisplay = text.slice(0, i);
            this.drawText(textToDisplay, fontsize, fontColor, 16, yText);
            if (i >= text.length + delayAfter * speed / 6) {
                this.X_writeTextToBattleBox = 0;
                this.drawActionBox(false);
                if (nextPhase) {
                    this.nextBattlePhase();
                }
            }
            else {
                this.X_writeTextToBattleBox += delta * speed;
            }
        }
        else {
            this.drawText(text, fontsize, fontColor, 16, yText);
        }
    }
    drawBattleArena() {
        this.ctx.drawImage(this.battleAssets, this.encounterMethod % 4 * constants_1.constants.GAME_WIDTH, ((0.5 + this.encounterMethod / 4) << 0) * constants_1.constants.BATTLE_ARENA_HEIGHT, constants_1.constants.GAME_WIDTH, constants_1.constants.BATTLE_ARENA_HEIGHT, 0, 0, constants_1.constants.GAME_WIDTH, constants_1.constants.BATTLE_ARENA_HEIGHT);
    }
    drawActionBox(actionchoice) {
        this.ctx.drawImage(this.battleAssets, 0, 3 * constants_1.constants.BATTLE_ARENA_HEIGHT, constants_1.constants.GAME_WIDTH, constants_1.constants.ACTION_BOX_HEIGHT, 0, constants_1.constants.BATTLE_ARENA_HEIGHT, constants_1.constants.GAME_WIDTH, constants_1.constants.ACTION_BOX_HEIGHT);
        if (actionchoice) {
            this.ctx.drawImage(this.battleAssets, constants_1.constants.GAME_WIDTH, 3 * constants_1.constants.BATTLE_ARENA_HEIGHT, constants_1.constants.ACTION_BOX_WIDTH, constants_1.constants.ACTION_BOX_HEIGHT, constants_1.constants.GAME_WIDTH - constants_1.constants.ACTION_BOX_WIDTH, constants_1.constants.BATTLE_ARENA_HEIGHT, constants_1.constants.ACTION_BOX_WIDTH, constants_1.constants.ACTION_BOX_HEIGHT);
        }
    }
    drawText(text, fontsize, fontColor, posX, posY) {
        for (let i = 0; i < text.length; i++) {
            const positions = {
                posX: constants_1.constants.CHAR_IN_FONT.indexOf(text[i]) % 39 * constants_1.constants.FONT_WIDTH[fontsize],
                posY: ((constants_1.constants.CHAR_IN_FONT.indexOf(text[i]) / 39) << 0) * constants_1.constants.FONT_HEIGHT[fontsize],
            };
            let width = constants_1.constants.FONT_WIDTH[fontsize];
            if (text[i] === '|') { // caret is 1 pixel wider
                width = constants_1.constants.FONT_WIDTH[fontsize] + 1;
            }
            const yOffset = (fontsize === 0) ? fontColor * 2 * constants_1.constants.FONT_HEIGHT[fontsize] : 52 + fontColor * 2 * constants_1.constants.FONT_HEIGHT[fontsize];
            this.ctx.drawImage(this.font, positions.posX, positions.posY + yOffset, width, constants_1.constants.FONT_HEIGHT[fontsize], posX + constants_1.constants.FONT_WIDTH[fontsize] * i, posY, width, constants_1.constants.FONT_HEIGHT[fontsize]);
        }
    }
}
exports.PokemonBattle = PokemonBattle;
//# sourceMappingURL=pokemon.js.map