export enum MsgType {
  Reg = 'reg',
  CreateGame = 'create_game',
  CreateRoom = 'create_room',
  UpdateRoom = 'update_room',
  AddUserToRoom = 'add_user_to_room',
  AddShips = 'add_ships',
  Attack = 'attack',
  RandomAttack = 'randomAttack',
  SinglePlay = 'single_play',
  StartGame = 'start_game',
  Turn = 'turn',
  Finish = 'finish',
  UpdateWinners = 'update_winners',
}

export enum ShipType {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
  Huge = 'huge',
}

export enum AttackStatus {
  Miss = 'miss',
  Killed = 'killed',
  Shot = 'shot',
}

export enum PlayerType {
  Player = 'player',
  Bot = 'bot',
}

export enum ResponseDataMessage {
  InvalidCredentials = 'Invalid name or password',
  InvalidPassword = 'Invalid password',
  PlayerExists = 'Player already exists',
}
