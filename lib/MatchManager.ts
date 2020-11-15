import { times } from 'lodash'
import { Arena } from './model/Arena'
import { Hero } from './model/Hero'
import { HeroInMatch } from './model/HeroInMatch'
import { MatchEvent } from './model/MatchEvent'

interface TeamInfo {
  name: string
  abbrev: string
}

export interface MatchManagerConfig {
  playerHeroes: Hero[]
  enemyHeroes: Hero[]
  playerTeamInfo: TeamInfo
  enemyTeamInfo: TeamInfo
}

export class MatchManager {
  private static MATCH_DURATION = 1

  private playerHeroes: HeroInMatch[]
  private enemyHeroes: HeroInMatch[]

  private playerTeamInfo: TeamInfo
  private enemyTeamInfo: TeamInfo

  private arena: Arena
  private eventLog: MatchEvent[]
  private score: any = {}

  private playerSpawnLocations: number[][] = []
  private enemySpawnLocations: number[][] = []

  private matchTimer: number

  constructor(config: MatchManagerConfig) {
    this.playerHeroes = config.playerHeroes.map((h) => new HeroInMatch(h))
    this.enemyHeroes = config.enemyHeroes.map((h) => new HeroInMatch(h))
    this.arena = new Arena(this.playerHeroes, this.enemyHeroes)
    this.eventLog = []
    this.playerTeamInfo = config.playerTeamInfo
    this.enemyTeamInfo = config.enemyTeamInfo
    this.matchTimer = 0
  }

  // Do all initialization logic here
  public startMatch(): void {
    this.arena.initializeArena()
    this.playerSpawnLocations = this.arena.getPlayerHeroPositions()
    this.enemySpawnLocations = this.arena.getEnemyHeroPositions()
    this.score = {
      [this.playerTeamInfo.abbrev]: 0,
      [this.enemyTeamInfo.abbrev]: 0,
    }
    this.matchTimer = MatchManager.MATCH_DURATION
  }

  public getScore(): any {
    return this.score
  }

  public getArena(): any {
    return {
      map: this.arena.getMap(),
      rows: Arena.NUM_ROWS,
      cols: Arena.NUM_COLS,
    }
  }

  public highlightMoveableSquares(rows: number, cols: number) {
    const hero: HeroInMatch = this.arena.getHeroAtLocation(rows, cols)
    const range = hero.getMoveRange()
    let squaresInRange: number[][] = this.arena.getSquaresInRange(
      range,
      rows,
      cols
    )

    // Filter out the enemy starting locations, enemy locations
    const enemySpawnLocations = this.enemySpawnLocations.map(
      (loc: number[]) => `${loc[0]},${loc[1]}`
    )
    squaresInRange = squaresInRange.filter((coord: number[]) => {
      return (
        !enemySpawnLocations.includes(`${coord[0]},${coord[1]}`) &&
        !this.arena.getHeroAtLocation(coord[0], coord[1])
      )
    })

    this.arena.highlightSquares(squaresInRange, 'blue')
  }

  public isHeroAttackable(hero: HeroInMatch): boolean {
    return hero && !hero.isDead && !hero.isUntargetable()
  }

  public getHeroesInAttackRange(rows: number, cols: number): any[] {
    const hero: HeroInMatch = this.arena.getHeroAtLocation(rows, cols)
    const heroesInAttackRange: any[] = []
    const range = hero.getAttackRange()
    const squaresInRange = this.arena.getSquaresInRange(range, rows, cols)

    squaresInRange.forEach((coord: number[]) => {
      const h = this.arena.getHeroAtLocation(coord[0], coord[1])
      if (this.isHeroAttackable(h)) {
        heroesInAttackRange.push({
          coordinates: coord,
          hero: h,
        })
      }
    })
    return heroesInAttackRange
  }

  public getHeroByHeroId = (heroId: string) => {
    const allHeroes = this.playerHeroes.concat(this.enemyHeroes)
    return allHeroes.find((h: HeroInMatch) => h.getHeroRef().heroId == heroId)
  }

  public highlightAttackableSquares(rows: number, cols: number) {
    const hero: HeroInMatch = this.arena.getHeroAtLocation(rows, cols)
    const range = hero.getAttackRange()
    const squaresToHighlight = this.arena.getSquaresInRange(range, rows, cols)
    this.arena.highlightSquares(squaresToHighlight, 'red')
  }

