import { HeroStats } from '../constants/HeroStats'
import { Hero } from './Hero'

export class HeroInMatch {
  private hero: Hero
  private currHealth: number
  public isDead: boolean
  private heroStats: HeroStats

  constructor(hero: Hero) {
    this.hero = hero
    this.currHealth = hero.health
    this.isDead = false
    this.heroStats = new HeroStats()
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

  public attack(target: HeroInMatch) {
    const damage = this.calculateDamage(target)
    target.takeDamage(damage)
  }
}
