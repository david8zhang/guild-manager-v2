import { Arena } from './model/Arena'
import { Hero } from './model/Hero'
import { HeroInMatch } from './model/HeroInMatch'
import { MatchEvent } from './model/MatchEvent'

export interface MatchManagerConfig {
  playerHeroes: Hero[]
  enemyHeroes: Hero[]
  onTickCallback: Function
}

export class MatchManager {
  private static TIMER_INCREMENT: number = 1000
  private static MATCH_DURATION = 480

  private playerHeroes: HeroInMatch[]
  private enemyHeroes: HeroInMatch[]
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
      player: 0,
      enemy: 0,
    }
  }

  public stopMatch() {
    console.log(this.interval)
    this.stopMatchTimer()
    this.currentTime = MatchManager.MATCH_DURATION
  }

  public getScore(): any {
    return this.score
  }
}
