import { randomUUID } from 'node:crypto'
import { Room, EntityId, Player, MsgType, HandlerData, UpdateRoomResponseData } from '../types'

export class Rooms {
  private rooms: Room[]

  constructor () {
    this.rooms = []
  }

  createRoom (player: Player) {
    const playerHasRoom = this.rooms.some(
      ({ roomUsers }) => roomUsers.some(({ index }) => index === player.index)
    )

    if (playerHasRoom) { return false }

    const room: Room = {
      roomId: randomUUID(),
      roomUsers: [],
    }

    this.rooms.push(room)
    return room
  }

  addRoomUser (roomId: EntityId, player: Player) {
    const room = this.rooms.find(room => room.roomId === roomId)
    if (!room ||
      room.roomUsers.length === 2 ||
      room.roomUsers.some(({ index }) => index === player.index)
    ) {
      return false
    }

    room.roomUsers.push(player)
    return room
  }

  getUpdateRoomData (): HandlerData {
    return {
      type: MsgType.UpdateRoom,
      data: this.rooms
        .filter(({ roomUsers }) => roomUsers.length < 2)
        .map(({ roomId, roomUsers }) => ({
          roomId,
          roomUsers: roomUsers.map(({ name, index }) => ({ name, index }))
        })) as UpdateRoomResponseData
    }
  }

  closeRoom (roomId: EntityId) {
    const index = this.rooms.findIndex(room => room.roomId === roomId)
    this.rooms.splice(index, 1)
  }

  closeRoomsWithPlayer (player: Player) {
    const rooms = this.rooms.filter(({ roomUsers }) => roomUsers.some(({ index }) => index === player.index))
    rooms.forEach(room => {
      this.closeRoom(room.roomId)
    })
  }
}

export const roomsDB = new Rooms()
