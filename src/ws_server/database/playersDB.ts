import { randomUUID } from 'node:crypto'
import { MsgType, PlayerType, Player, EntityId, HandlerData, ResponseDataMessage } from '../types'

export class Players {
  private players: Player[]

  constructor () {
    this.players = []
  }

  createPlayer (type: PlayerType, connectionId: EntityId, name?: string, password?: string): Player {
    return {
      connectionId,
      index: randomUUID(),
      name: name || '',
      password: password || '',
      error: false,
      errorText: '',
      wins: 0,
      type,
    }
  }

  terminateConnection (connectionId: EntityId) {
    const player = this.players.find(player => player.connectionId === connectionId)
    if (player) {
      player.connectionId = undefined
    }
  }

  validateCredentials (name: string, password: string) {
    return Boolean(
      name && typeof name === 'string' &&
      password && typeof password === 'string'
    )
  }

  usePlayer (name: string, password: string, connectionId: EntityId): Player {
    const player = this.players.find(player => player.name === name)
    return player
      ? this.logInPlayer(player, password, connectionId)
      : this.registerPlayer(name, password, connectionId)
  }

  registerPlayer (name: string, password: string, connectionId: EntityId): Player {
    const player = this.createPlayer(PlayerType.Player, connectionId, name, password)
    this.players.push(player)
    return player
  }

  logInPlayer (player: Player, password: string, connectionId: EntityId): Player {
    if (player.password === password) {
      player.error = false
      player.errorText = ''
      player.connectionId = connectionId
    } else {
      player.error = true
      player.errorText = ResponseDataMessage.InvalidPassword
    }
    return player
  }

  setPlayerWin (index: EntityId) {
    const player = this.players.find(player => player.index === index)
    if (player) {
      player.wins += 1
    }
  }

  getPlayerData (player: Player): HandlerData {
    const { index, name, error, errorText } = player
    return {
      type: MsgType.Reg,
      data: { index, name, error, errorText }
    }
  }

  getWinners (): HandlerData {
    return {
      type: MsgType.UpdateWinners,
      data: this.players
        .filter(({ wins }) => wins > 0)
        .sort((a, b) => b.wins - a.wins)
        .slice(0, 10)
        .map(({ name, wins }) => ({ name, wins }))
    }
  }

  getInvalidPlayerData (name: string, reason: ResponseDataMessage): HandlerData {
    return {
      type: MsgType.Reg,
      data: { name, index: -1, error: true, errorText: reason },
    }
  }
}

export const playersDB = new Players()
