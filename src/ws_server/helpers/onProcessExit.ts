import { logProcessTermination } from './loggers'

const terminateHandler = (signal: string | null, code: number | null, cb: () => void) => {
  cb()
  logProcessTermination(signal, code)
  process.exit()
}

export const onProcessExit = (cb: () => void) => {
  process.on('SIGINT', (s: string, c: number) => { terminateHandler(s, c, cb) })
  process.on('SIGHUP', (s: string, c: number) => { terminateHandler(s, c, cb) })
  process.on('SIGQUIT', (s: string, c: number) => { terminateHandler(s, c, cb) })
  process.on('SIGTERM', (s: string, c: number) => { terminateHandler(s, c, cb) })
  process.on('SIGKILL', (s: string, c: number) => { terminateHandler(s, c, cb) })
  process.on('uncaughtException', () => { terminateHandler(null, null, cb) })
  process.on('unhandledRejection', () => { terminateHandler(null, null, cb) })
}
