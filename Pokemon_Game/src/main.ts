import { Game } from './components/game'

window.onload = function () {
  const gameCanvas = (document.getElementById('mainGameCanvas') as HTMLCanvasElement);
  const gameContext = gameCanvas.getContext('2d');

  const overlayCanvas = (document.getElementById('overlayCanvas') as HTMLCanvasElement);
  const overlayContext = overlayCanvas.getContext('2d');

  if (gameContext && overlayContext) {
    new Game(gameContext, overlayContext);

    gameCanvas.height = Game.GAME_HEIGHT;
    gameCanvas.width = Game.GAME_WIDTH;
    overlayCanvas.height = Game.GAME_HEIGHT;
    overlayCanvas.width = Game.GAME_WIDTH;
  }
};