export const clients = new Map(); // { key: socketId, value: socket }
export const players = new Map(); // { key: socketId, value: { name, password }}
export const rooms = new Map(); // { key: roomId, value: { roomUsers: [], available: boolean } }
export const games = new Map(); // { key: gameId, value: { gameId, gameUsers: [] }}
