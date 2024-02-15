import WebSocket from 'ws'
import { HandlerData } from '../types'
import { logResponse } from '../helpers'

export const sendResponse = (clients: WebSocket[], handlerData: HandlerData, id = 0): void => {
  const { type, data } = handlerData
  clients.forEach(client => {
    if (client?.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type, data: JSON.stringify(data), id }))
      logResponse(type, data)
    }
  })
}
