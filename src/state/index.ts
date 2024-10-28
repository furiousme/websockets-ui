import { Client, Game, Player, Room } from '../types';

export const clients = new Map<string, Client>(); // { key: socketId, value: socket }
export const players = new Map<string, Player>(); // { key: socketId, value: Player }
export const rooms = new Map<string, Room>(); // { key: roomId, value: Room }
export const games = new Map<string, Game>(); // { key: gameId, value: Game }
