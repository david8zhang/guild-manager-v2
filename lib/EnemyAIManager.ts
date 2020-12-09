import { BehaviorSelector } from './enemyAI/BehaviorSelector'
import { CPUHero } from './enemyAI/CPUHero'
import { Arena } from './model/Arena'
import { HeroInMatch } from './model/HeroInMatch'

interface EnemyAIManagerConfig {
  playerSpawnLocations: number[][]
  playerHeroes: HeroInMatch[]
  enemyHeroes: HeroInMatch[]
  arena: Arena
}

export class EnemyAIManager {
  public enemyHeroes: CPUHero[]
  public arena: Arena
  public currEnemyToMove: number
  public haveAllHeroesMoved: boolean

  constructor(config: EnemyAIManagerConfig) {
    this.enemyHeroes = config.enemyHeroes.map((hero: HeroInMatch) => {
      const behaviorSelector = new BehaviorSelector(
        config.playerSpawnLocations,
        config.arena,
        config.enemyHeroes,
        config.playerHeroes,
        hero
      )
      return new CPUHero(hero, behaviorSelector)
    })
    this.currEnemyToMove = 0
    this.haveAllHeroesMoved = false
    this.arena = config.arena
  }

  public resetEnemyMoves() {
    this.currEnemyToMove = 0
    this.haveAllHeroesMoved = false
  }

  public getNextHero() {
    return this.enemyHeroes[this.currEnemyToMove]
  }

  public moveNextEnemyHero(): void {
    const enemyHero = this.getNextHero()
    const { currPos, destination } = enemyHero.getMovementAction()
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
  }

  public setNextHeroBehavior(): void {
    const enemyHero = this.getNextHero()
    enemyHero.selectBehavior()
  }

  public doNextEnemyMove(): any {
    this.haveAllHeroesMoved =
      this.currEnemyToMove === this.enemyHeroes.length - 1
    const enemyHeroToMove = this.getNextHero()
    this.currEnemyToMove++
    const postMoveAction = enemyHeroToMove.getPostMoveAction()
    if (postMoveAction) {
      return {
        target: postMoveAction.target,
        user: postMoveAction.user,
        move: postMoveAction.data ? postMoveAction.data.move : null,
        actionType: postMoveAction.actionType,
      }
    }
    return null
  }
}
