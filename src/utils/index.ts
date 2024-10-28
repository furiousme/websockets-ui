import { clients, rooms } from '../state';
import { AttackStatus, Command, FIXME, Game, RoomsForClient, Ship } from '../types';

export const sendSocketMessage = (ws: FIXME, type: Command, data: unknown) => {
  if (ws.readyState === ws.CLOSED) return;
  const message = JSON.stringify({
    type,
    data: JSON.stringify(data) || null,
    id: 0,
  });
  ws.send(message);
};

export const notifyClientsAboutRoomUpdates = () => {
  clients.forEach((ws) => {
    sendSocketMessage(ws, Command.UPDATE_ROOM, prepareAvailableRooms());
  });
};

export const notifyClientsAboutWinnersUpdates = (recipients: FIXME[]) => {
  recipients.forEach((ws) => {
    sendSocketMessage(ws, Command.UPDATE_WINNERS, []);
  });
};

export const notifyPlayersAboutGameCreated = (game: Game) => {
  game.gameUsers.forEach((user) => {
    const client = clients.get(user.socketId);
    const gameData = {
      idGame: game.gameId,
      idPlayer: user.idPlayer,
    };

    console.log(user.socketId, gameData);
    sendSocketMessage(client, Command.CREATE_GAME, gameData);
  });
};

export const notifyPlayersAboutGameStarted = (game: Game) => {
  game.gameUsers.forEach((user) => {
    const client = clients.get(user.socketId);
    const gameData = {
      idGame: game.gameId,
      ships: game.ships[user.idPlayer],
    };

    sendSocketMessage(client, Command.START_GAME, gameData);
  });
};

export const notifyPlayersAboutAttackFeedback = (
  game: Game,
  currentPlayer: string,
  status: AttackStatus,
  position: { x: number; y: number }
) => {
  game.gameUsers.forEach((user) => {
    const client = clients.get(user.socketId);
    const gameData = {
      currentPlayer,
      status,
      position,
    };

    sendSocketMessage(client, Command.ATTACK, gameData);
  });
};

export const notifyPlayersAboutCurrentTurn = (game: Game) => {
  game.gameUsers.forEach((user) => {
    const client = clients.get(user.socketId);
    const gameData = {
      currentPlayer: game.turn,
    };

    sendSocketMessage(client, Command.TURN, gameData);
  });
};

export const prepareAvailableRooms = (): RoomsForClient => {
  return Array.from(rooms.entries()).reduce((acc, [key, value]) => {
    if (value.available)
      acc.push({
        roomId: key,
        roomUsers: value.roomUsers,
      });
    return acc;
  }, [] as RoomsForClient);
};

export const checkForHit = (ships: Ship[], position: { x: number; y: number }) => {
  return ships.some((ship) => {
    const { direction, length } = ship;
    if (!direction) {
      return (
        position.x === ship.position.x &&
        position.y >= ship.position.y &&
        position.y < ship.position.y + length
      );
    } else {
      return (
        position.y === ship.position.y &&
        position.x >= ship.position.x &&
        position.x < ship.position.x + length
      );
    }
  });
};
