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
const map_1 = require("./map");
const keyboard_1 = require("./keyboard");
const loader_1 = require("./loader");
const camera_1 = require("./camera");
const avatar_1 = require("./avatar");
const pokemon_1 = require("./pokemon");
class Game {
    constructor(context) {
        this.GAME_HEIGHT = 320;
        this.GAME_WIDTH = 480;
        this.ASSETS_FILE_HEIGHT = 512;
        this.ASSETS_FILE_WIDTH = 512;
        this._previousElapsed = 0;
        this.dirx = 0;
        this.diry = 0;
        this.direction = 0;
        this.animation = 0;
        this.currentTileX = 0;
        this.currentTileY = 0;
        this.loader = new loader_1.Loader();
        const p = this.load();
        Promise.all(p).then(() => {
            this.init();
            this.avatar = new avatar_1.Avatar(this.loader, map_1.map, 200, 200);
            this.camera = new camera_1.Camera(map_1.map, this.GAME_WIDTH, this.GAME_HEIGHT);
            this.ctx = context;
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
        this.tileAtlas = this.loader.loadImageToCanvas('tiles', this.ASSETS_FILE_HEIGHT, this.ASSETS_FILE_WIDTH);
    }
    tick(elapsed) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.clearRect(0, 0, this.GAME_WIDTH, this.GAME_HEIGHT);
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
            const currentTileX = Math.floor(this.avatar.x / map_1.map.TSIZE);
            const currentTileY = Math.floor(this.avatar.y / map_1.map.TSIZE);
            if (currentTileX !== this.currentTileX || currentTileY !== this.currentTileY) {
                this.currentTileX = currentTileX;
                this.currentTileY = currentTileY;
                const tile = map_1.map.getTile(0, this.currentTileX, this.currentTileY);
                if (tile === 2 && Math.random() < 0.1) {
                    const pokemonBattle = new pokemon_1.PokemonBattle(this.ctx, this.loader, this.GAME_WIDTH, this.GAME_HEIGHT, 0, 0);
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
        const startCol = Math.floor(this.camera.x / map_1.map.TSIZE);
        const endCol = startCol + (this.camera.width / map_1.map.TSIZE);
        const startRow = Math.floor(this.camera.y / map_1.map.TSIZE);
        const endRow = startRow + (this.camera.height / map_1.map.TSIZE);
        const offsetX = -this.camera.x + startCol * map_1.map.TSIZE;
        const offsetY = -this.camera.y + startRow * map_1.map.TSIZE;
        for (let c = startCol; c <= endCol; c++) {
            for (let r = startRow; r <= endRow; r++) {
                const tile = map_1.map.getTile(layer, c, r);
                const x = (0.5 + (c - startCol) * map_1.map.TSIZE + offsetX) << 0;
                const y = (0.5 + (r - startRow) * map_1.map.TSIZE + offsetY) << 0;
                if (tile !== 0 && this.tileAtlas) {
                    this.ctx.drawImage(this.tileAtlas, (tile - 1) % 16 * map_1.map.TSIZE, Math.floor((tile - 1) / 16) * map_1.map.TSIZE, map_1.map.TSIZE, map_1.map.TSIZE, x, y, map_1.map.TSIZE, map_1.map.TSIZE);
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
            this.animation = this.animation < 87 ? this.animation + 1 : 0;
        }
        const pixelHeight = onlyDrawTop ? 30 : 40;
        const characterStart = this.direction * 84 + Math.floor(this.animation / 30) * 28;
        if (this.avatar.avatarAsset) {
            this.ctx.drawImage(this.avatar.avatarAsset, characterStart, 0, 28, pixelHeight, (0.5 + this.avatar.screenX - this.avatar.AVATAR_WIDTH / 2) << 0, (0.5 + this.avatar.screenY - this.avatar.AVATAR_HEIGHT / 2) << 0, 28, pixelHeight);
        }
    }
}
exports.Game = Game;
//# sourceMappingURL=game.js.map