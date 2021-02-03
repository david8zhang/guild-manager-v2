import { HeroStats } from './HeroStats'
import { Hero, HeroType } from './Hero'

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

const COUNTERS = {
  [HeroType.SUPPORT]: {
    type: HeroType.TANK,
    multiplier: 2,
  },
  [HeroType.RANGER]: {
    type: HeroType.SUPPORT,
    multiplier: 2,
  },
  [HeroType.TANK]: {
    type: HeroType.RANGER,
    multiplier: 2,
  },
}

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

  public addHealth(health: number) {
    this.currHealth += health
    this.currHealth = Math.min(this.hero.health, this.currHealth)
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
    return this.getHeroRef().attackRange
  }

  public getMoveRange(): number {
    switch (this.hero.heroType) {
      case HeroType.RANGER: {
        return 5
      }
      case HeroType.SUPPORT: {
        return 4
      }
      case HeroType.TANK: {
        return 3
      }
      default:
        return 4
    }
  }

  public getNumAttacks(): number {
    const speed = this.getHeroRef().speed

    // If the speed is greater than 95, there is a 50% chance of attacking twice
    if (speed >= 95) {
      return Math.floor(Math.random() * 100) <= 50 ? 2 : 1
    }
    // If the speed is greater than 85, there is a 25% chance of attacking twice
    if (speed >= 85) {
      return Math.floor(Math.random() * 100) <= 25 ? 2 : 1
    }
    // If the speed is greater than 75, there is a 15% chance of attacking twice
    if (speed >= 75) {
      return Math.floor(Math.random() * 100) <= 15 ? 2 : 1
    }

    return 1
  }

  public calculateDamage(targetHero: HeroInMatch) {
    if (!targetHero) {
      return 0
    }
    const targetStats = targetHero.getStatsWithBuffs()
    const userStats = this.getStatsWithBuffs()

    const targetDefense =
      this.getHeroRef().heroType === HeroType.SUPPORT
        ? targetStats.magic
        : targetStats.defense
    const damageStat =
      this.getHeroRef().heroType === HeroType.SUPPORT
        ? userStats.magic
        : userStats.attack
    const diff = damageStat - targetDefense
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
    oneShotRate: number = 0.01
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

    const thisHeroType = this.getHeroRef().heroType
    if (COUNTERS[thisHeroType].type === target.getHeroRef().heroType) {
      damage *= COUNTERS[thisHeroType].multiplier
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
