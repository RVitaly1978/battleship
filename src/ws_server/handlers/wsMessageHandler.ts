import { IncomingMessage } from 'node:http'
import { reg } from './reg'
import { createRoom } from './createRoom'
import { addUserToRoom } from './addUserToRoom'
import { addShips } from './addShips'
import { attack } from './attack'
import { randomAttack } from './randomAttack'
import { singlePlay } from './singlePlay'
import { logUnknownMessageType } from '../helpers'
import { MsgType, Message, EntityId } from '../types'

export const wsMessageHandler = (
  { type, data }: Message,
  connectionId: EntityId,
  request: IncomingMessage,
) => {
  switch (type) {
    case MsgType.Reg: return reg(data, connectionId)
    case MsgType.CreateRoom: return createRoom(connectionId)
    case MsgType.AddUserToRoom: return addUserToRoom(data, connectionId)
    case MsgType.AddShips: return addShips(data)
    case MsgType.Attack: return attack(data)
    case MsgType.RandomAttack: return randomAttack(data)
    case MsgType.SinglePlay: return singlePlay(connectionId)
    default: return logUnknownMessageType(type, request)
  }
}
