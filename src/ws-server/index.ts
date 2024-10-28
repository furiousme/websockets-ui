import { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { sendSocketMessage } from '../utils';
import { clients } from '../state';
import { registerPlayerHandler } from '../handlers/registration-handlers';
import { createRoomHandler, addUserToRoomHandler } from '../handlers/room-handlers';
import { addShipsHandler } from '../handlers/game-handlers';
import { Command } from '../types';

export const startWSserver = (port: string | number) => {
  const ws = new WebSocketServer({ port: Number(port) });

  ws.on('connection', (ws) => {
    const socketId = uuidv4();
    clients.set(socketId, ws);

    ws.on('close', () => {
      clients.delete(socketId);
    });

    ws.on('message', async (payload: string) => {
      const parsedPayload = JSON.parse(payload);
      const { type } = parsedPayload;

      console.log('[message from client]', {
        socketId,
        type,
        data: parsedPayload.data,
      });

      switch (type) {
        case 'reg': {
          registerPlayerHandler(ws, socketId, parsedPayload);
          break;
        }
        case 'create_room': {
          createRoomHandler(socketId);
          break;
        }
        case 'add_user_to_room': {
          addUserToRoomHandler(socketId, parsedPayload);
          break;
        }
        case 'add_ships': {
          addShipsHandler(parsedPayload);
          break;
        }
        default: {
          sendSocketMessage(ws, Command.ERROR, {
            error: true,
            errorText: 'Unknown command',
          });
        }
      }
    });
  });

  console.log('Connection was established successfully');

  ws.on('error', console.error);
};
