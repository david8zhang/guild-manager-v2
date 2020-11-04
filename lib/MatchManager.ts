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
    this.arena.highlightSquares(squaresInRange)
  }

  public getHighlightedSquares() {
    return this.arena.getHighlightedSquares()
  }

  public resetHighlightedSquares() {
    this.arena.resetSquareHighlight()
  }

  public moveCharacter() {}
}
