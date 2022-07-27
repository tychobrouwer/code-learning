"use strict";
// import characterMap from './assets/character.png';
// import tileMap from './assets/tiles.png';
// import { MapType, Keyboard } from './types';
exports.__esModule = true;
var game_1 = require("./game");
// type MapType = {
//   cols: number;
//   rows: number;
//   tsize: number;
//   layers: Array<Array<number>>
//   getTile: (layer: number, col: number, row: number) => number;
//   isSolidTileAtXY: (x: number, y: number, dirx: number, diry: number) => boolean;
//   getCol: (x: number) => number;
//   getRow: (y: number) => number;
//   getX: (col: number) => number;
//   getY: (row: number) => number;
// };
// type Keyboard = {
//   LEFT: string;
//   RIGHT: string;
//   UP: string;
//   DOWN: string;
//   _keys: object
//   listenForEvents: (keys: Array<string>) => void;
//   _onKeyDown: (event: KeyboardEvent) => void;
//   _onKeyUp: (event: KeyboardEvent) => void;
//   isDown: (keyCode: string) => boolean;
// }
// const map: MapType = {
//   cols: 24,
//   rows: 21,
//   tsize: 32,
//   layers: [[
//       10, 11, 10, 11, 10, 11, 10, 11, 10, 11,  1,  1,  1,  1, 12, 13, 12, 13, 12, 13, 12, 13, 12, 13,
//       12, 13, 12, 13, 12, 13, 12, 13, 12, 13,  1,  1,  1,  1, 10, 11, 10, 11, 10, 11, 10, 11, 10, 11,
//       10, 11, 10, 11, 10, 11, 10, 11, 10, 11,  1,  1,  1,  1, 12, 13, 12, 13, 12, 13, 12, 13, 12, 13,
//       12, 13, 12, 13,  2,  2,  2,  1,  1,  1,  1,  1,  1,  1, 10, 11, 10, 11, 10, 11, 10, 11, 10, 11,
//       10, 11, 10, 11,  2,  2,  2,  2,  1,  1,  1,  1,  1,  1,  1,  2,  2,  2, 12, 13, 12, 13, 12, 13,
//       12, 13,  2,  2,  2,  2,  2,  2,  1,  1,  1,  1,  1,  1,  2,  2,  2,  2, 10, 11, 10, 11, 10, 11,
//       10, 11,  2,  2,  2,  2,  1,  1,  1,  1,  1,  1,  1,  1,  2,  2,  2,  2,  2,  2, 12, 13, 12, 13,
//       12, 13, 12, 13,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  2,  2,  2,  2,  2,  2, 10, 11, 10, 11,
//       10, 11, 10, 11,  1,  1,  1,  1,  5,  3,  3,  3,  4, 12, 13,  2,  2,  2,  2,  1,  1,  1, 12, 13,
//       12, 13, 12, 13,  7,  3,  3,  3,  6,  1,  1,  1,  1, 10, 11, 12, 13,  1,  1,  1,  1,  1, 10, 11,
//       10, 11, 10, 11,  1,  1,  1,  1,  1,  1,  1,  1,  1, 12, 13, 10, 11,  1,  1, 22, 23,  1, 12, 13,
//       12, 13, 12, 13,  1,  1,  1,  1,  1, 22, 18, 23,  1, 10, 11,  2,  2,  1, 22, 17, 20,  1, 10, 11,
//       10, 11, 10, 11, 12, 13,  1, 22, 18, 17, 17, 20,  1,  2,  2,  2,  2,  2, 24, 17, 17, 23, 12, 13,
//       12, 13, 12, 13, 10, 11,  1, 24, 17, 17, 17, 25,  1,  2,  2,  2,  2,  2,  2, 24, 17, 20, 10, 11,
//       10, 11, 10, 11, 12, 13,  1,  1, 24, 19, 25,  1,  1,  2,  2,  2,  2,  2,  2,  1, 24, 25, 12, 13,
//       12, 13, 12, 13, 10, 11,  1,  1,  1,  1,  7,  3,  3,  4,  2,  2,  2,  2,  2,  1,  1,  1, 10, 11,
//       10, 11, 10, 11,  2,  2,  2,  1,  1,  1,  1,  1,  1,  1, 12, 13,  2,  2,  1,  1,  1,  1, 12, 13,
//       12, 13, 12, 13,  2,  2,  2,  2,  1,  1,  1,  1,  1,  1, 10, 11,  2,  2,  1,  1,  1,  1, 10, 11,
//       10, 11, 10, 11,  2,  2,  2,  2,  1,  1,  1,  1,  1,  1, 12, 13, 12, 13, 12, 13, 12, 13, 12, 13,
//       12, 13, 12, 13, 12, 13, 12, 13, 12, 13,  1,  1,  1,  1, 10, 11, 10, 11, 10, 11, 10, 11, 10, 11,
//       10, 11, 10, 11, 10, 11, 10, 11, 10, 11,  1,  1,  1,  1, 12, 13, 12, 13, 12, 13, 12, 13, 12, 13
//   ], [
//       14, 15, 14, 15, 14, 15, 14, 15, 14, 15,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
//        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 14, 15, 14, 15, 14, 15, 14, 15, 14, 15,
//       14, 15, 14, 15,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
//        0,  0,  0,  0, 16, 16, 16,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 14, 15, 14, 15, 14, 15,
//       14, 15,  0,  0, 16, 16, 16, 16,  0,  0,  0,  0,  0,  0,  0, 16, 16, 16,  0,  0,  0,  0,  0,  0,
//        0,  0, 16, 16, 16, 16, 16, 16,  0,  0,  0,  0,  0,  0, 16, 16, 16, 16,  0,  0, 14, 15, 14, 15,
//       14, 15, 26, 27, 16, 16,  0,  0,  0,  0,  0,  0,  0,  0, 16, 16, 16, 16, 16, 16,  0,  0,  0,  0,
//        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 14, 27, 16, 16, 16, 16, 16,  0,  0, 14, 15,
//       14, 15, 14, 15,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 26, 27, 16, 16,  0,  0,  0,  0,  0,
//        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 14, 15,  0,  0,  0,  0,  0,  0,  0, 14, 15,
//       14, 15, 14, 15,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
//        0,  0,  0,  0, 14, 15,  0,  0,  0,  0,  0,  0,  0,  0,  0, 16, 16,  0,  0,  0,  0,  0, 14, 15,
//       14, 15, 14, 15, 12, 13,  0,  0,  0,  0,  0,  0,  0, 16, 16, 16, 16, 16,  0,  0,  0,  0,  0,  0,
//        0,  0,  0,  0, 14, 15,  0,  0,  0,  0,  0,  0,  0, 16, 16, 16, 16, 16, 16,  0,  0,  0, 14, 15,
//       14, 15, 14, 15,  0,  0,  0,  0,  0,  0,  0,  0,  0, 16, 16, 16, 16, 16, 16,  0,  0,  0,  0,  0,
//        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 26, 27, 16, 16, 16,  0,  0,  0, 14, 15,
//       14, 15, 14, 15, 16, 16, 16,  0,  0,  0,  0,  0,  0,  0,  0,  0, 16, 16,  0,  0,  0,  0,  0,  0,
//        0,  0,  0,  0, 16, 16, 16, 16,  0,  0,  0,  0,  0,  0, 14, 15, 26, 27, 14, 15, 14, 15, 14, 15,
//       14, 15, 14, 15, 26, 27, 26, 27, 14, 15,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
//        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 14, 15, 14, 15, 14, 15, 14, 15, 14, 15,
//        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
//   ]],
//   getTile: function (layer: number, col: number, row: number): number {
//       return this.layers[layer][row * map.cols + col];
//   },
//   isSolidTileAtXY: function (x: number, y: number, dirX: number, dirY: number): boolean {
//     const col = Math.floor(x / this.tsize);
//     const row = Math.floor(y / this.tsize);
//     return this.layers.reduce(function (res: boolean, layer: number, index: number) {
//       const tile = this.getTile(index, col, row);
//       const isSolid = tile === 10 || tile === 11 || tile === 12 || tile === 13;
//       const oneWay = 
//         (dirY === -1 && (tile === 3 || tile === 4)) || 
//         ((dirY === -1 || dirX === 1 || dirX === -1) && tile === 7) ||
//         ((dirY === -1 || dirX === -1) && tile === 6) ||
//         ((dirY === -1 || dirX === -1) && tile === 5) ||
//         ((dirY === 1 || dirX === 1) && tile === 9) ||
//         ((dirY === 1 || dirX === 1) && tile === 8);
//       return res || isSolid || oneWay;
//     }.bind(this), false);
//   },
//   getCol: function (x: number): number {
//     return Math.floor(x / this.tsize);
//   },
//   getRow: function (y: number): number {
//     return Math.floor(y / this.tsize);
//   },
//   getX: function (col: number): number {
//     return col * this.tsize;
//   },
//   getY: function (row: number): number {
//       return row * this.tsize;
//   }
// }
// const keyboard: Keyboard = {
//   LEFT: 'a',
//   RIGHT: 'd',
//   UP: 'w',
//   DOWN: 's',
//   _keys: {},
//   listenForEvents: function(keys: Array<string>) {
//     window.addEventListener('keydown', this._onKeyDown.bind(this));
//     window.addEventListener('keyup', this._onKeyUp.bind(this));
//     keys.forEach(function (key: string) {
//       this._keys[key] = false;
//     }.bind(this));
//   },
//   _onKeyDown: function(event: KeyboardEvent) {
//     const keyCode = event.key;
//     if (keyCode in this._keys) {
//       event.preventDefault();
//       this._keys[keyCode] = true;
//     }
//   },
//   _onKeyUp: function(event: KeyboardEvent) {
//     const keyCode = event.key;
//     if (keyCode in this._keys) {
//       event.preventDefault();
//       this._keys[keyCode] = false;
//     }
//   },
//   isDown: function(keyCode: string):boolean {
//     if (!(keyCode in this._keys)) {
//       throw new Error('Keycode ' + keyCode + ' is not being listened to');
//     }
//     return this._keys[keyCode];
//   }
// };
// class Camera {
//   x: number;
//   y: number;
//   width: number;
//   height: number;
//   maxX: number;
//   maxY: number;
//   following: Character;
//   constructor(map: MapType, width: number, height: number) {
//     this.x = 0;
//     this.y = 0;
//     this.width = width;
//     this.height = height;
//     this.maxX = map.cols * map.tsize - width;
//     this.maxY = map.rows * map.tsize - height;
//   }
//   follow(sprite: Character) {
//     this.following = sprite;
//     sprite.screenX = 0;
//     sprite.screenY = 0;
//   }
//   update() {
//     this.following.screenX = this.width / 2;
//     this.following.screenY = this.height / 2;
//     this.x = this.following.x - this.width / 2;
//     this.y = this.following.y - this.height / 2;
//     this.x = Math.max(0, Math.min(this.x, this.maxX));
//     this.y = Math.max(0, Math.min(this.y, this.maxY));
//     if (this.following.x < this.width / 2 ||
//       this.following.x > this.maxX + this.width / 2) {
//       this.following.screenX = this.following.x - this.x;
//     }
//     if (this.following.y < this.height / 2 ||
//       this.following.y > this.maxY + this.height / 2) {
//       this.following.screenY = this.following.y - this.y;
//     }
//   }
// }
// class Character {
//   map: MapType;
//   x: number;
//   y: number;
//   width: number;
//   height: number;
//   maxX: number;
//   maxY: number;
//   SPEED: number;
//   screenX: number;
//   screenY: number;
//   image: HTMLImageElement;
//   constructor(map: MapType, x: number, y: number) {
//     this.map = map;
//     this.x = x;
//     this.y = y;
//     this.width = 28;
//     this.height = 40;
//     this.SPEED = 64;
//     this.image = new Image();
//     this.image.src = characterMap;
//   }
//   move(delta: number, dirx: number, diry: number) {
//     const x = this.x;
//     const y = this.y;
//     this.x += dirx * this.SPEED * delta;
//     this.y += diry * this.SPEED * delta;  
//     this._collide(dirx, diry, x, y);
//     const maxX = this.map.cols * this.map.tsize;
//     const maxY = this.map.rows * this.map.tsize;
//     this.x = Math.max(0, Math.min(this.x, maxX));
//     this.y = Math.max(0, Math.min(this.y, maxY));
//   }
//   _collide(dirx: number, diry: number, x: number, y: number): void {
//     const left = this.x - this.width / 2;
//     const right = this.x + this.width / 2 - 1;
//     const top = this.y - this.height / 2;
//     const bottom = this.y + this.height / 2 - 1;
//     const collision =
//       this.map.isSolidTileAtXY(left, this.y, dirx, diry) ||
//       this.map.isSolidTileAtXY(right, this.y, dirx, diry) ||
//       this.map.isSolidTileAtXY(left, top, dirx, diry) ||
//       this.map.isSolidTileAtXY(right, top, dirx, diry) ||
//       this.map.isSolidTileAtXY(right, bottom, dirx, diry) ||
//       this.map.isSolidTileAtXY(left, bottom, dirx, diry);
//     if (!collision) { return; }
//     if (diry !== 0) {
//       this.y = y;
//     } else if (dirx !== 0) {
//       this.x = x;
//     }
//   }
// }
// class Game {
//   ctx: CanvasRenderingContext2D;
//   _previousElapsed: number;
//   tileAtlas: HTMLImageElement;
//   character: Character;
//   camera: Camera;
//   dirx: number;
//   diry: number;
//   direction: number;
//   animation: number;
//   tileX: number;
//   tileY: number;
//   constructor() {
//     this._previousElapsed = 0;
//     this.dirx = 0;
//     this.diry = 0;
//     this.direction = 0;
//     this.animation = 0;
//     this.character = new Character(map, 200, 200);
//     this.camera = new Camera(map, 384, 256);
//     this.camera.follow(this.character);
//   }
//   run(context: CanvasRenderingContext2D) {
//     this.ctx = context;
//     this.loadAssetMap();
//     this.init();
//     window.requestAnimationFrame(() => this.tick(0));
//   }
//   loadAssetMap() {
//     const img = new Image();
//     img.src = tileMap;
//     this.tileAtlas = img;
//   }
//   init() {
//     keyboard.listenForEvents([keyboard.LEFT, keyboard.RIGHT, keyboard.UP, keyboard.DOWN]);
//   }
//   tick(elapsed: number) {
//     window.requestAnimationFrame(() => this.tick(elapsed));
//     this.ctx.clearRect(0, 0, 384, 256);
//     // let delta = (elapsed - this._previousElapsed) / 1000.0;
//     // delta = Math.min(delta, 0.25); // maximum delta of 250 ms
//     const delta = 0.01;
//     this._previousElapsed = elapsed;
//     this.update(delta);
//     this.render();
//     this.findPokemon();
//   }
//   findPokemon() {
//     const tileX = Math.floor(this.character.x / map.tsize);
//     const tileY = Math.floor(this.character.y / map.tsize);
//     if (tileX !== this.tileX || tileY !== this.tileY) {
//       this.tileX = tileX;
//       this.tileY = tileY;
//       const tile = map.getTile(0, this.tileX, this.tileY);
//       if (tile === 2 && Math.random() < 0.05) {
//         console.log('Pokemon found!');
//       }
//     }
//   }
//   update(delta: number) {
//     this.dirx = 0;
//     this.diry = 0;
//     if (keyboard.isDown(keyboard.LEFT)) { this.dirx = -1; }
//     else if (keyboard.isDown(keyboard.RIGHT)) { this.dirx = 1; }
//     else if (keyboard.isDown(keyboard.UP)) { this.diry = -1; }
//     else if (keyboard.isDown(keyboard.DOWN)) {this. diry = 1; }
//     this.character.move(delta, this.dirx, this.diry);
//     this.camera.update();
//   }
//   render() {
//     this._drawLayer(0);
//     this.direction = this.diry === 1 ? 0 : this.dirx === -1 ? 1 : this.diry === -1 ? 2 : this.dirx === 1 ? 3 : this.direction;
//     if (this.diry === 0 && this.dirx === 0) { this.animation = 0; }
//     const characterStart = this.direction * 84 + Math.floor(this.animation / 30) * 28;
//     this.animation = this.animation < 87 ? this.animation + 1 : 0;
//     this.ctx.drawImage(
//       this.character.image,
//       characterStart,
//       0,
//       28,
//       40,
//       this.character.screenX - this.character.width / 2,
//       this.character.screenY - this.character.height / 2,
//       28,
//       40
//     );
//     this._drawLayer(1);
//     this.ctx.drawImage(
//       this.character.image,
//       characterStart,
//       0,
//       28,
//       30,
//       this.character.screenX - this.character.width / 2,
//       this.character.screenY - this.character.height / 2,
//       28,
//       30
//     );
//   }
//   _drawLayer(layer: number) {
//     const startCol = Math.floor(this.camera.x / map.tsize);
//     const endCol = startCol + (this.camera.width / map.tsize);
//     const startRow = Math.floor(this.camera.y / map.tsize);
//     const endRow = startRow + (this.camera.height / map.tsize);
//     const offsetX = -this.camera.x + startCol * map.tsize;
//     const offsetY = -this.camera.y + startRow * map.tsize;
//     for (let c = startCol; c <= endCol; c++) {
//       for (let r = startRow; r <= endRow; r++) {
//         const tile = map.getTile(layer, c, r);
//         const x = (c - startCol) * map.tsize + offsetX;
//         const y = (r - startRow) * map.tsize + offsetY;
//         if (tile !== 0) {
//           this.ctx.drawImage(
//             this.tileAtlas,
//             (tile - 1) % 16 * map.tsize,
//             Math.floor((tile - 1) / 16) * map.tsize,
//             map.tsize,
//             map.tsize,
//             Math.round(x),
//             Math.round(y),
//             map.tsize,
//             map.tsize
//           );
//         }
//       }
//     }
//   }
// }
window.onload = function () {
    var context = document.getElementById('demo').getContext('2d');
    var game = new game_1.Game;
    game.run(context);
};
//# sourceMappingURL=main.old.js.map