import { Arena } from '../model/Arena'
import { HeroType } from '../model/Hero'
import { HeroInMatch } from '../model/HeroInMatch'
import { AttackCPUBehavior } from './behaviors/AttackCPUBehavior'
import { SupportCPUBehavior } from './behaviors/SupportCPUBehavior'
import { CPUBehavior } from './CPUBehavior'

export class BehaviorSelector {
  private playerSpawnLocations: number[][]
  private arena: Arena
  private enemyHeroes: HeroInMatch[]
  private playerHeroes: HeroInMatch[]
  private hero: HeroInMatch

  constructor(
    playerSpawnLocations: number[][],
    arena: Arena,
    enemyHeroes: HeroInMatch[],
    playerHeroes: HeroInMatch[],
    hero: HeroInMatch
  ) {
    this.playerSpawnLocations = playerSpawnLocations
    this.arena = arena
    this.enemyHeroes = enemyHeroes
    this.playerHeroes = playerHeroes
    this.hero = hero
  }

  public getBehavior(): CPUBehavior {
    const hasAttackerHero =
      this.enemyHeroes.find((hero: HeroInMatch) => {
        const heroType = hero.getHeroRef().heroType
        return (
          (heroType === HeroType.RANGER || heroType === HeroType.TANK) &&
          !hero.isDead
        )
      }) !== undefined

    const thisHeroType = this.hero.getHeroRef().heroType

    const attackCPUBehavior = new AttackCPUBehavior(
      this.playerSpawnLocations,
      this.playerHeroes,
      this.enemyHeroes,
      this.arena,
      this.hero
    )

    // If there are no other living attacker heroes, make the support hero attack
    if (!hasAttackerHero) {
      return attackCPUBehavior
    }

    switch (thisHeroType) {
      case HeroType.SUPPORT: {
        return new SupportCPUBehavior(
          this.playerSpawnLocations,
          this.playerHeroes,
          this.enemyHeroes,
          this.arena,
          this.hero
        )
      }
      default:
        return attackCPUBehavior
    }
  }
}
