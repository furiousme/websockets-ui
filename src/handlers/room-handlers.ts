import { games, players, rooms } from '../state';
import { FIXME, RoomUser } from '../types';
import { notifyClientsAboutRoomUpdates, notifyPlayersAboutGameCreated } from '../utils/index';
import { v4 as uuidv4 } from 'uuid';

export const createRoomHandler = (socketId: string) => {
  const player = players.get(socketId);
  if (!player) return;

  rooms.set(socketId, {
    roomId: uuidv4(),
    roomUsers: [{ name: player.name, index: 0, socketId, idPlayer: uuidv4() }],
    available: true,
  });
  notifyClientsAboutRoomUpdates();
};

export const addUserToRoomHandler = (socketId: string, payload: FIXME) => {
  const parsedData = JSON.parse(payload.data);
  const { indexRoom } = parsedData;
  const player = players.get(socketId);
  const room = rooms.get(indexRoom);
  if (!player || !room) return;

  const alreadyInRoom = room.roomUsers.some((user: RoomUser) => user.socketId === socketId);

  if (!alreadyInRoom) {
    room.roomUsers.push({ name: player.name, index: 1, socketId, idPlayer: uuidv4() });
    room.available = false;
    rooms.set(indexRoom, room);

    notifyClientsAboutRoomUpdates();
    const newGameId = uuidv4();
    const newGame = {
      gameId: newGameId,
      started: false,
      ships: {},
      turn: '',
      gameUsers: room.roomUsers.map((user: RoomUser) => {
        return {
          socketId: user.socketId,
          index: user.index,
          name: user.name,
          idPlayer: user.idPlayer,
        };
      }),
    };
    games.set(newGameId, newGame);
    notifyPlayersAboutGameCreated(newGame);
  }
};