  public getHighlightedSquares() {
    return this.arena.getHighlightedSquares()
  }

  public resetHighlightedSquares() {
    this.arena.resetSquareHighlight()
  }

  public moveHero({
    start,
    target,
  }: {
    start: { row: number; col: number }
    target: { row: number; col: number }
  }) {
    this.arena.moveHero(start, target)
  }

  public getPlayerHeroesInMatch(): HeroInMatch[] {
    return this.playerHeroes
  }

  public getEnemyHeroesInMatch(): HeroInMatch[] {
    return this.enemyHeroes
  }

  public playerScoreKill(): void {
    this.score[this.playerTeamInfo.abbrev] += 2
  }

  public getPlayerScore() {
    return this.score[this.playerTeamInfo.abbrev]
  }

  public getPlayerTeamInfo(): TeamInfo {
    return this.playerTeamInfo
  }

  public enemyScoreKill(): void {
    this.score[this.enemyTeamInfo.abbrev] += 2
  }

  public getEnemyScore() {
    return this.score[this.enemyTeamInfo.abbrev]
  }

  public getEnemyTeamInfo(): TeamInfo {
    return this.enemyTeamInfo
  }

  public moveEnemyHeroes(): void {
    const enemyHeroPositions: number[][] = this.arena.getEnemyHeroPositions()
    const playerHeroPositions: number[][] = this.arena.getPlayerHeroPositions()

    const liveHeroFilterFn = (position: number[]): boolean => {
      const hero: HeroInMatch = this.arena.getHeroAtLocation(
        position[0],
        position[1]
      )
      return hero && !hero.isDead
    }

    const livingEnemyHeroPositions = enemyHeroPositions.filter(liveHeroFilterFn)
    const livingPlayerHeroPositions = playerHeroPositions.filter(
      liveHeroFilterFn
    )

    // If all players are dead, then just stay where you are
    if (livingPlayerHeroPositions.length === 0) {
      return
    }

    livingEnemyHeroPositions.forEach((position) => {
      const hero: HeroInMatch = this.arena.getHeroAtLocation(
        position[0],
        position[1]
      )
      const range = hero.getMoveRange()
      const moveableSquares = this.arena.getSquaresInRange(
        range,
        position[0],
        position[1]
      )

      // Target a random player and get the closest square within move range to the player's position
      const randomPlayerToTarget =
        livingPlayerHeroPositions[
          Math.floor(Math.random() * livingPlayerHeroPositions.length)
        ]
      let closestSquareToTarget: number[] = []
      let runningDistance = Number.MAX_SAFE_INTEGER

      // Filter out squares that are occupied or are part of the player's spawn locations
      const playerSpawnLocations: string[] = this.playerSpawnLocations.map(
        (coord: number[]) => `${coord[0]},${coord[1]}`
      )
      const emptyMoveableSquares = moveableSquares.filter(
        (coordinate: number[]) => {
          return (
            !this.arena.getHeroAtLocation(coordinate[0], coordinate[1]) &&
            !playerSpawnLocations.includes(`${coordinate[0]},${coordinate[1]}`)
          )
        }
      )
      emptyMoveableSquares.forEach((coordinate: number[]) => {
        const currDistance = this.arena.getManhattanDistance(
          coordinate,
          randomPlayerToTarget
        )
        if (currDistance < runningDistance) {
          runningDistance = currDistance
          closestSquareToTarget = coordinate
        }
      })
      this.arena.moveHero(
        {
          row: position[0],
          col: position[1],
        },
        {
          row: closestSquareToTarget[0],
          col: closestSquareToTarget[1],
        }
      )
    })
  }

