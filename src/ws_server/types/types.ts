import WebSocket from 'ws'
import { MsgType, ShipType, AttackStatus, PlayerType } from './enums'

export type UuId = `${string}-${string}-${string}-${string}-${string}`
export type EntityId = number | UuId

export type Player = {
  connectionId?: EntityId
  index: EntityId
  name: string
  password: string
  error: boolean
  errorText: string
  wins: number
  type: PlayerType
}

export type Connection = {
  id: EntityId,
  ws: WebSocket,
  player?: Player,
}

export type Room = {
  roomId: EntityId
  roomUsers: Player[]
  gameId?: EntityId
}

export type Position = {
  x: number
  y: number
}

export type Ship = {
  position: Position
  direction: boolean
  length: number
  type: ShipType
}

export type GamePlayer = {
  player: Player
  connectionId: EntityId
  index: EntityId
  ships: Ship[]
  hits: Position[]
}

export type Game = {
  players: GamePlayer[]
  gameId: EntityId
  roomId: EntityId
  currentPlayerId: EntityId | null
}

// request
export type RegRequestData = Pick<Player, 'name' | 'password'>
export type AddUserToRoomRequestData = { indexRoom: EntityId }
export type AddShipsRequestData = { gameId: EntityId, indexPlayer: EntityId, ships: Ship[] }
export type AttackRequestData = { gameId: EntityId, indexPlayer: EntityId, x: number, y: number }
export type RandomAttackRequestData = { gameId: EntityId, indexPlayer: EntityId }

export type ParsedRequestData =
  RegRequestData |
  AddUserToRoomRequestData |
  AddShipsRequestData |
  AttackRequestData |
  RandomAttackRequestData

export type Message = {
  type: MsgType
  data: ParsedRequestData
  id: number
}

// response
export type RegResponseData = Pick<Player, 'index' | 'name' | 'error' | 'errorText'>
export type UpdateRoomResponseData = Pick<Room, 'roomId' | 'roomUsers'>[]
export type UpdateWinnersResponseData = Pick<Player, 'name' | 'wins'>[]
export type CreateGameResponseData = { idGame: EntityId, idPlayer: EntityId }
export type StartGameResponseData = { currentPlayerIndex: EntityId, ships: Ship[] }
export type TurnResponseData = { currentPlayer: EntityId }
export type AttackResponseData = { position: Position, currentPlayer: EntityId, status: AttackStatus }
export type FinishGameResponseData = { winPlayer: EntityId }

export type ResponseData =
  RegResponseData |
  UpdateRoomResponseData |
  UpdateWinnersResponseData |
  CreateGameResponseData |
  StartGameResponseData |
  TurnResponseData |
  AttackResponseData |
  FinishGameResponseData

export type HandlerData = {
  type: MsgType
  data: ResponseData
}
