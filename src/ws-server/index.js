import { WebSocketServer } from 'ws';
import {v4 as uuidv4} from 'uuid'
import {sendSocketMessage, notifyClientsAboutRoomUpdates, notifyClientsAboutWinnersUpdates} from "../utils/index.js";

const clients = new Map() 
const players = new Map()


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
                players.set(socketId, {name, password})
                const responseData = {
                    name,
                    index: socketId,
                    error: false,
                    errorText: "",
                }
                sendSocketMessage(ws, "reg", responseData)
                notifyClientsAboutRoomUpdates(clients)
                notifyClientsAboutWinnersUpdates(clients)
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
