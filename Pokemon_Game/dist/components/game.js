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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const tiles_png_1 = __importDefault(require("../assets/tiles.png"));
const character_png_1 = __importDefault(require("../assets/character.png"));
const battle_assets_png_1 = __importDefault(require("../assets/battle_assets.png"));
const choose_starter_png_1 = __importDefault(require("../assets/choose_starter.png"));
const pokemon_1st_generation_png_1 = __importDefault(require("../assets/pokemon_1st_generation.png"));
const pokemon_2st_generation_png_1 = __importDefault(require("../assets/pokemon_2st_generation.png"));
const pokemon_3st_generation_png_1 = __importDefault(require("../assets/pokemon_3st_generation.png"));
const font_png_1 = __importDefault(require("../assets/font.png"));
const building_assets_png_1 = __importDefault(require("../assets/building_assets.png"));
const player_1 = require("./player");
const map_1 = require("./map");
const loader_1 = require("../utils/loader");
const camera_1 = require("./camera");
const avatar_1 = require("./avatar");
const pokemon_1 = require("./pokemon");
const constants_1 = require("../utils/constants");
const keyboard_1 = require("../utils/keyboard");
const helper_1 = require("../utils/helper");
class Game {
    constructor(gameCtx, overlayCtx) {
        this.player = new player_1.Player();
        this.loader = new loader_1.Loader();
        this._previousElapsed = 0;
        this.dirx = 0;
        this.diry = 0;
        this.direction = 0;
        this.animation = 0;
        this.currentTileX = 0;
        this.currentTileY = 0;
        this.gameStatus = 'game';
        this.selectedStarter = 1;
        this.keyDown = false;
        this.gameCtx = gameCtx;
        this.overlayCtx = overlayCtx;
        let playerData = this.player.getStoredPlayerData('playerData');
        let gameTriggers = this.player.getStoredPlayerData('gameTriggers');
        if (!playerData.location) {
            playerData = this.player.createNewPlayer(true);
        }
        if (!gameTriggers.chooseStarter) {
            gameTriggers = {
                chooseStarter: false,
            };
        }
        this.currentMap = playerData.location;
        this.gameTriggers = gameTriggers;
        const p = this.load();
        Promise.all(p).then(() => {
            this.init();
            this.map = new map_1.Map(Object.assign({}, constants_1.constants.MAPS[playerData.location]));
            this.avatar = new avatar_1.Avatar(this.loader, this.map);
            this.camera = new camera_1.Camera(Object.assign({}, constants_1.constants.MAPS[playerData.location]), constants_1.constants.GAME_WIDTH, constants_1.constants.GAME_HEIGHT);
            this.camera.follow(this.avatar);
            this.map.updateMap(this.currentMap);
            this.loadAdjacentMaps(true);
            this.avatar.loadMapUpdate(this.map, playerData.position.x, playerData.position.y);
            setInterval(() => this.updateSaveDataLoop(), 1000);
            window.requestAnimationFrame(this.tick.bind(this));
        });
    }
    load() {
        return [
            this.loader.loadImage('tiles', tiles_png_1.default),
            this.loader.loadImage('avatar', character_png_1.default),
            this.loader.loadImage('battleAssets', battle_assets_png_1.default),
            this.loader.loadImage('starterAssets', choose_starter_png_1.default),
            this.loader.loadImage('pokemonGeneration1', pokemon_1st_generation_png_1.default),
            this.loader.loadImage('pokemonGeneration2', pokemon_2st_generation_png_1.default),
            this.loader.loadImage('pokemonGeneration3', pokemon_3st_generation_png_1.default),
            this.loader.loadImage('font', font_png_1.default),
            this.loader.loadImage('buildingAtlas', building_assets_png_1.default),
        ];
    }
    init() {
        keyboard_1.keyboard.listenForEvents([keyboard_1.keyboard.LEFT, keyboard_1.keyboard.RIGHT, keyboard_1.keyboard.UP, keyboard_1.keyboard.DOWN, keyboard_1.keyboard.ENTER]);
        this.tileAtlas = this.loader.loadImageToCanvas('tiles', constants_1.constants.ASSETS_TILES_HEIGHT, constants_1.constants.ASSETS_TILES_WIDTH);
        this.starterAtlas = this.loader.loadImageToCanvas('starterAssets', constants_1.constants.ASSETS_STARTER_HEIGHT, constants_1.constants.ASSETS_STARTER_WIDTH);
        this.font = this.loader.loadImageToCanvas('font', constants_1.constants.ASSETS_FONT_HEIGHT, constants_1.constants.ASSETS_FONT_WIDTH);
        this.buildingAtlas = this.loader.loadImageToCanvas('buildingAtlas', constants_1.constants.ASSETS_BUILDING_TILES_HEIGHT, constants_1.constants.ASSETS_BUILDING_TILES_WIDTH);
    }
    tick(elapsed) {
        return __awaiter(this, void 0, void 0, function* () {
            let delta = (elapsed - this._previousElapsed) / 1000.0;
            delta = Math.min(delta, 0.25); // maximum delta of 250 ms
            this._previousElapsed = elapsed;
            if (this.gameStatus === 'chooseStarter') {
                this.chooseStarter(delta);
            }
            else {
                this.overlayCtx.clearRect(0, 0, constants_1.constants.GAME_WIDTH, constants_1.constants.GAME_HEIGHT);
                this.gameCtx.clearRect(0, 0, constants_1.constants.GAME_WIDTH, constants_1.constants.GAME_HEIGHT);
                this.update(delta);
                this.render(delta);
                yield this.findPokemon();
            }
            window.requestAnimationFrame(this.tick.bind(this));
        });
    }
    updateSaveDataLoop() {
        if (this.avatar) {
            this.player.setPlayerPosition(this.currentMap, this.avatar.x, this.avatar.y);
            const playerData = this.player.getPlayerData();
            (0, helper_1.setLocalStorage)('playerData', playerData);
            (0, helper_1.setLocalStorage)('gameTriggers', this.gameTriggers);
        }
    }
    findPokemon() {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTileX = Math.floor(this.avatar.x / constants_1.constants.MAP_TSIZE);
            const currentTileY = Math.floor(this.avatar.y / constants_1.constants.MAP_TSIZE);
            if (currentTileX !== this.currentTileX || currentTileY !== this.currentTileY) {
                this.currentTileX = currentTileX;
                this.currentTileY = currentTileY;
                const tile = this.map.getTile(0, this.currentTileX, this.currentTileY);
                const randomNumber = (0, helper_1.randomFromMinMax)(0, 2879);
                if (tile === 2 && randomNumber < constants_1.constants.GRASS_ENCOUNTER_NUMBER) {
                    const pokemonBattle = new pokemon_1.PokemonBattle(this.overlayCtx, this.loader, this.player, this.currentMap, 0);
                    const battleResult = yield pokemonBattle.battle();
                    if (battleResult) {
                        console.log('battle with ' + battleResult.pokemon.pokemonName + ' won!');
                        // this.player.addPokemon(foundPokemon);
                    }
                }
            }
        });
    }
    chooseStarter(delta) {
        this.animation = this.animation < 9.94 ? this.animation + 10 * delta : 0;
        let pokeballSource0 = 110;
        let pokeballSource1 = 110;
        let pokeballSource2 = 110;
        if (this.animation < 4) {
            pokeballSource0 = (this.selectedStarter === 0) ? 110 + (this.animation << 0) * 23 : 110;
            pokeballSource1 = (this.selectedStarter === 1) ? 110 + (this.animation << 0) * 23 : 110;
            pokeballSource2 = (this.selectedStarter === 2) ? 110 + (this.animation << 0) * 23 : 110;
        }
        const handXcoor = (this.selectedStarter === 0) ? 48 : (this.selectedStarter === 1) ? 108 : 169;
        const handYcoor = (this.selectedStarter === 1) ? 33 : 9;
        this.overlayCtx.drawImage(this.starterAtlas, 0, 0, constants_1.constants.GAME_WIDTH, constants_1.constants.GAME_HEIGHT, 0, 0, constants_1.constants.GAME_WIDTH, constants_1.constants.GAME_HEIGHT);
        this.overlayCtx.drawImage(this.starterAtlas, 0, 160, 110, 64, 65, 8, 110, 64);
        this.overlayCtx.drawImage(this.starterAtlas, pokeballSource0, 160, 23, 20, 50, 54, 23, 20);
        this.overlayCtx.drawImage(this.starterAtlas, pokeballSource1, 160, 23, 20, 110, 78, 23, 20);
        this.overlayCtx.drawImage(this.starterAtlas, pokeballSource2, 160, 23, 20, 170, 54, 23, 20);
        this.overlayCtx.drawImage(this.starterAtlas, 202, 160, 25, 27, handXcoor, handYcoor, 25, 27);
        if (this.selectedStarter === 0) {
            this.overlayCtx.globalAlpha = 0.4;
            this.overlayCtx.beginPath();
            this.overlayCtx.rect(0, 72, 108, 32);
            this.overlayCtx.fill();
            this.overlayCtx.globalAlpha = 1;
            this.overlayCtx.drawImage(this.starterAtlas, 0, 224, 86, 10, 6, 76, 86, 10);
            this.overlayCtx.drawImage(this.starterAtlas, 0, 234, 42, 10, 31, 92, 42, 10);
        }
        else if (this.selectedStarter === 1) {
            this.overlayCtx.globalAlpha = 0.4;
            this.overlayCtx.beginPath();
            this.overlayCtx.rect(132, 80, 104, 32);
            this.overlayCtx.fill();
            this.overlayCtx.globalAlpha = 1;
            this.overlayCtx.drawImage(this.starterAtlas, 86, 224, 62, 10, 140, 82, 62, 10);
            this.overlayCtx.drawImage(this.starterAtlas, 86, 234, 42, 10, 186, 98, 42, 10);
        }
        else {
            this.overlayCtx.globalAlpha = 0.4;
            this.overlayCtx.beginPath();
            this.overlayCtx.rect(60, 32, 112, 32);
            this.overlayCtx.fill();
            this.overlayCtx.globalAlpha = 1;
            this.overlayCtx.drawImage(this.starterAtlas, 148, 224, 75, 10, 78, 36, 75, 10);
            this.overlayCtx.drawImage(this.starterAtlas, 148, 234, 42, 10, 98, 52, 42, 10);
        }
        this.overlayCtx.drawImage(this.starterAtlas, 0, 244, 206, 46, 17, 114, 206, 46);
        (0, helper_1.drawText)(this.overlayCtx, this.font, 'PROF. BIRCH is in trouble!', 0, 0, 24, 121);
        (0, helper_1.drawText)(this.overlayCtx, this.font, 'Release a POKéMON and rescue him!', 0, 0, 24, 137);
        if (!this.keyDown) {
            if (keyboard_1.keyboard.isDown(keyboard_1.keyboard.LEFT) && this.selectedStarter !== 0) {
                this.selectedStarter--;
                this.keyDown = true;
            }
            else if (keyboard_1.keyboard.isDown(keyboard_1.keyboard.RIGHT) && this.selectedStarter !== 2) {
                this.selectedStarter++;
                this.keyDown = true;
            }
        }
        if (!keyboard_1.keyboard.isDown(keyboard_1.keyboard.LEFT) && !keyboard_1.keyboard.isDown(keyboard_1.keyboard.RIGHT)) {
            this.keyDown = false;
        }
        if (keyboard_1.keyboard.isDown(keyboard_1.keyboard.ENTER)) {
            const chosenPokemonId = (this.selectedStarter === 0) ? 252 : (this.selectedStarter === 1) ? 255 : 258;
            this.player.addPlayerPokemon(chosenPokemonId, [5, -1]);
            this.gameTriggers.chooseStarter = true;
            this.gameStatus = 'game';
        }
    }
    loadAdjacentMaps(fromDirection = false) {
        const Adjacent = this.map.getAjacent(this.currentMap);
        let updatedData;
        const addedAreas = Adjacent.map(a => a.position);
        for (const adjacentMap of Object.values(Adjacent)) {
            updatedData = this.map.addMap(adjacentMap.name, adjacentMap.position, 0);
        }
        if (updatedData) {
            this.camera.updateMap(updatedData.currentMap);
            const addedTiles = [0, 0];
            // THIS SHOULD MAYBE BE UPDATED!!
            if (addedAreas.includes('top') && addedAreas.includes('bottom') && fromDirection === 'top') {
                addedTiles[1] = updatedData.diff[1];
                // console.log('first')
            }
            else if (addedAreas.includes('top') && !addedAreas.includes('bottom') && fromDirection === 'bottom') {
                addedTiles[1] = updatedData.diff[1];
                // console.log('second')
            }
            if (addedAreas.includes('left') && addedAreas.includes('bottom') && fromDirection === 'top') {
                addedTiles[0] = updatedData.diff[0];
                // console.log('third')
            }
            else if (addedAreas.includes('bottom') && addedAreas.includes('top') && fromDirection === 'bottom') {
                addedTiles[0] = updatedData.diff[0];
                // console.log('fourth')
            }
            // /////////////////////////// //
            return addedTiles;
        }
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
        const isNextMap = this.map.isNextMap(this.avatar.x, this.avatar.y);
        if (typeof isNextMap !== 'boolean') {
            this.currentMap = isNextMap[0];
            console.log('Entered new area: ' + this.currentMap);
            // const fileName = this.currentMap.replace(' ', '_');
            // console.log(fileName)
            // this.buildingTiles = this.loader.loadImageToCanvas(fileName, constants.ASSETS_LOCATION_TILES[fileName].height, constants.ASSETS_LOCATION_TILES[fileName].width);
            this.map.updateMap(this.currentMap);
            const addedTiles = this.loadAdjacentMaps(isNextMap[1]);
            if (addedTiles) {
                this.avatar.newAreaMapUpdate(this.map, addedTiles);
            }
            if (this.currentMap === 'route 101' && this.gameTriggers.chooseStarter === false) {
                this.gameStatus = 'chooseStarter';
                // await this.chooseStarter();
            }
        }
        this.avatar.move(delta, this.dirx, this.diry);
        this.camera.update();
    }
    render(delta) {
        this.drawLayer(0);
        this.drawPlayer(delta, false);
        this.drawLayer(1);
        this.drawPlayer(delta, true);
        this.drawLayer(2);
    }
    drawLayer(layer) {
        const startCol = Math.floor(this.camera.x / constants_1.constants.MAP_TSIZE);
        const endCol = startCol + (this.camera.width / constants_1.constants.MAP_TSIZE);
        const startRow = Math.floor(this.camera.y / constants_1.constants.MAP_TSIZE);
        const endRow = startRow + (this.camera.height / constants_1.constants.MAP_TSIZE);
        const offsetX = -this.camera.x + startCol * constants_1.constants.MAP_TSIZE;
        const offsetY = -this.camera.y + startRow * constants_1.constants.MAP_TSIZE;
        // tiles 0-499 for general tiles
        // tiles 500- for building tiles
        for (let c = startCol; c <= endCol; c++) {
            for (let r = startRow; r <= endRow; r++) {
                let tile = this.map.getTile(layer, c, r);
                if (tile === -1)
                    break;
                const x = (c - startCol) * constants_1.constants.MAP_TSIZE + offsetX;
                const y = (r - startRow) * constants_1.constants.MAP_TSIZE + offsetY;
                let atlas;
                if (500 <= tile) {
                    atlas = this.buildingAtlas;
                    tile = tile - 500;
                }
                else {
                    atlas = this.tileAtlas;
                }
                if (tile !== 0 && atlas) {
                    this.gameCtx.drawImage(atlas, (tile - 1) % 16 * constants_1.constants.MAP_TSIZE, Math.floor((tile - 1) / 16) * constants_1.constants.MAP_TSIZE, constants_1.constants.MAP_TSIZE, constants_1.constants.MAP_TSIZE, Math.round(x), Math.round(y), constants_1.constants.MAP_TSIZE, constants_1.constants.MAP_TSIZE);
                }
            }
        }
    }
    drawPlayer(delta, onlyDrawTop) {
        if (!onlyDrawTop) {
            this.direction = this.diry === 1 ? 0 : this.dirx === -1 ? 1 : this.diry === -1 ? 2 : this.dirx === 1 ? 3 : this.direction;
            if (this.diry === 0 && this.dirx === 0) {
                this.animation = 0;
            }
            else {
                this.animation = this.animation < 3.95 ? this.animation + 6 * delta : 0;
            }
        }
        const pixelHeight = onlyDrawTop ? 0.75 * constants_1.constants.AVATAR_HEIGHT : constants_1.constants.AVATAR_HEIGHT;
        const characterStart = this.direction * constants_1.constants.AVATAR_WIDTH * 4 + (this.animation << 0) * constants_1.constants.AVATAR_WIDTH;
        if (this.avatar.avatarAsset) {
            this.gameCtx.drawImage(this.avatar.avatarAsset, characterStart, 0, constants_1.constants.AVATAR_WIDTH, pixelHeight, (0.5 + this.avatar.screenX - constants_1.constants.AVATAR_WIDTH / 2) << 0, (0.5 + this.avatar.screenY - constants_1.constants.AVATAR_HEIGHT / 2 + (((1 < this.animation && this.animation < 2) || (3 < this.animation && this.animation < 4)) ? 1 : 0)) << 0, constants_1.constants.AVATAR_WIDTH, pixelHeight);
        }
    }
}
exports.Game = Game;
Game.GAME_WIDTH = constants_1.constants.GAME_WIDTH;
Game.GAME_HEIGHT = constants_1.constants.GAME_HEIGHT;
//# sourceMappingURL=game.js.map