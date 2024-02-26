import { gamesDB } from '../database'
import { Position, GamePlayer, Ship, ShipType } from '../types'

export const getHitsAround = (coords: number[][]) => {
  return coords
    .map(([x, y]) => {
      return [
        [x - 1, y - 1], [x - 1, y], [x - 1, y + 1],
        [x, y - 1], [x, y], [x, y + 1],
        [x + 1, y - 1], [x + 1, y], [x + 1, y + 1],
      ]
    })
    .flat()
    .filter(([x, y]) => x >= 0 && x <= 9 && y >= 0 && y <= 9)
    .filter(([x, y]) => !coords.some(([posX, posY]) => posX === x && posY === y))
}

export const getRandomAttackCoords = (enemy: GamePlayer): Position => {
  const fieldIds = new Array(100).fill(null).map((_, idx) => idx)

  let idx = Math.round(Math.random() * (fieldIds.length - 1))
  let y = Math.floor(fieldIds[idx] / 10)
  let x = fieldIds[idx] - y * 10
  fieldIds.splice(idx, 1)

  while (gamesDB.playerHasHit(enemy, x, y) && fieldIds.length) {
    idx = Math.round(Math.random() * (fieldIds.length - 1))
    y = Math.floor(fieldIds[idx] / 10)
    x = fieldIds[idx] - y * 10
    fieldIds.splice(idx, 1)
  }

  return { x, y }
}

const shipTypes = [ShipType.Small, ShipType.Medium, ShipType.Large, ShipType.Huge]

export const getRandomShips = (): Ship[] => {
  const ships = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1]

  const board: number[][] = []
  for (let y = 0; y < 10; y += 1) {
    board.push([])
    for (let x = 0; x < 10; x += 1) {
      board[y][x] = 0
    }
  }

  const fieldIds = new Array(100).fill(null).map((_, idx) => idx)

  return ships.map(length => {
    const type = shipTypes[length - 1]
    let direction = false
    let placed = false
    let y = -1
    let x = -1

    while (!placed) {
      const idx = Math.round(Math.random() * (fieldIds.length - 1))
      y = Math.floor(fieldIds[idx] / 10)
      x = fieldIds[idx] - y * 10

      direction = Math.random() > 0.5 ? true : false

      const shipCoords: number[][] = []
      for (let i = 0; i < length; i += 1) {
        const coords = direction ? [x, y + i] : [x + i, y]
        shipCoords.push(coords)
      }

      const isAllowed = shipCoords.every(([x, y]) =>
        x >= 0 && x <= 9 &&
        y >= 0 && y <= 9 &&
        !board[y][x]
      )

      if (isAllowed) {
        fieldIds.splice(idx, 1)
        const coords: number[][] = [...shipCoords, ...getHitsAround(shipCoords)]
        coords.forEach(([x, y]) => {
          board[y][x] = 1
        })
        placed = true
      }
    }

    return { type, direction, length, position: { x, y } }
  })
}
