import { randomUUID } from 'node:crypto'
import { getHitsAround } from '../helpers'
import { AttackStatus, PlayerType, MsgType } from '../types/enums'
import { Game, GamePlayer, Player, EntityId, Ship, Position, FinishGameResponseData,
  StartGameResponseData, TurnResponseData, AttackResponseData, CreateGameResponseData,
} from '../types/types'

export class Games {
  private games: Game[]

  constructor () {
    this.games = []
  }

  createGame (roomId: EntityId, createId?: boolean) {
    const gameId = createId ? randomUUID() : roomId
    const game: Game = {
      gameId,
      players: [],
      roomId: roomId,
      currentPlayerId: null,
    }
    this.games.push(game)
    return game
  }

  closeGame (gameId: EntityId) {
    const index = this.games.findIndex(game => game.gameId === gameId)
    this.games.splice(index, 1)
  }

  getGame (gameId: EntityId) {
    return this.games.find((game) => game.gameId === gameId)
  }

  getGameByPlayer (indexPlayer: EntityId) {
    return this.games.find(({ players }) => players.some(({ index }) => index === indexPlayer))
  }

  getCurrentPlayer (gameId: EntityId) {
    const game = this.getGame(gameId)!
    return game.players.find(({ index }) => index === game.currentPlayerId)?.player
  }

  getGamePlayers (gameId: EntityId) {
    const game = this.getGame(gameId)!
    const player = game.players.find(player => player.index === game.currentPlayerId)!
    const enemy = game.players.find(player => player.index !== game.currentPlayerId)!
    return { player, enemy }
  }

  setGamePlayers (gameId: EntityId, players: Player[]) {
    const game = this.getGame(gameId)!
    const gamePlayers: GamePlayer[] = players.map(player => ({
      player,
      connectionId: player.connectionId!,
      index: player.index,
      ships: [],
      hits: [],
    }))
    game.players.push(...gamePlayers)
  }

  addPlayerShips (gameId: EntityId, indexPlayer: EntityId, ships: Ship[]) {
    const game = this.getGame(gameId)!
    const player = game.players.find(({ index }) => index === indexPlayer)!
    player.ships = ships
  }

  canStartGame (gameId: EntityId) {
    const game = this.getGame(gameId)!
    return game.players.every(({ ships }) => ships.length)
  }

  playerHasHit (player: GamePlayer, x: number, y: number) {
    return player.hits.some(hit => hit.x === x && hit.y === y)
  }

  getShipCoords (ship: Ship) {
    return new Array(ship.length).fill(null)
      .map((_, i) => ship.direction
        ? [ship.position.x, ship.position.y + i]
        : [ship.position.x + i, ship.position.y]
      )
  }

  getHitsAroundShip = (player: GamePlayer, ship: Ship): Position[] => {
    const shipCoords = this.getShipCoords(ship)
    const hits = getHitsAround(shipCoords)
    return hits
      .filter(([x, y]) => !this.playerHasHit(player, x, y))
      .map(([x, y]) => ({ x, y }))
  }

  isShipKilled = (player: GamePlayer, ship: Ship) => {
    return this.getShipCoords(ship).every(([x, y]) => this.playerHasHit(player, x, y))
  }

  hitPlayerShip (player: GamePlayer, x: number, y: number) {
    const ship = player.ships.find((ship) => {
      return this.getShipCoords(ship).some(([shipX, shipY]) => shipX === x && shipY === y)
    })

    if (!ship) {
      return { ship: null, status: AttackStatus.Miss }
    }

    const hasKilled = this.isShipKilled(player, ship)
    return { ship, status: hasKilled ? AttackStatus.Killed : AttackStatus.Shot }
  }

