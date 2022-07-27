import { Game } from './components/game'

window.onload = function () {
  const gameCanvas = (document.getElementById('mainGameCanvas') as HTMLCanvasElement);
  const gameContext = gameCanvas.getContext('2d');

  const overlayCanvas = (document.getElementById('overlayCanvas') as HTMLCanvasElement);
  const overlayContext = overlayCanvas.getContext('2d');

  if (gameContext && overlayContext) {
    const game = new Game(gameContext, overlayContext);

    gameCanvas.height = game.GAME_HEIGHT;
    gameCanvas.width = game.GAME_WIDTH;
    overlayCanvas.height = game.GAME_HEIGHT;
    overlayCanvas.width = game.GAME_WIDTH;
  }
};