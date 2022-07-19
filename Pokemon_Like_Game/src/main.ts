import { Game } from './lib/game'

window.onload = function () {
  const context = (document.getElementById('demo') as HTMLCanvasElement).getContext('2d');
  const game = new Game;

  game.run(context);
};