import { WebSocketServer } from 'ws'
import { socketHandler } from './handler'
import { getWSPortFromEnv, logWSServerStartedOnPort } from './helpers'

export const startWSS = () => {
  const wsPort = getWSPortFromEnv()

  const wss = new WebSocketServer(
    { port: wsPort, clientTracking: true },
    () => { logWSServerStartedOnPort(wsPort) },
  )

  wss.on('connection', socketHandler)

  return wss
}
