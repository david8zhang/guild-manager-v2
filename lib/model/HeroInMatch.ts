import { HeroStats } from '../constants/HeroStats'
import { Hero } from './Hero'

export interface AttackResult {
  damageDealt: number
  attacker: HeroInMatch
  target: HeroInMatch
  isCrit: boolean
  isOneShot: boolean
}

export interface Buff {
  stat: string
  percentage: number
}

const RESPAWN_TIME = 3
const UNTARGET_TIME = 1
const BUFF_DURATION = 2

export class HeroInMatch {
  private hero: Hero
  private currHealth: number
  private heroStats: HeroStats
  private respawnTimer: number
  private untargetTimer: number // Timer that prevents spawn killing

  public isDead: boolean
  public hasMoved: boolean

  /**
   * Buffs last for a set duration and stack on top of each other multiplicatively
   * When a buff is applied, the buff timer duration is reset, refreshing all stacked buffs (This is maybe too OP)
   */
  public currBuffs: Buff[]
  public buffTimer: number

  constructor(hero: Hero) {
    this.hero = hero
    this.currHealth = hero.health
    this.isDead = false
    this.hasMoved = false
    this.heroStats = new HeroStats()
    this.respawnTimer = 0
    this.untargetTimer = 0
    this.currBuffs = []
    this.buffTimer = 0
  }

  public getHeroRef(): Hero {
    return this.hero
  }

  public setCurrHealth(health: number) {
    this.currHealth = health
  }

  public getCurrHealth(): number {
    return this.currHealth
  }

  public addKillToRecord(): void {
    this.heroStats.numKills++
    this.heroStats.numPoints += 2
  }

  public addDeathToRecord(): void {
    this.heroStats.numDeaths++
  }

  public getHeroStats(): HeroStats {
    return this.heroStats
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
    const targetDefense = targetHero.getStatsWithBuffs().defense
    const diff = this.getStatsWithBuffs().attack - targetDefense
    return (37 * Math.max(diff, 0)) / 8 + 15
  }

  public takeDamage(damage: number) {
    this.currHealth -= damage
    this.currHealth = Math.max(this.currHealth, 0)
    if (this.currHealth === 0) {
      this.isDead = true
    }
  }

  public getBuffs(): Buff[] {
    return this.currBuffs
  }

  public getStatsWithBuffs() {
    const stats: any = {
      attack: this.hero.attack,
      defense: this.hero.defense,
      speed: this.hero.speed,
      magic: this.hero.magic,
    }
    this.currBuffs.forEach((buff: Buff) => {
      stats[buff.stat] *= buff.percentage
    })
    return stats
  }

  public applyBuff(buff: Buff) {
    this.buffTimer = BUFF_DURATION
    this.currBuffs.push(buff)
  }

  public tickBuffTimer() {
    this.buffTimer--
    if (this.buffTimer === 0) {
      this.currBuffs = []
    }
    this.buffTimer = Math.max(0, this.buffTimer)
  }

  public attack(
    target: HeroInMatch,
    critRate: number = 0.2,
    oneShotRate: number = 0.05
  ): AttackResult {
    let damage = this.calculateDamage(target)
    let didOneShot = false
    let didCrit = false

    // Calculate the chance that the hero performs an attack that kills the enemy in one shot
    didOneShot =
      Math.floor(Math.random() * 100) <= Math.floor(oneShotRate * 100)
    if (didOneShot) {
      damage = target.currHealth
    } else {
      // Calculate the chance that the hero performs a critical strike which deals some multiplier of dmg
      didCrit = Math.floor(Math.random() * 100) <= Math.floor(critRate * 100)
      if (didCrit) {
        damage *= 3
      }
    }

    damage = Math.floor(damage)
    target.takeDamage(damage)
    return {
      damageDealt: damage,
      attacker: this,
      target: target,
      isCrit: didCrit,
      isOneShot: didOneShot,
    }
  }

  public setRespawnTimer() {
    this.respawnTimer = RESPAWN_TIME
  }

  public isUntargetable() {
    return this.untargetTimer > 0
  }

  public countdownUntargetTimer() {
    if (this.untargetTimer > 0) {
      this.untargetTimer--
    }
  }

  public respawn() {
    this.currHealth = this.hero.health
    this.isDead = false
  }

  public countdownRespawnTimer() {
    this.respawnTimer--
    if (this.respawnTimer == 0) {
      this.respawn()
      this.untargetTimer = UNTARGET_TIME
    }
  }
}
