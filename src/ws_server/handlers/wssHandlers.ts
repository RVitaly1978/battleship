import WebSocket from 'ws'
import { IncomingMessage } from 'node:http'
import { wsMessageHandler } from './wsMessageHandler'
import { cleanup } from './cleanup'
import { connectionsDB } from '../database'
import {
  parseRequestMsg, logWebSocketConnection,
  logWebsocketMessageHandlingError, logWebSocketClose, logWebSocketError,
  logWSServerError, logWSServerClose, logRequest,
} from '../helpers'

export const connectionHandler = (ws: WebSocket, request: IncomingMessage) => {
  logWebSocketConnection(request)

  const { id } = connectionsDB.addConnection(ws)

  ws.on('message', (message: string) => {
    try {
      const msg = parseRequestMsg(message)
      logRequest(msg)
      wsMessageHandler(msg, id, request)
    } catch (err) {
      logWebsocketMessageHandlingError(request)
      ws.close()
    }
  })

  ws.on('error', (error) => {
    logWebSocketError(request, error)
    ws.close()
  })

  ws.on('close', (code) => {
    cleanup(id, code)
    logWebSocketClose(request)
  })
}

export const errorHandler = (port: number, error: Error) => {
  logWSServerError(error, port)
}

export const closeHandler = (wss: WebSocket.Server, port: number) => {
  wss.clients.forEach(client => {
    if (client?.readyState === WebSocket.OPEN) {
      client.close()
    }
  })
  logWSServerClose(port)
}
