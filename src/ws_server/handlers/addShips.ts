import { gamesDB, connectionsDB } from '../database'
import { ParsedRequestData, AddShipsRequestData } from '../types'

export const addShips = (data: ParsedRequestData) => {
  const { gameId, indexPlayer, ships } = data as unknown as AddShipsRequestData

  gamesDB.addPlayerShips(gameId, indexPlayer, ships)
  if (!gamesDB.canStartGame(gameId)) { return }

  gamesDB.getStartGameData(gameId)
    .forEach(({ type, data, connectionId }) => {
      connectionsDB.sendData({ type, data }, connectionId)
    })

  gamesDB.getTurnData(gameId)
    .forEach(({ type, data, connectionId }) => {
      connectionsDB.sendData({ type, data }, connectionId)
    })
}
