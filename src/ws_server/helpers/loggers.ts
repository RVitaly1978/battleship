import { IncomingMessage } from 'node:http'
import { MsgType, ResponseData, Message } from '../types'

const ansiCodes = {
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  table240: '\x1b[38;5;240m',
  table245: '\x1b[38;5;245m',
  end: '\x1b[0m',
}

export const green = (str: string | number | undefined | null) =>
  `${ansiCodes.green}${str}${ansiCodes.end}`
export const blue = (str: string | number | undefined | null) =>
  `${ansiCodes.blue}${str}${ansiCodes.end}`
export const yellow = (str: string | number | undefined | null) =>
  `${ansiCodes.yellow}${str}${ansiCodes.end}`
export const red = (str: string | number | undefined | null) =>
  `${ansiCodes.red}${str}${ansiCodes.end}`
export const table245 = (str: string | number | undefined | null) =>
  `${ansiCodes.table245}${str}${ansiCodes.end}`
export const table240 = (str: string | number | undefined | null) =>
  `${ansiCodes.table240}${str}${ansiCodes.end}`

export const logProcessTermination = (signal: string | null, code: number | null) => {
  const reason = signal || code ? `[${red(signal)}][${red(code)}]` : `[${red('ERROR')}]`
  console.log(`${reason} Close HttpServer, WebSocket Server and socket connections.`)
}

export const logHttpServerStartedOnPort = (port: number) => {
  console.log(`${blue('[HTTP SERVER]')} Started on port ${blue(port)}.`)
}

export const logWSServerStartedOnPort = (port: number) => {
  console.log(`${yellow('[WS SERVER]')} Started on port ${yellow(port)}.`)
}

export const logWSServerClose = (port: number) => {
  console.log(`${yellow('[WS SERVER]')} Close on port ${port}.`)
}

export const logWSServerError = (error: Error, port: number) => {
  console.log(`[${red('WS SERVER')}][${red('ERROR')}] Server error on port ${port}. Error message: ${error.message}.`)
}

export const logWebSocketConnection = (request: IncomingMessage) => {
  console.log(`${green('[WS]')} Socket connection open. Origin: ${green(request.headers.origin)}.`)
}

export const logWebSocketClose = (request: IncomingMessage) => {
  console.log(`${green('[WS]')} Socket connection close. Origin: ${request.headers.origin}.`)
}

export const logWebsocketMessageHandlingError = (request: IncomingMessage) => {
  console.log(`[${red('WS')}][${red('ERROR')}] Internal Socket error. Origin: ${request.headers.origin}.`)
}

export const logWebSocketError = (request: IncomingMessage, error: Error) => {
  console.log(`[${red('WS')}][${red('ERROR')}] Socket error. Origin: ${request.headers.origin}. Error message: ${error.message}.`)
}

export const logUnknownMessageType = (type: string, request: IncomingMessage) => {
  console.log(`[${red('WS')}][${red('ERROR')}] Socket error. Origin ${request.headers.origin}. Error message: unknown message type ${red(type)}.`)
}

export const logRequest = (msg: Message) => {
  console.log(table240(`[<-]:[${msg.type}]: ${JSON.stringify(msg.data)}`))
}

export const logResponse = (type: MsgType, data: ResponseData) => {
  console.log(table245(`[->]:[${type}]: ${JSON.stringify(data)}`))
}
