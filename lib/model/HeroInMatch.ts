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

  public getMoveRange(): number {
    const speedToRangeMap: any = {
      '50-59': 1,
      '60-69': 2,
      '70-79': 3,
      '80-89': 4,
      '90-99': 5,
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
