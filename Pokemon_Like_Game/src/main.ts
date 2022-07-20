import { Game } from './lib/game'

window.onload = function () {
  const canvas = (document.getElementById('demo') as HTMLCanvasElement);
  const context = canvas.getContext('2d');

  if (context) {
    const game = new Game(context);

    // game.run(context);

    canvas.height = game.GAME_HEIGHT;
    canvas.width = game.GAME_WIDTH;
  }
};