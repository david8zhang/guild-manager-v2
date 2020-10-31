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
}
