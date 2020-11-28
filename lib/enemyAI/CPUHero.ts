import { Arena } from '../model/Arena'
import { Hero, HeroType } from '../model/Hero'
import { HeroInMatch } from '../model/HeroInMatch'
import { AttackCPUBehavior } from './behaviors/AttackCPUBehavior'
import { SupportCPUBehavior } from './behaviors/SupportCPUBehavior'
import { CPUBehavior } from './CPUBehavior'

export class CPUHero {
  public behavior: CPUBehavior
  public heroType: HeroType

  constructor(
    hero: HeroInMatch,
    playerSpawnLocations: number[][],
    arena: Arena,
    enemyHeroes: HeroInMatch[],
    playerHeroes: HeroInMatch[]
  ) {
    this.heroType = hero.getHeroRef().heroType
    switch (hero.getHeroRef().heroType) {
      case HeroType.ATTACKER: {
        this.behavior = new AttackCPUBehavior(
          playerSpawnLocations,
          playerHeroes,
          enemyHeroes,
          arena,
          hero
        )
        break
      }
      case HeroType.SUPPORT: {
        this.behavior = new SupportCPUBehavior(
          playerSpawnLocations,
          playerHeroes,
          enemyHeroes,
          arena,
          hero
        )
        break
      }
      default:
        this.behavior = new AttackCPUBehavior(
          playerSpawnLocations,
          playerHeroes,
          enemyHeroes,
          arena,
          hero
        )
    }
  }

  public getMovementAction() {
    return this.behavior.getMovementAction()
  }
  public getPostMoveAction() {
    return this.behavior.getPostMovementAction()
  }
}
