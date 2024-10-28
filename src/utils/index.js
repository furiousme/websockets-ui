import { clients, rooms, players } from "../state/index.js";

export const sendSocketMessage = (ws, type, data) => {
    if (ws.readyState === ws.CLOSED) return;
    const message = JSON.stringify({type, data: JSON.stringify(data) || null, id: 0})
    ws.send(message)
  }

export const  notifyClientsAboutRoomUpdates = () => {
  clients.forEach(ws => {
    sendSocketMessage(ws, "update_room", prepareAvailableRooms(rooms))
  })
}

export const notifyClientsAboutWinnersUpdates = (recipients, winners) => {
  recipients.forEach(ws => {
    sendSocketMessage(ws, "update_winners", [])
  })
}

export const prepareAvailableRooms = (rooms) => {
  return Array.from(rooms.entries()).reduce((acc, [key, value]) => {
    if (value.available) acc.push({
      roomId: key,
      roomUsers: value.roomUsers,
    })
    return acc;
  }, [])
}