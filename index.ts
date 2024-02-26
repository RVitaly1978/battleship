import WebSocket from 'ws'
import { startHttpServer } from './src/http_server'
import { startWSS } from './src/ws_server'
import { onProcessExit } from './src/ws_server/helpers'

const httpServer = startHttpServer()

const wsServer = startWSS()

onProcessExit(() => {
  wsServer.clients.forEach(client => {
    if (client?.readyState === WebSocket.OPEN) {
      client.close()
    }
  })
  wsServer.close()
  httpServer.close()
})
