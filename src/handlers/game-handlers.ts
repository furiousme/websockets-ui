import { games } from '../state';
import { FIXME } from '../types';
import { notifyPlayersAboutGameStarted, notifyPlayersAboutCurrentTurn } from '../utils';

export const addShipsHandler = (payload: FIXME) => {
  const data = JSON.parse(payload.data);
  const { gameId, indexPlayer, ships } = data;
  const game = games.get(gameId);
  if (!game) return;
  const updatedGame = { ...game, ships: { ...game.ships, [indexPlayer]: ships } };
  games.set(gameId, updatedGame);

  if (Object.values(updatedGame.ships).length === 2) {
    updatedGame.started = true;
    games.set(gameId, updatedGame);
    notifyPlayersAboutGameStarted(updatedGame);
    notifyPlayersAboutCurrentTurn(updatedGame);
  }
};
