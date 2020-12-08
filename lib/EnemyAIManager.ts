import { ActionSheetIOS } from 'react-native'
import { CPUHero } from './enemyAI/CPUHero'
import { Arena } from './model/Arena'
import { HeroType } from './model/Hero'
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
    this.currEnemyToMove = 0
    this.haveAllHeroesMoved = false
    this.arena = config.arena
  }

  public resetEnemyMoves() {
    this.currEnemyToMove = 0
    this.haveAllHeroesMoved = false
  }

  public moveNextEnemyHero(): void {
    const enemyHero = this.enemyHeroes[this.currEnemyToMove]
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

  public doNextEnemyMove(): any {
    this.haveAllHeroesMoved =
      this.currEnemyToMove === this.enemyHeroes.length - 1
    const enemyHeroToMove = this.enemyHeroes[this.currEnemyToMove]
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
