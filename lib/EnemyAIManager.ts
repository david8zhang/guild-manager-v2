import { CPUHero } from './enemyAI/CPUHero'
import { MatchManager } from './MatchManager'
import { Arena } from './model/Arena'
import { HeroType } from './model/Hero'
import { HeroInMatch } from './model/HeroInMatch'
import { Move } from './moves/Move'
import { MoveFactory } from './moves/MoveFactory'

interface EnemyAIManagerConfig {
  playerSpawnLocations: number[][]
  playerHeroes: HeroInMatch[]
  enemyHeroes: HeroInMatch[]
  arena: Arena
}

export class EnemyAIManager {
  public enemyHeroes: CPUHero[]
  public arena: Arena

  constructor(config: EnemyAIManagerConfig) {
    this.enemyHeroes = config.enemyHeroes.map(
      (hero: HeroInMatch) =>
        new CPUHero(
          hero,
          config.playerSpawnLocations,
          config.arena,
          config.enemyHeroes,
          config.playerHeroes
        )
    )
    this.arena = config.arena
  }

  public moveEnemyHeroes() {
    this.enemyHeroes.forEach((hero: CPUHero) => {
      const { currPos, destination } = hero.getMovementAction()
      this.arena.moveHero(
        {
          row: currPos[0],
          col: currPos[1],
        },
        {
          row: destination[0],
          col: destination[1],
        }
      )
    })
  }

  public doEnemySkills(): any[] {
    const supportHeroes: CPUHero[] = this.enemyHeroes.filter(
      (hero: CPUHero) => hero.heroType === HeroType.SUPPORT
    )
    const skillActions: any[] = []
    supportHeroes.forEach((hero: CPUHero) => {
      const postMoveAction = hero.getPostMoveAction()
      if (postMoveAction) {
        skillActions.push({
          target: postMoveAction.target,
          user: postMoveAction.user,
          move: postMoveAction.data.move,
        })
      }
    })
    return skillActions
  }
  public doEnemyHeroAttacks(): any[] {
    const attackHeroes: CPUHero[] = this.enemyHeroes.filter(
      (hero: CPUHero) => hero.heroType === HeroType.ATTACKER
    )
    const attackActions: any[] = []
    attackHeroes.forEach((hero: CPUHero) => {
      const postMoveAction = hero.getPostMoveAction()
      if (postMoveAction) {
        attackActions.push({
          target: postMoveAction.target,
          attacker: postMoveAction.user,
        })
      }
    })
    return attackActions
  }
}
