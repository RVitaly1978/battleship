import { WebSocketServer } from 'ws'
import { connectionHandler, errorHandler, closeHandler } from './handlers/wssHandlers'
import { getWSServerPortFromEnv, logWSServerStartedOnPort } from './helpers'

export const startWSS = () => {
  const wssPort = getWSServerPortFromEnv()

  const wss = new WebSocketServer(
    { port: wssPort, clientTracking: true },
    () => { logWSServerStartedOnPort(wssPort) },
  )

  wss.on('connection', (ws, request) => {
    connectionHandler(ws, request)
  })

  wss.on('error', (error) => {
    errorHandler(wssPort, error)
  })

  wss.on('close', () => {
    closeHandler(wss, wssPort)
  })

  return wss
}