  attack (gameId: EntityId, x: number, y: number) {
    const game = this.getGame(gameId)!
    const { player, enemy } = this.getGamePlayers(gameId)!

    const hasAlreadyHit = this.playerHasHit(enemy, x, y)

    if (hasAlreadyHit) {
      game.currentPlayerId = enemy.index
      const { status } = this.hitPlayerShip(enemy, x, y)

      return game.players
        .filter(({ player }) => player.type !== PlayerType.Bot)
        .map(({ connectionId }) => ({
          type: MsgType.Attack,
          data: {
            currentPlayer: player.index,
            position: { x, y },
            status: status === AttackStatus.Killed ? AttackStatus.Shot : AttackStatus.Miss,
          } as AttackResponseData,
          connectionId,
        }))
    }

    enemy.hits.push({ x, y })

    const { ship, status } = this.hitPlayerShip(enemy, x, y)

    const hitsAround = status === AttackStatus.Killed
      ? this.getHitsAroundShip(enemy, ship!)
      : []

    const hitsShipKilled = status === AttackStatus.Killed
      ? this.getShipCoords(ship!).filter(([shipX, shipY]) => shipX !== x || shipY !== y).map(([x, y]) => ({ x, y }))
      : []

    enemy.hits.push(...hitsAround)

    if (status === AttackStatus.Miss) {
      game.currentPlayerId = enemy.index
    }

    const hitResponse = game.players
      .filter(({ player }) => player.type !== PlayerType.Bot)
      .map(({ connectionId }) => ({
        type: MsgType.Attack,
        data: {
          currentPlayer: player.index,
          position: { x, y },
          status,
        } as AttackResponseData,
        connectionId,
      }))

    const hitsShipKilledResponse = hitsShipKilled.map(({ x, y }) => {
      return game.players
        .filter(({ player }) => player.type !== PlayerType.Bot)
        .map(({ connectionId }) => ({
          type: MsgType.Attack,
          data: {
            currentPlayer: player.index,
            position: { x, y },
            status: AttackStatus.Killed,
          } as AttackResponseData,
          connectionId,
        }))
    }).flat()

    const hitsAroundResponse = hitsAround.map(({ x, y }) => {
      return game.players
        .filter(({ player }) => player.type !== PlayerType.Bot)
        .map(({ connectionId }) => ({
          type: MsgType.Attack,
          data: {
            currentPlayer: player.index,
            position: { x, y },
            status: AttackStatus.Miss,
          } as AttackResponseData,
          connectionId,
        }))
    }).flat()

    return [...hitResponse, ...hitsShipKilledResponse, ...hitsAroundResponse]
  }

  isGameOver (gameId: EntityId) {
    const { enemy } = this.getGamePlayers(gameId)!
    return enemy.ships.every((ship) => this.isShipKilled(enemy, ship))
  }

  getGameData (gameId: EntityId) {
    const game = this.getGame(gameId)!
    return game.players
      .filter(({ player }) => player.type !== PlayerType.Bot)
      .map(({ connectionId, index }) => ({
        type: MsgType.CreateGame,
        data: {
          idGame: gameId,
          idPlayer: index,
        } as CreateGameResponseData,
        connectionId,
      }))
  }

  getStartGameData (gameId: EntityId) {
    const game = this.getGame(gameId)!
    game.currentPlayerId = game.players[0].index
    return game.players
      .filter(({ player }) => player.type !== PlayerType.Bot)
      .map(({ connectionId, ships, index }) => ({
        type: MsgType.StartGame,
        data: {
          currentPlayerIndex: index,
          ships,
        } as StartGameResponseData,
        connectionId,
      }))
  }

  getTurnData (gameId: EntityId) {
    const game = this.getGame(gameId)!
    return game.players
      .filter(({ player }) => player.type !== PlayerType.Bot)
      .map(({ connectionId }) => ({
        type: MsgType.Turn,
        data: { currentPlayer: game.currentPlayerId } as TurnResponseData,
        connectionId,
      }))
  }

  getFinishGameData (gameId: EntityId) {
    const game = this.getGame(gameId)!
    return game.players
      .filter(({ player }) => player.type !== PlayerType.Bot)
      .map(({ connectionId }) => ({
        type: MsgType.Finish,
        data: { winPlayer: game.currentPlayerId } as FinishGameResponseData,
        connectionId,
      }))
  }
}

export const gamesDB = new Games()
