import { HeroStats } from '../constants/HeroStats'
import { Hero } from './Hero'

export interface AttackResult {
  damageDealt: number
  attacker: HeroInMatch
  target: HeroInMatch
  isCrit: boolean
}

const RESPAWN_TIME = 3

export class HeroInMatch {
  private hero: Hero
  private currHealth: number
  public isDead: boolean
  private heroStats: HeroStats
  private respawnTimer: number

  constructor(hero: Hero) {
    this.hero = hero
    this.currHealth = hero.health
    this.isDead = false
    this.heroStats = new HeroStats()
    this.respawnTimer = 0
  }

  public getHeroRef(): Hero {
    return this.hero
  }

  public getCurrHealth(): number {
    return this.currHealth
  }

  public getAttackRange(): number {
    let attackPlusSpeedAvg = Math.floor(
      (this.hero.speed + this.hero.attack) / 2
    )
    const sumToRangeMap: any = {
      '50-79': 2,
      '80-89': 3,
      '90-99': 4,
    }
    let range: number = 0
    Object.keys(sumToRangeMap).forEach((key: string) => {
      const ranges = key.split('-')
      const bottom = parseInt(ranges[0], 10)
      const top = parseInt(ranges[1], 10)
      if (attackPlusSpeedAvg >= bottom && attackPlusSpeedAvg <= top) {
        range = sumToRangeMap[key]
      }
    })
    return range
  }

  public getMoveRange(): number {
    const speedToRangeMap: any = {
      '50-59': 2,
      '60-69': 3,
      '70-79': 4,
      '80-89': 5,
      '90-99': 6,
    }
    let range: number = 0
    Object.keys(speedToRangeMap).forEach((key: string) => {
      const ranges = key.split('-')
      const bottom = parseInt(ranges[0], 10)
      const top = parseInt(ranges[1], 10)
      if (this.hero.speed >= bottom && this.hero.speed <= top) {
        range = speedToRangeMap[key]
      }
    })
    return range
  }

  public calculateDamage(targetHero: HeroInMatch) {
    if (!targetHero) {
      return 0
    }
    const targetDefense = targetHero.getHeroRef().defense
    const diff = this.hero.attack - targetDefense
    return (37 * Math.max(diff, 0)) / 8 + 15
  }

  public takeDamage(damage: number) {
    this.currHealth -= damage
    this.currHealth = Math.max(this.currHealth, 0)
    if (this.currHealth === 0) {
      this.isDead = true
    }
  }

  public attack(target: HeroInMatch, critRate: number = 0.2): AttackResult {
    const didCrit =
      Math.floor(Math.random() * 100) <= Math.floor(critRate * 100)
    let damage = this.calculateDamage(target)
    if (didCrit) {
      damage *= 3
    }
    damage = Math.floor(damage)
    target.takeDamage(damage)
    return {
      damageDealt: damage,
      attacker: this,
      target: target,
      isCrit: didCrit,
    }
  }

  public setRespawnTimer() {
    this.respawnTimer = RESPAWN_TIME
  }

  public respawn() {
    this.currHealth = this.hero.health
    this.isDead = false
  }

  public countdownRespawnTimer() {
    this.respawnTimer--
    if (this.respawnTimer == 0) {
      this.respawn()
    }
  }
}
