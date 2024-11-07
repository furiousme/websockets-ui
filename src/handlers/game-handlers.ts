import { games } from '../state';
import { FIXME } from '../types';
import {
  notifyPlayersAboutGameStarted,
  notifyPlayersAboutCurrentTurn,
  notifyPlayersAboutAttackFeedback,
  checkForHit,
} from '../utils';

export const addShipsHandler = (payload: FIXME) => {
  const data = JSON.parse(payload.data);
  const { gameId, indexPlayer, ships } = data;
  const game = games.get(gameId);
  if (!game) return;
  const updatedGame = {
    ...game,
    ships: { ...game.ships, [indexPlayer]: ships },
    turn: indexPlayer,
  };
  games.set(gameId, updatedGame);

  if (Object.values(updatedGame.ships).length === 2) {
    updatedGame.started = true;
    games.set(gameId, updatedGame);
    notifyPlayersAboutGameStarted(updatedGame);
    notifyPlayersAboutCurrentTurn(updatedGame);
  }
};

export const attackHandler = (payload: FIXME) => {
  const data = JSON.parse(payload.data);
  const { gameId, indexPlayer, x, y } = data;
  const game = games.get(gameId);
  if (!game || indexPlayer !== game.turn) return;

  const enemyPlayerId = Object.keys(game.ships).find((key) => key !== indexPlayer);
  if (!enemyPlayerId) return;

  const position = { x, y };
  const hit = checkForHit(game.ships[enemyPlayerId], position);

  if (hit) {
    console.log('HIT');
    notifyPlayersAboutAttackFeedback(game, indexPlayer, 'shot', position);
    notifyPlayersAboutCurrentTurn({ ...game, turn: game.turn });
    return;
  }

  const updatedGame = { ...game, turn: enemyPlayerId };
  games.set(gameId, updatedGame);
  notifyPlayersAboutAttackFeedback(game, indexPlayer, 'miss', position);
  notifyPlayersAboutCurrentTurn(updatedGame);
};
