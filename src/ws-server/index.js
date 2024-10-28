import { WebSocketServer } from 'ws';
import {v4 as uuidv4} from 'uuid'
import {sendSocketMessage, notifyClientsAboutRoomUpdates, notifyClientsAboutWinnersUpdates, notifyPlayersAboutGameCreated} from "../utils/index.js";
import {clients, players, rooms, games } from "../state/index.js";

export const startWSserver = (port) => {
    const ws = new WebSocketServer({ port });

    ws.on('connection', (ws) => {
        const socketId = uuidv4()
        clients.set(socketId, ws)
    
        ws.on('close', () => {
          clients.delete(socketId)
        })
        
        ws.on('message', async (payload) => {
            const parsedPayload = JSON.parse(payload)
            const {type} = parsedPayload;

            console.log('[message from client]', {socketId, type, data: parsedPayload.data})
      
            switch (type) {
              case "reg": {      
                const parsedData = JSON.parse(parsedPayload.data)
                const {name, password} = parsedData;
                const client = clients.get(socketId)

                players.set(socketId, {name, password })
                const responseData = {
                    name,
                    index: socketId,
                    error: false,
                    errorText: "",
                }
                sendSocketMessage(ws, "reg", responseData)
                notifyClientsAboutRoomUpdates()
                notifyClientsAboutWinnersUpdates([client])
                break;
              }
              case "create_room": {
                const player = players.get(socketId)
                rooms.set(socketId, {id: socketId, roomUsers: [{ name: player.name, index: 0, socketId }], available: true})
                notifyClientsAboutRoomUpdates()
                break;
              }
              case "add_user_to_room": {
                const parsedData = JSON.parse(parsedPayload.data)
                const {indexRoom} = parsedData;
                const player = players.get(socketId)
                const room = rooms.get(indexRoom)
                if (!room.roomUsers.some((user) => user.socketId === socketId)) {
                  room.roomUsers.push({ name: player.name, index: 1, socketId })
                  room.available = false;
                  rooms.set(indexRoom, room)
                }
                notifyClientsAboutRoomUpdates()
                const newGameId = uuidv4()
                const newGame = {
                  gameId: newGameId,
                  gameUsers: room.roomUsers.map((user) => {
                    return {
                      socketId: user.socketId,
                      idPlayer: uuidv4(),
                      index: user.index,
                      name: user.name
                    }
                  }),
                } 
                games.set(newGameId, newGame)
                notifyPlayersAboutGameCreated(newGame)
                break;
              }
              default: {
                sendSocketMessage(ws, "error", {error: true, errorText: "Unknown command"})
              }
            }

          })
        })
      
        console.log('Connection was established successfully')

        ws.on('error', console.error);
}
