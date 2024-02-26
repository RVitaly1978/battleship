import dotenv from 'dotenv'

dotenv.config()

export const getHttpServerPortFromEnv = () => {
  return parseInt(process.env.HTTP_PORT!, 10) || 8181
}

export const getWSServerPortFromEnv = () => {
  return parseInt(process.env.WS_PORT!, 10) || 3000
}
