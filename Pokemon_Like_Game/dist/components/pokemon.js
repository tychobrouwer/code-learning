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
const BATTLE_STATUS = [
    'slidePokemonIn',
    'writeAppearText',
    'writeGoText',
    'finished',
];
class PokemonBattle {
    constructor(context, loader, route, environment) {
        this.battleResultWin = false;
        this._previousElapsed = 0;
        this.battleStatus = 0;
        this.X_slidePokemonIn = 0;
        this.X_writeTextToBattleBox = 0;
        this.loader = loader;
        this.environment = environment;
        this.route = route;
        this.ctx = context;
        this.pokemon = this.init();
    }
    init() {
        const candinates = constants_1.constants.POKEMON_INDEX[this.route][this.environment];
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
            this.drawBattleArena();
            this.drawBattleBox();
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
            const playerPokemon = 'playerPokemon';
            if (BATTLE_STATUS[this.battleStatus] === 'slidePokemonIn') {
                this.drawBattleArena();
                this.drawSlidePokemonIn(delta);
                this.drawBattleBox();
            }
            else if (BATTLE_STATUS[this.battleStatus] === 'writeAppearText') {
                this.writeTextToBattleBox('Wild ' + this.pokemon.name.toUpperCase() + ' appeared!|', delta);
            }
            else if (BATTLE_STATUS[this.battleStatus] === 'writeGoText') {
                this.writeTextToBattleBox('GO! ' + playerPokemon + '!|', delta);
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
    drawSlidePokemonIn(delta) {
        if (this.battleAssets) {
            const speed = 256;
            const xPixel = (this.X_slidePokemonIn + delta * speed) << 0;
            this.ctx.drawImage(this.battleAssets, this.environment % 3 * constants_1.constants.BATTLE_SCENE_WIDTH, ((0.5 + this.environment / 3) << 0) * constants_1.constants.BATTLE_SCENE_HEIGHT + 4 * constants_1.constants.BATTLE_ARENA_HEIGHT + constants_1.constants.TEXT_BOX_HEIGHT, constants_1.constants.BATTLE_SCENE_WIDTH, constants_1.constants.BATTLE_SCENE_HEIGHT, xPixel - constants_1.constants.BATTLE_SCENE_WIDTH, 48, constants_1.constants.BATTLE_SCENE_WIDTH, constants_1.constants.BATTLE_SCENE_HEIGHT);
            this.ctx.drawImage(this.battleAssets, this.environment % 3 * constants_1.constants.BATTLE_SCENE_WIDTH, ((0.5 + this.environment / 3) << 0) * 32 + 496, constants_1.constants.BATTLE_SCENE_WIDTH, constants_1.constants.BATTLE_SCENE_HEIGHT, constants_1.constants.GAME_WIDTH - xPixel, 100, constants_1.constants.BATTLE_SCENE_WIDTH, constants_1.constants.BATTLE_SCENE_HEIGHT);
            if (xPixel >= constants_1.constants.GAME_WIDTH) {
                this.nextBattlePhase();
            }
            else {
                this.X_slidePokemonIn += delta * speed;
            }
        }
    }
    writeTextToBattleBox(text, delta) {
        const speed = 256;
        const i = ((this.X_writeTextToBattleBox + delta * speed) / 6) << 0;
        const textToDisplay = text.slice(0, i);
        this.drawText(textToDisplay, 16, 122);
        if (i >= text.length + speed / 6) {
            this.X_writeTextToBattleBox = 0;
            this.nextBattlePhase();
            this.drawBattleBox();
        }
        else {
            this.X_writeTextToBattleBox += delta * speed;
        }
    }
    drawBattleArena() {
        if (this.battleAssets) {
            this.ctx.drawImage(this.battleAssets, this.environment % 3 * constants_1.constants.GAME_WIDTH, ((0.5 + this.environment / 3) << 0) * constants_1.constants.BATTLE_ARENA_HEIGHT, constants_1.constants.GAME_WIDTH, constants_1.constants.BATTLE_ARENA_HEIGHT, 0, 0, constants_1.constants.GAME_WIDTH, constants_1.constants.BATTLE_ARENA_HEIGHT);
        }
    }
    drawBattleBox() {
        if (this.battleAssets) {
            this.ctx.drawImage(this.battleAssets, 0, 4 * constants_1.constants.BATTLE_ARENA_HEIGHT, constants_1.constants.GAME_WIDTH, constants_1.constants.TEXT_BOX_HEIGHT, 0, constants_1.constants.BATTLE_ARENA_HEIGHT, constants_1.constants.GAME_WIDTH, constants_1.constants.TEXT_BOX_HEIGHT);
        }
    }
    drawText(text, posX, posY) {
        for (let i = 0; i < text.length; i++) {
            const positions = {
                posX: constants_1.constants.CHAR_IN_FONT.indexOf(text[i]) % 39 * constants_1.constants.FONT_WIDTH,
                posY: ((constants_1.constants.CHAR_IN_FONT.indexOf(text[i]) / 39) << 0) * constants_1.constants.FONT_HEIGHT,
            };
            let width = constants_1.constants.FONT_WIDTH;
            if (text[i] === '|') { // caret is 1 pixel wider
                width = constants_1.constants.FONT_WIDTH + 1;
            }
            if (this.font) {
                this.ctx.drawImage(this.font, positions.posX, positions.posY, width, constants_1.constants.FONT_HEIGHT, posX + constants_1.constants.FONT_WIDTH * i, posY, width, constants_1.constants.FONT_HEIGHT);
            }
        }
    }
}
exports.PokemonBattle = PokemonBattle;
//# sourceMappingURL=pokemon.js.map