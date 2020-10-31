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
  onTickCallback: Function
}

export class MatchManager {
  private static TIMER_INCREMENT: number = 1000
  private static MATCH_DURATION = 480

  private playerHeroes: HeroInMatch[]
  private enemyHeroes: HeroInMatch[]

  private playerTeamInfo: TeamInfo
  private enemyTeamInfo: TeamInfo

  private arena: Arena
  private eventLog: MatchEvent[]
  private interval: number = 0
  private onTickCallback: Function
  private currentTime = 0
  private score: any = {}

  constructor(config: MatchManagerConfig) {
    this.playerHeroes = config.playerHeroes.map((h) => new HeroInMatch(h))
    this.enemyHeroes = config.enemyHeroes.map((h) => new HeroInMatch(h))
    this.arena = new Arena(this.playerHeroes, this.enemyHeroes)
    this.eventLog = []
    this.onTickCallback = config.onTickCallback
    this.currentTime = MatchManager.MATCH_DURATION
    this.playerTeamInfo = config.playerTeamInfo
    this.enemyTeamInfo = config.enemyTeamInfo
  }

  private startMatchTimer(): void {
    this.interval = setInterval(() => {
      this.tick()
    }, MatchManager.TIMER_INCREMENT)
  }

  private stopMatchTimer(): void {
    clearInterval(this.interval)
  }

  private tick(): void {
    if (this.currentTime === 0) {
      this.stopMatchTimer()
    } else {
      this.currentTime--
      this.onTickCallback(this.currentTime)
    }
  }

  // Do all initialization logic here
  public startMatch(): void {
    this.arena.initializeArena()
    this.startMatchTimer()
    this.score = {
      [this.playerTeamInfo.abbrev]: 0,
      [this.enemyTeamInfo.abbrev]: 0,
    }
  }

  public stopMatch() {
    this.stopMatchTimer()
    this.currentTime = MatchManager.MATCH_DURATION
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
}
