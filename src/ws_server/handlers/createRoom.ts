import { roomsDB, connectionsDB } from '../database'
import { EntityId } from '../types'

export const createRoom = (connectionId: EntityId) => {
  const player = connectionsDB.getConnection(connectionId)!.player!

  const room = roomsDB.createRoom(player)
  if (!room) { return }

  roomsDB.addRoomUser(room.roomId, player)

  connectionsDB.sendData(
    roomsDB.getUpdateRoomData()
  )
}
