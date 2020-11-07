import { HeroStats } from '../constants/HeroStats'
import { Hero } from './Hero'

export class HeroInMatch {
  private hero: Hero
  private currHealth: number
  private isDead: boolean
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
    console.log()
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
}
