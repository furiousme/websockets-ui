import { games, players, rooms } from '../state';
import { FIXME, RoomUser } from '../types';
import { notifyClientsAboutRoomUpdates, notifyPlayersAboutGameCreated } from '../utils/index';
import { v4 as uuidv4 } from 'uuid';

export const createRoomHandler = (socketId: string) => {
  const player = players.get(socketId);
  rooms.set(socketId, {
    id: socketId,
    roomUsers: [{ name: player.name, index: 0, socketId }],
    available: true,
  });
  notifyClientsAboutRoomUpdates();
};

export const addUserToRoomHandler = (socketId: string, payload: FIXME) => {
  const parsedData = JSON.parse(payload.data);
  const { indexRoom } = parsedData;
  const player = players.get(socketId);
  const room = rooms.get(indexRoom);
  if (!room.roomUsers.some((user: RoomUser) => user.socketId === socketId)) {
    room.roomUsers.push({ name: player.name, index: 1, socketId });
    room.available = false;
    rooms.set(indexRoom, room);
  }
  notifyClientsAboutRoomUpdates();
  const newGameId = uuidv4();
  const newGame = {
    gameId: newGameId,
    gameUsers: room.roomUsers.map((user: RoomUser) => {
      return {
        socketId: user.socketId,
        idPlayer: uuidv4(),
        index: user.index,
        name: user.name,
      };
    }),
  };
  games.set(newGameId, newGame);
  notifyPlayersAboutGameCreated(newGame);
};
