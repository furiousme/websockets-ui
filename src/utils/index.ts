import { clients, rooms } from '../state';
import { Command, FIXME, Game, RoomsForClient } from '../types';

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

export const notifyPlayersAboutCurrentTurn = (game: Game) => {
  game.gameUsers.forEach((user) => {
    const client = clients.get(user.socketId);
    const gameData = {
      currentPlayer: game.gameUsers.find((user) => user.index === game.turn)?.idPlayer,
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
