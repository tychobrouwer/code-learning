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
exports.Game = void 0;
const tiles_png_1 = require("../assets/tiles.png");
const character_png_1 = require("../assets/character.png");
const battle_assets_png_1 = require("../assets/battle_assets.png");
const pokemon_1st_generation_png_1 = require("../assets/pokemon_1st_generation.png");
const font_png_1 = require("../assets/font.png");
const constants_1 = require("../utils/constants");
const map_1 = require("./map");
const keyboard_1 = require("../utils/keyboard");
const loader_1 = require("../utils/loader");
const camera_1 = require("./camera");
const avatar_1 = require("./avatar");
const pokemon_1 = require("./pokemon");
class Game {
    constructor(context) {
        this._previousElapsed = 0;
        this.dirx = 0;
        this.diry = 0;
        this.direction = 0;
        this.animation = 0;
        this.currentTileX = 0;
        this.currentTileY = 0;
        this.loader = new loader_1.Loader();
        this.GAME_HEIGHT = constants_1.constants.GAME_HEIGHT;
        this.GAME_WIDTH = constants_1.constants.GAME_WIDTH;
        this.ctx = context;
        const p = this.load();
        Promise.all(p).then(() => {
            this.init();
            this.avatar = new avatar_1.Avatar(this.loader, map_1.map);
            this.camera = new camera_1.Camera(map_1.map, constants_1.constants.GAME_WIDTH, constants_1.constants.GAME_HEIGHT);
            this.camera.follow(this.avatar);
            window.requestAnimationFrame(this.tick.bind(this));
        });
    }
    load() {
        return [
            this.loader.loadImage('tiles', tiles_png_1.default),
            this.loader.loadImage('avatar', character_png_1.default),
            this.loader.loadImage('battleAssets', battle_assets_png_1.default),
            this.loader.loadImage('pokemonGeneration1', pokemon_1st_generation_png_1.default),
            this.loader.loadImage('font', font_png_1.default),
        ];
    }
    init() {
        keyboard_1.keyboard.listenForEvents([keyboard_1.keyboard.LEFT, keyboard_1.keyboard.RIGHT, keyboard_1.keyboard.UP, keyboard_1.keyboard.DOWN]);
        this.tileAtlas = this.loader.loadImageToCanvas('tiles', constants_1.constants.ASSETS_TILES_HEIGHT, constants_1.constants.ASSETS_TILES_WIDTH);
    }
    tick(elapsed) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ctx.clearRect(0, 0, constants_1.constants.GAME_WIDTH, constants_1.constants.GAME_HEIGHT);
            let delta = (elapsed - this._previousElapsed) / 1000.0;
            delta = Math.min(delta, 0.25); // maximum delta of 250 ms
            this._previousElapsed = elapsed;
            this.update(delta);
            this.render();
            yield this.findPokemon();
            window.requestAnimationFrame(this.tick.bind(this));
        });
    }
    findPokemon() {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTileX = Math.floor(this.avatar.x / constants_1.constants.MAP_TSIZE);
            const currentTileY = Math.floor(this.avatar.y / constants_1.constants.MAP_TSIZE);
            if (currentTileX !== this.currentTileX || currentTileY !== this.currentTileY) {
                this.currentTileX = currentTileX;
                this.currentTileY = currentTileY;
                const tile = map_1.map.getTile(0, this.currentTileX, this.currentTileY);
                if (tile === 2 && Math.random() < 0.1) {
                    const pokemonBattle = new pokemon_1.PokemonBattle(this.ctx, this.loader, 0, 0);
                    const pokemon = pokemonBattle.getPokemon();
                    console.log(pokemon.name + ' found!');
                    const battleResult = yield pokemonBattle.battle();
                    if (battleResult) {
                        console.log('battle won!');
                        // this.player.addPokemon(foundPokemon);
                    }
                }
            }
        });
    }
    update(delta) {
        this.dirx = 0;
        this.diry = 0;
        if (keyboard_1.keyboard.isDown(keyboard_1.keyboard.LEFT)) {
            this.dirx = -1;
        }
        else if (keyboard_1.keyboard.isDown(keyboard_1.keyboard.RIGHT)) {
            this.dirx = 1;
        }
        else if (keyboard_1.keyboard.isDown(keyboard_1.keyboard.UP)) {
            this.diry = -1;
        }
        else if (keyboard_1.keyboard.isDown(keyboard_1.keyboard.DOWN)) {
            this.diry = 1;
        }
        this.avatar.move(delta, this.dirx, this.diry);
        this.camera.update();
    }
    render() {
        this.drawLayer(0);
        this.drawPlayer(false);
        this.drawLayer(1);
        this.drawPlayer(true);
    }
    drawLayer(layer) {
        const startCol = Math.floor(this.camera.x / constants_1.constants.MAP_TSIZE);
        const endCol = startCol + (this.camera.width / constants_1.constants.MAP_TSIZE);
        const startRow = Math.floor(this.camera.y / constants_1.constants.MAP_TSIZE);
        const endRow = startRow + (this.camera.height / constants_1.constants.MAP_TSIZE);
        const offsetX = -this.camera.x + startCol * constants_1.constants.MAP_TSIZE;
        const offsetY = -this.camera.y + startRow * constants_1.constants.MAP_TSIZE;
        for (let c = startCol; c <= endCol; c++) {
            for (let r = startRow; r <= endRow; r++) {
                const tile = map_1.map.getTile(layer, c, r);
                const x = (0.5 + (c - startCol) * constants_1.constants.MAP_TSIZE + offsetX) << 0;
                const y = (0.5 + (r - startRow) * constants_1.constants.MAP_TSIZE + offsetY) << 0;
                if (tile !== 0 && this.tileAtlas) {
                    this.ctx.drawImage(this.tileAtlas, (tile - 1) % 16 * constants_1.constants.MAP_TSIZE, Math.floor((tile - 1) / 16) * constants_1.constants.MAP_TSIZE, constants_1.constants.MAP_TSIZE, constants_1.constants.MAP_TSIZE, x, y, constants_1.constants.MAP_TSIZE, constants_1.constants.MAP_TSIZE);
                }
            }
        }
    }
    drawPlayer(onlyDrawTop) {
        if (!onlyDrawTop) {
            this.direction = this.diry === 1 ? 0 : this.dirx === -1 ? 1 : this.diry === -1 ? 2 : this.dirx === 1 ? 3 : this.direction;
            if (this.diry === 0 && this.dirx === 0) {
                this.animation = 0;
            }
            else {
                this.animation = this.animation < 2.925 ? this.animation + 0.075 : 0;
            }
        }
        const pixelHeight = onlyDrawTop ? 0.75 * constants_1.constants.AVATAR_HEIGHT : constants_1.constants.AVATAR_HEIGHT;
        const characterStart = this.direction * constants_1.constants.AVATAR_WIDTH * 3 + (this.animation << 0) * constants_1.constants.AVATAR_WIDTH;
        if (this.avatar.avatarAsset) {
            this.ctx.drawImage(this.avatar.avatarAsset, characterStart, 0, constants_1.constants.AVATAR_WIDTH, pixelHeight, (0.5 + this.avatar.screenX - constants_1.constants.AVATAR_WIDTH / 2) << 0, (0.5 + this.avatar.screenY - constants_1.constants.AVATAR_HEIGHT / 2) << 0, constants_1.constants.AVATAR_WIDTH, pixelHeight);
        }
    }
}
exports.Game = Game;
//# sourceMappingURL=game.js.map