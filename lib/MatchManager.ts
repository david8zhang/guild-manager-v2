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
  private playerHeroes: HeroInMatch[]
  private enemyHeroes: HeroInMatch[]

  private playerTeamInfo: TeamInfo
  private enemyTeamInfo: TeamInfo

  private arena: Arena
  private eventLog: MatchEvent[]
  private score: any = {}

  constructor(config: MatchManagerConfig) {
    this.playerHeroes = config.playerHeroes.map((h) => new HeroInMatch(h))
    this.enemyHeroes = config.enemyHeroes.map((h) => new HeroInMatch(h))
    this.arena = new Arena(this.playerHeroes, this.enemyHeroes)
    this.eventLog = []
    this.playerTeamInfo = config.playerTeamInfo
    this.enemyTeamInfo = config.enemyTeamInfo
  }

  // Do all initialization logic here
  public startMatch(): void {
    this.arena.initializeArena()
    this.score = {
      [this.playerTeamInfo.abbrev]: 0,
      [this.enemyTeamInfo.abbrev]: 0,
    }
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
    const squaresInRange = this.arena.getSquaresInRange(range, rows, cols)
    this.arena.highlightSquares(squaresInRange, 'blue')
  }

  public getHeroesInAttackRange(rows: number, cols: number): any[] {
    const hero: HeroInMatch = this.arena.getHeroAtLocation(rows, cols)
    const heroesInAttackRange: any[] = []
    const range = hero.getAttackRange()
    const squaresInRange = this.arena.getSquaresInRange(range, rows, cols)
    squaresInRange.forEach((coord: number[]) => {
      const h = this.arena.getHeroAtLocation(coord[0], coord[1])
      if (h) {
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
    enemyHeroPositions.forEach((position) => {
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
        playerHeroPositions[
          Math.floor(Math.random() * playerHeroPositions.length)
        ]
      let closestSquareToTarget: number[] = []
      let runningDistance = Number.MAX_SAFE_INTEGER
      const emptyMoveableSquares = moveableSquares.filter(
        (coordinate: number[]) => {
          return !this.arena.getHeroAtLocation(coordinate[0], coordinate[1])
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
}
