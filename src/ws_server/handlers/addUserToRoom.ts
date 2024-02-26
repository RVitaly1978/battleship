import { roomsDB, connectionsDB, gamesDB } from '../database'
import { ParsedRequestData, EntityId, AddUserToRoomRequestData } from '../types'

export const addUserToRoom = (data: ParsedRequestData, connectionId: EntityId) => {
  const { indexRoom } = data as unknown as AddUserToRoomRequestData

  const player = connectionsDB.getConnection(connectionId)?.player
  if (!player) { return }

  const room = roomsDB.addRoomUser(indexRoom, player)
  if (!room) { return }
  if (room.roomUsers.length < 2) { return }

  const game = gamesDB.createGame(room.roomId)

  gamesDB.setGamePlayers(game.gameId, room.roomUsers)
  roomsDB.closeRoomsWithPlayer(player)

  connectionsDB.sendData(
    roomsDB.getUpdateRoomData()
  )

  gamesDB.getGameData(game.gameId)
    .forEach(({ type, data, connectionId }) => {
      connectionsDB.sendData({ type, data }, connectionId)
    })
}
