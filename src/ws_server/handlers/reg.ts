import { playersDB, roomsDB, connectionsDB } from '../database'
import { ParsedRequestData, RegRequestData, EntityId, ResponseDataMessage } from '../types'

export const reg = (data: ParsedRequestData, connectionId: EntityId) => {
  const { name, password } = data as unknown as RegRequestData

  if (!playersDB.validateCredentials(name, password)) {
    connectionsDB.sendData(
      playersDB.getInvalidPlayerData(name, ResponseDataMessage.InvalidCredentials),
      connectionId
    )
    return
  }

  if (connectionsDB.getConnectionByPlayerName(name)) {
    connectionsDB.sendData(
      playersDB.getInvalidPlayerData(name, ResponseDataMessage.PlayerExists),
      connectionId
    )
    return
  }

  const player = playersDB.usePlayer(name, password, connectionId)

  if (!player.error) {
    connectionsDB.addConnectionPlayer(connectionId, player)
  }

  connectionsDB.sendData(
    playersDB.getPlayerData(player),
    player.connectionId,
  )

  connectionsDB.sendData(
    roomsDB.getUpdateRoomData()
  )

  connectionsDB.sendData(
    playersDB.getWinners()
  )
}
