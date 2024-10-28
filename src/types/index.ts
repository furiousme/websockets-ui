// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FIXME = any;

export type RoomUser = {
  socketId: string;
  index: number;
  name: string;
};

export enum Command {
  REG = 'reg',
  CREATE_ROOM = 'create_room',
  ADD_USER_TO_ROOM = 'add_user_to_room',
  UPDATE_ROOM = 'update_room',
  CREATE_GAME = 'create_game',
  UPDATE_WINNERS = 'update_winners',
  ERROR = 'error',
}

export type Game = {
  gameId: string;
  gameUsers: GameUser[];
};

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
