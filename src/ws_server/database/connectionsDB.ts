import WebSocket from 'ws'
import { randomUUID } from 'node:crypto'
import { Connection, EntityId, Player, HandlerData } from '../types'
import { sendResponse } from '../helpers'

export class Connections {
  private connections: Connection[]

  constructor () {
    this.connections = []
  }

  addConnection (ws: WebSocket) {
    const connection: Connection = { ws, id: randomUUID() }
    this.connections.push(connection)
    return connection
  }

  removeConnection (connectionId: EntityId) {
    const index = this.connections.findIndex(({ id }) => id === connectionId)
    this.connections.splice(index, 1)
  }

  addConnectionPlayer (id: EntityId, player: Player) {
    const connection = this.getConnection(id)
    if (connection) {
      connection.player = player
      return true
    }
    return false
  }

  getConnections () {
    return this.connections
  }

  getConnection (id: EntityId) {
    return this.connections.find((connection) => connection.id === id)
  }

  getConnectionByPlayerName (name: string) {
    return this.connections.find(({ player }) => player?.name === name)
  }

  sendData (data: HandlerData, connectionId?: EntityId) {
    const client = connectionId ? this.getConnection(connectionId) : null
    const clients = connectionId
      ? (client ? [client.ws] : [])
      : this.getConnections().map(({ ws }) => ws)
    sendResponse(clients, data)
  }
}

export const connectionsDB = new Connections()
