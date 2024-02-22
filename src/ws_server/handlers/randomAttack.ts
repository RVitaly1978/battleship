import { gamesDB } from '../database'
import { ParsedRequestData, RandomAttackRequestData } from '../types'
import { attack } from './attack'
import { getRandomAttackCoords } from '../helpers'

export const randomAttack = (data: ParsedRequestData) => {
  const { gameId, indexPlayer } = data as unknown as RandomAttackRequestData

  const { index } = gamesDB.getCurrentPlayer(gameId)!
  if (indexPlayer !== index) { return }

  const { enemy } = gamesDB.getGamePlayers(gameId)

  const { x, y } = getRandomAttackCoords(enemy)

  attack({ gameId, indexPlayer, x, y })
}