  // TODO: Move this to its own class, EnemyAI or something
  public doEnemyHeroAttacks(): any[] {
    const attackActions: any[] = []
    const enemyHeroPositions: number[][] = this.arena.getEnemyHeroPositions()
    const playerHeroIds: string[] = this.playerHeroes.map(
      (hero: HeroInMatch) => hero.getHeroRef().heroId
    )

    const livingEnemyHeroPositions = enemyHeroPositions.filter(
      (position: number[]) => {
        const hero = this.arena.getHeroAtLocation(position[0], position[1])
        return hero && !hero.isDead
      }
    )
    livingEnemyHeroPositions.forEach((position: number[]) => {
      const hero: HeroInMatch = this.arena.getHeroAtLocation(
        position[0],
        position[1]
      )
      const range = hero.getAttackRange()
      const attackableSquares = this.arena.getSquaresInRange(
        range,
        position[0],
        position[1]
      )
      let heroToAttack: any = null

      attackableSquares.forEach((square: number[]) => {
        const target: HeroInMatch = this.arena.getHeroAtLocation(
          square[0],
          square[1]
        )
        // If the hero is attackable and is on the player's side
        if (
          this.isHeroAttackable(target) &&
          playerHeroIds.includes(target.getHeroRef().heroId)
        ) {
          // Get the target with the lowest current health
          if (
            !heroToAttack ||
            target.getCurrHealth() < heroToAttack.getCurrHealth()
          ) {
            heroToAttack = target
          }
        }
      })
      if (heroToAttack) {
        attackActions.push({
          target: heroToAttack,
          attacker: hero,
        })
      }
    })
    return attackActions
  }

  public tickRespawnTimer(side: string) {
    const heroes: HeroInMatch[] =
      side === 'enemy'
        ? this.getEnemyHeroesInMatch()
        : this.getPlayerHeroesInMatch()
    heroes.forEach((hero: HeroInMatch) => {
      if (hero.isDead) {
        hero.countdownRespawnTimer()
      }
    })
  }

  public tickUntargetTimer(side: string) {
    const heroes: HeroInMatch[] =
      side === 'enemy'
        ? this.getEnemyHeroesInMatch()
        : this.getPlayerHeroesInMatch()
    heroes.forEach((hero: HeroInMatch) => {
      if (!hero.isDead && hero.isUntargetable()) {
        hero.countdownUntargetTimer()
      }
    })
  }

  public isSpawnLocation(coordinates: string): boolean {
    const allSpawnLocations = this.playerSpawnLocations.concat(
      this.enemySpawnLocations
    )
    for (let i = 0; i < allSpawnLocations.length; i++) {
      const coord = allSpawnLocations[i]
      const stringified = `${coord[0]},${coord[1]}`
      if (stringified === coordinates) {
        return true
      }
    }
    return false
  }

  public getEmptySpawnLocation(
    spawnLocations: number[][],
    currLoc: number[]
  ): number[] {
    for (let i = 0; i < spawnLocations.length; i++) {
      const coord = spawnLocations[i]
      const hero: HeroInMatch | null = this.arena.getHeroAtLocation(
        coord[0],
        coord[1]
      )

      // If the hero was spawn killed, keep them at the current location
      if (!hero || (currLoc[0] === coord[0] && currLoc[1] === coord[1])) {
        return coord
      }
    }
    console.error('No empty spawn location found!')
    return [0, 0]
  }

  public haveAllPlayerHeroesMoved(): boolean {
    const playerHeroes: HeroInMatch[] = this.getPlayerHeroesInMatch()
    for (let i = 0; i < playerHeroes.length; i++) {
      const hero: HeroInMatch = playerHeroes[i]
      if (!hero.isDead && !hero.hasMoved) {
        return false
      }
    }
    return true
  }

  public resetPlayerMoves(): void {
    const playerHeroes: HeroInMatch[] = this.getPlayerHeroesInMatch()
    playerHeroes.forEach((h: HeroInMatch) => {
      h.hasMoved = false
    })
  }

  public respawnHero(hero: HeroInMatch, side: string) {
    // Set a respawn timer that ticks down every turn
    hero.setRespawnTimer()

    // Teleport the dead hero back to the starting squares
    const currHeroLocation = this.arena.getHeroLocation(
      hero.getHeroRef().heroId
    )
    const emptySpawnLocation =
      side === 'player'
        ? this.getEmptySpawnLocation(
            this.playerSpawnLocations,
            currHeroLocation
          )
        : this.getEmptySpawnLocation(this.enemySpawnLocations, currHeroLocation)
    const heroLocation: number[] = this.arena.getHeroLocation(
      hero.getHeroRef().heroId
    )
    this.arena.moveHero(
      {
        row: heroLocation[0],
        col: heroLocation[1],
      },
      {
        row: emptySpawnLocation[0],
        col: emptySpawnLocation[1],
      }
    )
  }

  public isGameOver(): boolean {
    return this.matchTimer === 0
  }

  public decrementMatchTimer() {
    this.matchTimer--
  }

  public getTurnsRemaining(): number {
    return this.matchTimer
  }
}
