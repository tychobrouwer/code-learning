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
exports.PokemonBattle = void 0;
var FONT_CHARACTERS = [
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
var POKEMON_INDEX = {
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
var PokemonBattle = /** @class */ (function () {
    function PokemonBattle(context, loader, GAME_WIDTH, GAME_HEIGHT, route, environment) {
        this.loader = loader;
        this.GAME_WIDTH = GAME_WIDTH;
        this.GAME_HEIGHT = GAME_HEIGHT;
        this.environment = environment;
        this.route = route;
        this.ctx = context;
        this.pokemon = this.init();
    }
    PokemonBattle.prototype.init = function () {
        var candinates = POKEMON_INDEX[this.route][this.environment];
        var items = [];
        for (var _i = 0, _a = Object.keys(candinates); _i < _a.length; _i++) {
            var pokemon = _a[_i];
            for (var i = 1; i <= candinates[pokemon].encounterRate; i++) {
                items.push(pokemon);
            }
        }
        this.battleAssets = this.loader.getImage('battleAssets');
        this.pokemonGeneration1 = this.loader.getImage('pokemonGeneration1');
        this.font = this.loader.getImage('font');
        return candinates[items[Math.floor(Math.random() * items.length)]];
    };
    PokemonBattle.prototype.getPokemon = function () {
        return this.pokemon;
    };
    PokemonBattle.prototype.battle = function () {
        return __awaiter(this, void 0, void 0, function () {
            var playerPokemon, battleResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        playerPokemon = 'playerPokemon';
                        this.drawBattleScene();
                        this.drawBattleBox();
                        return [4 /*yield*/, this.drawSlidePokemonIn()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.writeTextToBattleBox('Wild ' + this.pokemon.name.toUpperCase() + ' appeared!|')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.writeTextToBattleBox('GO! ' + playerPokemon + '!')];
                    case 3:
                        _a.sent();
                        battleResult = true;
                        return [4 /*yield*/, Promise.resolve(battleResult)];
                    case 4: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PokemonBattle.prototype.drawBattleScene = function () {
        if (this.battleAssets) {
            this.ctx.drawImage(this.battleAssets, this.environment % 3 * this.GAME_WIDTH, Math.floor((this.environment) / 3) * 224, this.GAME_WIDTH, 224, 0, 0, this.GAME_WIDTH, 224);
        }
    };
    PokemonBattle.prototype.drawBattleBox = function () {
        if (this.battleAssets) {
            this.ctx.drawImage(this.battleAssets, 0, 896, this.GAME_WIDTH, 96, 0, 224, this.GAME_WIDTH, 96);
        }
    };
    PokemonBattle.prototype.drawSlidePokemonIn = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var _loop_1 = function (i) {
                setTimeout(function () {
                    _this.drawBattleScene();
                    if (_this.battleAssets) {
                        _this.ctx.drawImage(_this.battleAssets, _this.environment % 3 * 256, Math.floor((_this.environment) / 3) * 64 + 992, 256, 64, i - 256, 96, 256, 64);
                        _this.ctx.drawImage(_this.battleAssets, _this.environment % 3 * 256, Math.floor((_this.environment) / 3) * 64 + 992, 256, 64, _this.GAME_WIDTH - i, 200, 256, 64);
                    }
                    _this.drawBattleBox();
                }, 2 * i);
            };
            for (var i = 0; i < _this.GAME_WIDTH + 1; i++) {
                _loop_1(i);
            }
            setTimeout(function () {
                resolve(true);
            }, 2 * _this.GAME_WIDTH + 500);
        });
    };
    PokemonBattle.prototype.writeTextToBattleBox = function (text) {
        var _this = this;
        return new Promise(function (resolve) {
            var _loop_2 = function (i) {
                var textToDisplay = text.slice(0, i);
                setTimeout(function () {
                    _this.drawText(textToDisplay, 32, 244);
                }, 20 * i);
            };
            for (var i = 1; i < text.length + 1; i++) {
                _loop_2(i);
            }
            setTimeout(function () {
                _this.drawBattleBox();
                resolve(true);
            }, 20 * text.length + 1500);
        });
    };
    PokemonBattle.prototype.drawText = function (text, posX, posY) {
        for (var i = 0; i < text.length; i++) {
            var positions = {
                posX: FONT_CHARACTERS.indexOf(text[i]) % 39 * 12,
                posY: Math.floor(FONT_CHARACTERS.indexOf(text[i]) / 39) * 26
            };
            var width = 12;
            if (text[i] === '|') { // caret is 13 pixels wide
                width = 13;
            }
            if (this.font) {
                this.ctx.drawImage(this.font, positions.posX, positions.posY, width, 26, posX + 12 * i, posY, width, 26);
            }
        }
    };
    return PokemonBattle;
}());
exports.PokemonBattle = PokemonBattle;
//# sourceMappingURL=pokemon.js.map