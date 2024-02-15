import { startHttpServer } from './src/http_server'
import { startWSS } from './src/ws_server'
import { onProcessExit } from './src/ws_server/helpers'

const httpServer = startHttpServer()

const wsServer = startWSS()

onProcessExit(() => {
  wsServer.clients.forEach(client => { client.close() })
  wsServer.close()
  httpServer.close()
})
