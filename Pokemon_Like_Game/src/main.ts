type MapType = {
  cols: number;
  rows: number;
  tsize: number;
  layers: Array<Array<number>>
  getTile: (layer: number, col: number, row: number) => number;
};

// type loader = {
//   images: object;
//   loadImage: (key: string, source: string) => HTMLImageElement
//   getImage: (key: string) => HTMLImageElement;
// }

const map: MapType = {
  cols: 12,
  rows: 12,
  tsize: 64,
  layers: [[
      3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
      3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3,
      3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3,
      3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3,
      3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3,
      3, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 3,
      3, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 3,
      3, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 3,
      3, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 3,
      3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 3,
      3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 3,
      3, 3, 3, 1, 1, 2, 3, 3, 3, 3, 3, 3
  ], [
      4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4,
      4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
      4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
      4, 0, 0, 5, 0, 0, 0, 0, 0, 5, 0, 4,
      4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
      4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
      4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
      4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
      4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
      4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
      4, 4, 4, 0, 5, 4, 4, 4, 4, 4, 4, 4,
      4, 4, 4, 0, 0, 3, 3, 3, 3, 3, 3, 3
  ]],

  getTile: function (layer: number, col: number, row: number) {
      return this.layers[layer][row * map.cols + col];
  }
}


class Camera {
  x: number;
  y: number;
  width: number;
  height: number;
  maxX: number;
  maxY: number;
  SPEED: number;

  constructor(map: MapType, width: number, height: number) {
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
    this.maxX = map.cols * map.tsize - width;
    this.maxY = map.rows * map.tsize - height;
    this.SPEED = 256;
  }

  move(delta: number, dirx: number, diry: number) {
    // move camera
    this.x += dirx * this.SPEED * delta;
    this.y += diry * this.SPEED * delta;

    // clamp values
    this.x = Math.max(0, Math.min(this.x, this.maxX));
    this.y = Math.max(0, Math.min(this.y, this.maxY));
  }
}

const Keyboard = {
  LEFT: 37,
  RIGHT: 39,
  UP: 38,
  DOWN: 40,
  _keys: {},

  listenForEvents: function(keys: Array<number>) {
    window.addEventListener('keydown', this._onKeyDown.bind(this));
    window.addEventListener('keyup', this._onKeyUp.bind(this));

    keys.forEach(function (key: number) {
        this._keys[key] = false;
    }.bind(this));
  },

  _onKeyDown: function(event: KeyboardEvent) {
    const keyCode = event.key;

    if (keyCode in this._keys) {
        event.preventDefault();
        this._keys[keyCode] = true;
    }
  },

  _onKeyUp: function(event: KeyboardEvent) {
    const keyCode = event.key;

    if (keyCode in this._keys) {
        event.preventDefault();
        this._keys[keyCode] = false;
    }
  },

  isDown: function(keyCode: number) {
    if (!(keyCode in this._keys)) {
      throw new Error('Keycode ' + keyCode + ' is not being listened to');
    }

    return this._keys[keyCode];
  }
};

class Game {
  ctx: CanvasRenderingContext2D;
  _previousElapsed: number;
  tileAtlas: HTMLImageElement;
  camera: Camera;

  constructor() {
    this._previousElapsed = 0;
    this.camera = new Camera(map, 512, 512);
  }

  run(context: CanvasRenderingContext2D) {
    this.ctx = context;

    this.loadAssetMap('tiles', 'assets/tiles.png');
    this.init();

    window.requestAnimationFrame(() => this.tick(0));
  }

  loadAssetMap(key: string, source: string) {
    const img = new Image();

    img.src = source;
    this.tileAtlas = img;
  }

  init() {
    Keyboard.listenForEvents([Keyboard.LEFT, Keyboard.RIGHT, Keyboard.UP, Keyboard.DOWN]);
  }

  tick(elapsed: number) {
    window.requestAnimationFrame(() => this.tick(elapsed));

    // clear previous frame
    this.ctx.clearRect(0, 0, 512, 512);

    let delta = (elapsed - this._previousElapsed) / 1000.0;
    delta = Math.min(delta, 0.25); // maximum delta of 250 ms
    this._previousElapsed = elapsed;

    this.update(delta);
    this.render();
  }

  update(delta: number) {
    let dirx = 0;
    let diry = 0;

    if (Keyboard.isDown(Keyboard.LEFT)) { dirx = -1; }
    if (Keyboard.isDown(Keyboard.RIGHT)) { dirx = 1; }
    if (Keyboard.isDown(Keyboard.UP)) { diry = -1; }
    if (Keyboard.isDown(Keyboard.DOWN)) { diry = 1; }

    this.camera.move(delta, dirx, diry);
  }

  render() {
    // draw map background layer
    this._drawLayer(0);
    // draw map top layer
    this._drawLayer(1);
  }

  _drawLayer(layer: number){
    const startCol = Math.floor(this.camera.x / map.tsize);
    const endCol = startCol + (this.camera.width / map.tsize);
    const startRow = Math.floor(this.camera.y / map.tsize);
    const endRow = startRow + (this.camera.height / map.tsize);
    const offsetX = -this.camera.x + startCol * map.tsize;
    const offsetY = -this.camera.y + startRow * map.tsize;

    for (let c = startCol; c <= endCol; c++) {
        for (let r = startRow; r <= endRow; r++) {
            const tile = map.getTile(layer, c, r);
            const x = (c - startCol) * map.tsize + offsetX;
            const y = (r - startRow) * map.tsize + offsetY;
            if (tile !== 0) { // 0 => empty tile
                this.ctx.drawImage(
                    this.tileAtlas, // image
                    (tile - 1) * map.tsize, // source x
                    0, // source y
                    map.tsize, // source width
                    map.tsize, // source height
                    Math.round(x),  // target x
                    Math.round(y), // target y
                    map.tsize, // target width
                    map.tsize // target height
                );
            }
        }
    }
  }
}

window.onload = function () {
  const context = (document.getElementById('demo') as HTMLCanvasElement).getContext('2d');

  const game = new Game;

  game.run(context);
};