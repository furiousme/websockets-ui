// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FIXME = any;

export type RoomUser = {
  socketId: string;
  idPlayer: string;
  index: number;
  name: string;
};

export enum Command {
  REG = 'reg',
  CREATE_ROOM = 'create_room',
  ADD_USER_TO_ROOM = 'add_user_to_room',
  UPDATE_ROOM = 'update_room',
  CREATE_GAME = 'create_game',
  START_GAME = 'start_game',
  TURN = 'turn',
  UPDATE_WINNERS = 'update_winners',
  ERROR = 'error',
}

export type Room = {
  roomId: string;
  roomUsers: RoomUser[];
  available: boolean;
};

export type Player = {
  socketId: string;
  name: string;
  password: string;
};

export type Game = {
  gameId: string;
  gameUsers: GameUser[];
  started: boolean;
  turn: number;
  ships: {
    [key: string]: [];
  };
};

export type Client = FIXME;

export type Ship = {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: ShipSize;
};

export type ShipSize = 'small' | 'medium' | 'large' | 'huge';

export type GameUser = {
  socketId: string;
  idPlayer: string;
  index: number;
  name: string;
};

export type RoomsForClient = {
  roomId: string;
  roomUsers: RoomUser[];
}[];
