import { Arena } from '../../model/Arena'
import { HeroInMatch } from '../../model/HeroInMatch'
import { ActionTypes, CPUBehavior } from '../CPUBehavior'

export class AttackCPUBehavior extends CPUBehavior {
  constructor(
    playerSpawnLocations: number[][],
    playerHeroes: HeroInMatch[],
    enemyHeroes: HeroInMatch[],
    arena: Arena,
    hero: HeroInMatch
  ) {
    super(playerSpawnLocations, playerHeroes, enemyHeroes, arena, hero)
  }

  getPlayerHeroWithLowestHealthPosition() {
    const playerHeroPositions: number[][] = this.arena
      .getPlayerHeroPositions()
      .filter((pos: number[]) => {
        const hero = this.arena.getHeroAtLocation(pos[0], pos[1])
        return hero && !hero.isDead && !hero.isUntargetable()
      })
    if (playerHeroPositions.length === 0) {
      return
    }
    return playerHeroPositions.reduce((acc, curr) => {
      const currHero = this.arena.getHeroAtLocation(curr[0], curr[1])
      const accHero = this.arena.getHeroAtLocation(acc[0], acc[1])
      if (currHero.getCurrHealth() < accHero.getCurrHealth()) {
        acc = curr
      }
      return acc
    }, playerHeroPositions[0])
  }

  getMovementAction(): { currPos: number[]; destination: number[] } {
    const currPos = this.arena.getHeroLocation(this.hero.getHeroRef().heroId)

    if (this.hero.isDead) {
      return {
        currPos,
        destination: currPos,
      }
    }

    const targetPosition = this.getPlayerHeroWithLowestHealthPosition()
    let closestSquareToPlayer = currPos
    if (targetPosition) {
      closestSquareToPlayer = this.getClosestSquareToTarget(targetPosition)
    }
    return {
      currPos,
      destination: closestSquareToPlayer,
    }
  }

  getPostMovementAction(): {
    target: any
    user: any
    actionType: ActionTypes
  } | null {
    if (this.hero.isDead) {
      return null
    }
    const currPos = this.arena.getHeroLocation(this.hero.getHeroRef().heroId)
    const attackRange = this.hero.getAttackRange()
    const attackableSquares = this.arena.getSquaresInRange(
      attackRange,
      currPos[0],
      currPos[1]
    )
    let heroToAttack: any = null

    attackableSquares.forEach((square: number[]) => {
      const target: HeroInMatch = this.arena.getHeroAtLocation(
        square[0],
        square[1]
      )
      // If the hero is attackable and is on the player's side
      if (this.isHeroAttackable(target) && this.isPlayerHero(target)) {
        // Get the target with the lowest current health
        if (
          !heroToAttack ||
          target.getCurrHealth() < heroToAttack.getCurrHealth()
        ) {
          heroToAttack = target
        }
      }
    })
    if (heroToAttack) {
      return {
        target: heroToAttack,
        user: this.hero,
        actionType: ActionTypes.ATTACK,
      }
    }
    return null
  }
}
