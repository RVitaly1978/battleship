import { gamesDB, connectionsDB, playersDB, roomsDB } from '../database'
import { EntityId, MsgType } from '../types'

export const cleanup = (connectionId: EntityId, closeCode: number) => {
  const user = connectionsDB.getConnection(connectionId)?.player!
  if (!user) { return }

  const game = gamesDB.getGameByPlayer(user.index!)

  if (game) {
    if (closeCode === 1001) {
      const opponent = game.players.find(({ index }) => index !== user.index)!

      playersDB.setPlayerWin(opponent.index)

      connectionsDB.sendData(
        { type: MsgType.Finish, data: { winPlayer: opponent.index } },
        opponent.connectionId,
      )

      connectionsDB.sendData(
        playersDB.getWinners()
      )
    }

    gamesDB.closeGame(game.gameId)
  }

  roomsDB.closeRoomsWithPlayer(user)
  connectionsDB.removeConnection(connectionId)
  playersDB.terminateConnection(connectionId)

  connectionsDB.sendData(
    roomsDB.getUpdateRoomData()
  )
}
