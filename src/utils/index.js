export const sendSocketMessage = (ws, type, data) => {
  
    if (ws.readyState === ws.CLOSED) return;
    const message = JSON.stringify({type, data: JSON.stringify(data) || null, id: 0})
    ws.send(message)
  }

export const notifyClientsAboutRoomUpdates = (clients) => {
  clients.forEach(ws => {
    sendSocketMessage(ws, "update_room", [])
  })
}

export const notifyClientsAboutWinnersUpdates = (clients) => {
  clients.forEach(ws => {
    sendSocketMessage(ws, "update_winners", [])
  })
}
