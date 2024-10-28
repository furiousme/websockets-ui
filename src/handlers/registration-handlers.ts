import { clients, players } from '../state';
import { Command, FIXME } from '../types';
import {
  notifyClientsAboutRoomUpdates,
  notifyClientsAboutWinnersUpdates,
  sendSocketMessage,
} from '../utils';

export const registerPlayerHandler = (ws: FIXME, socketId: string, payload: FIXME) => {
  const parsedData = JSON.parse(payload.data);
  const { name, password } = parsedData;
  const client = clients.get(socketId);

  players.set(socketId, { name, password, socketId });
  const responseData = {
    name,
    index: socketId,
    error: false,
    errorText: '',
  };
  sendSocketMessage(ws, Command.REG, responseData);
  notifyClientsAboutRoomUpdates();
  notifyClientsAboutWinnersUpdates([client]);
};
