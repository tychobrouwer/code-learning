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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Game = void 0;
var tiles_png_1 = require("../assets/tiles.png");
var character_png_1 = require("../assets/character.png");
var battle_assets_png_1 = require("../assets/battle_assets.png");
var pokemon_1st_generation_png_1 = require("../assets/pokemon_1st_generation.png");
var font_png_1 = require("../assets/font.png");
var map_1 = require("./map");
var keyboard_1 = require("./keyboard");
var loader_1 = require("./loader");
var camera_1 = require("./camera");
var avatar_1 = require("./avatar");
var pokemon_1 = require("./pokemon");
var Game = /** @class */ (function () {
    function Game(context) {
        var _this = this;
        this.GAME_HEIGHT = 320;
        this.GAME_WIDTH = 480;
        this._previousElapsed = 0;
        this.dirx = 0;
        this.diry = 0;
        this.direction = 0;
        this.animation = 0;
        this.tileX = 0;
        this.tileY = 0;
        this.loader = new loader_1.Loader();
        var p = this.load();
        Promise.all(p).then(function () {
            _this.init();
            _this.avatar = new avatar_1.Avatar(_this.loader, map_1.map, 200, 200);
            _this.camera = new camera_1.Camera(map_1.map, _this.GAME_WIDTH, _this.GAME_HEIGHT);
            _this.ctx = context;
            _this.camera.follow(_this.avatar);
            window.requestAnimationFrame(function () { return _this.tick(0); });
        });
    }
    Game.prototype.load = function () {
        return [
            this.loader.loadImage('tiles', tiles_png_1["default"]),
            this.loader.loadImage('avatar', character_png_1["default"]),
            this.loader.loadImage('battleAssets', battle_assets_png_1["default"]),
            this.loader.loadImage('pokemonGeneration1', pokemon_1st_generation_png_1["default"]),
            this.loader.loadImage('font', font_png_1["default"]),
        ];
    };
    Game.prototype.init = function () {
        keyboard_1.keyboard.listenForEvents([keyboard_1.keyboard.LEFT, keyboard_1.keyboard.RIGHT, keyboard_1.keyboard.UP, keyboard_1.keyboard.DOWN]);
        this.tileAtlas = this.loader.getImage('tiles');
    };
    Game.prototype.tick = function (elapsed) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var delta;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.clearRect(0, 0, this.GAME_WIDTH, this.GAME_HEIGHT);
                        delta = 0.01;
                        this._previousElapsed = elapsed;
                        this.update(delta);
                        this.render();
                        return [4 /*yield*/, this.findPokemon()];
                    case 1:
                        _b.sent();
                        window.requestAnimationFrame(function () { return _this.tick(elapsed); });
                        return [2 /*return*/];
                }
            });
        });
    };
    Game.prototype.findPokemon = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tileX, tileY, tile, pokemonBattle, pokemon, battleResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tileX = Math.floor(this.avatar.x / map_1.map.TSIZE);
                        tileY = Math.floor(this.avatar.y / map_1.map.TSIZE);
                        if (!(tileX !== this.tileX || tileY !== this.tileY)) return [3 /*break*/, 2];
                        this.tileX = tileX;
                        this.tileY = tileY;
                        tile = map_1.map.getTile(0, this.tileX, this.tileY);
                        if (!(tile === 2 && Math.random() < 0.1)) return [3 /*break*/, 2];
                        pokemonBattle = new pokemon_1.PokemonBattle(this.ctx, this.loader, this.GAME_WIDTH, this.GAME_HEIGHT, 0, 0);
                        pokemon = pokemonBattle.getPokemon();
                        console.log(pokemon.name + ' found!');
                        return [4 /*yield*/, pokemonBattle.battle()];
                    case 1:
                        battleResult = _a.sent();
                        if (battleResult) {
                            console.log('battle won!');
                            // this.player.addPokemon(foundPokemon);
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    Game.prototype.update = function (delta) {
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
    };
    Game.prototype.render = function () {
        this.drawLayer(0);
        this.drawPlayer(false);
        this.drawLayer(1);
        this.drawPlayer(true);
    };
    Game.prototype.drawLayer = function (layer) {
        var startCol = Math.floor(this.camera.x / map_1.map.TSIZE);
        var endCol = startCol + (this.camera.width / map_1.map.TSIZE);
        var startRow = Math.floor(this.camera.y / map_1.map.TSIZE);
        var endRow = startRow + (this.camera.height / map_1.map.TSIZE);
        var offsetX = -this.camera.x + startCol * map_1.map.TSIZE;
        var offsetY = -this.camera.y + startRow * map_1.map.TSIZE;
        for (var c = startCol; c <= endCol; c++) {
            for (var r = startRow; r <= endRow; r++) {
                var tile = map_1.map.getTile(layer, c, r);
                var x = (c - startCol) * map_1.map.TSIZE + offsetX;
                var y = (r - startRow) * map_1.map.TSIZE + offsetY;
                if (tile !== 0 && this.tileAtlas) {
                    this.ctx.drawImage(this.tileAtlas, (tile - 1) % 16 * map_1.map.TSIZE, Math.floor((tile - 1) / 16) * map_1.map.TSIZE, map_1.map.TSIZE, map_1.map.TSIZE, Math.round(x), Math.round(y), map_1.map.TSIZE, map_1.map.TSIZE);
                }
            }
        }
    };
    Game.prototype.drawPlayer = function (onlyDrawTop) {
        if (!onlyDrawTop) {
            this.direction = this.diry === 1 ? 0 : this.dirx === -1 ? 1 : this.diry === -1 ? 2 : this.dirx === 1 ? 3 : this.direction;
            if (this.diry === 0 && this.dirx === 0) {
                this.animation = 0;
            }
            this.animation = this.animation < 87 ? this.animation + 1 : 0;
        }
        var pixelHeight = onlyDrawTop ? 30 : 40;
        var characterStart = this.direction * 84 + Math.floor(this.animation / 30) * 28;
        if (this.avatar.image) {
            this.ctx.drawImage(this.avatar.image, characterStart, 0, 28, pixelHeight, this.avatar.screenX - this.avatar.AVATAR_WIDTH / 2, this.avatar.screenY - this.avatar.AVATAR_HEIGHT / 2, 28, pixelHeight);
        }
    };
    return Game;
}());
exports.Game = Game;
//# sourceMappingURL=game.js.map