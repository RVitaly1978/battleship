import { gamesDB, connectionsDB, roomsDB, playersDB } from '../database'
import { getRandomShips } from '../helpers'
import { EntityId, PlayerType } from '../types'

export const singlePlay = (connectionId: EntityId) => {
  const player = connectionsDB.getConnection(connectionId)!.player!

  roomsDB.closeRoomsWithPlayer(player)

  const room = roomsDB.createRoom(player)
  if (!room) { return }

  const bot = playersDB.createPlayer(PlayerType.Bot, connectionId)
  roomsDB.addRoomUser(room.roomId, player)
  roomsDB.addRoomUser(room.roomId, bot)

  const game = gamesDB.createGame(room.roomId)

  gamesDB.setGamePlayers(game.gameId, room.roomUsers)
  gamesDB.addPlayerShips(game.gameId, bot.index, getRandomShips())

  roomsDB.closeRoomsWithPlayer(player)

  connectionsDB.sendData(
    roomsDB.getUpdateRoomData()
  )

  gamesDB.getGameData(game.gameId)
    .forEach(({ type, data, connectionId }) => {
      connectionsDB.sendData({ type, data }, connectionId)
    })
}
