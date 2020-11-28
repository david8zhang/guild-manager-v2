import { Arena } from '../../model/Arena'
import { HeroInMatch } from '../../model/HeroInMatch'
import { Move } from '../../moves/Move'
import { MoveFactory } from '../../moves/MoveFactory'
import { ActionTypes, CPUBehavior } from '../CPUBehavior'

export class SupportCPUBehavior extends CPUBehavior {
  constructor(
    playerSpawnLocations: number[][],
    playerHeroes: HeroInMatch[],
    enemyHeroes: HeroInMatch[],
    arena: Arena,
    hero: HeroInMatch
  ) {
    super(playerSpawnLocations, playerHeroes, enemyHeroes, arena, hero)
  }

  // This will always move the CPU hero towards an ally with the lowest health
  getAlliedPlayerPosition(): number[] | null {
    const livingAlliedHeroPositions = this.arena
      .getEnemyHeroPositions()
      .filter((pos: number[]) => {
        const hero = this.arena.getHeroAtLocation(pos[0], pos[1])
        return (
          !hero.isDead &&
          !this.isPlayerHero(hero) &&
          hero.getHeroRef().heroId !== this.hero.getHeroRef().heroId
        )
      })
    if (livingAlliedHeroPositions.length === 0) {
      return null
    }
    return livingAlliedHeroPositions.reduce((acc, curr) => {
      const accHero = this.arena.getHeroAtLocation(acc[0], acc[1])
      const currHero = this.arena.getHeroAtLocation(curr[0], curr[1])
      if (accHero.getCurrHealth() < currHero.getCurrHealth()) {
        acc = curr
      }
      return acc
    }, livingAlliedHeroPositions[0])
  }

  getMovementAction(): { currPos: number[]; destination: number[] } {
    const currPos = this.arena.getHeroLocation(this.hero.getHeroRef().heroId)
    if (this.hero.isDead) {
      return {
        currPos,
        destination: currPos,
      }
    }
    const alliedHeroPos = this.getAlliedPlayerPosition()
    let closestSquareToAlly = currPos

    if (alliedHeroPos) {
      closestSquareToAlly = this.getClosestSquareToTarget(alliedHeroPos)
    }
    return {
      currPos,
      destination: closestSquareToAlly,
    }
  }

  getPostMovementAction() {
    const { moveSet } = this.hero.getHeroRef()
    const currPos = this.arena.getHeroLocation(this.hero.getHeroRef().heroId)

    if (this.hero.isDead) {
      return null
    }

    if (moveSet.includes('Heal')) {
      const healMove = MoveFactory.getMove('Heal') as Move
      const heroesInRange = this.getHeroesInRange(
        healMove.range,
        currPos[0],
        currPos[1]
      ).filter((h: HeroInMatch) => !h.isDead && !this.isPlayerHero(h))
      const alliesWithMissingHealth: HeroInMatch[] = heroesInRange.filter(
        (hero: HeroInMatch) => {
          return (
            hero.getCurrHealth() < hero.getHeroRef().health &&
            !hero.isDead &&
            !this.isPlayerHero(hero)
          )
        }
      )
      if (alliesWithMissingHealth.length > 0) {
        const heroWithLowestHealth: HeroInMatch = alliesWithMissingHealth.reduce(
          (acc, curr) => {
            if (acc.getCurrHealth() < curr.getCurrHealth()) {
              acc = curr
            }
            return acc
          },
          alliesWithMissingHealth[0]
        )
        return {
          target: heroWithLowestHealth,
          user: this.hero,
          actionType: ActionTypes.SKILL,
          data: {
            move: healMove,
          },
        }
      }
    }

    // use a random buff move on a random friendly hero
    const buffMoves = moveSet.filter((move: string) => move !== 'Heal')
    if (buffMoves.length === 0) {
      return null
    }

    const randomMove: Move = MoveFactory.getMove(
      buffMoves[Math.floor(Math.random() * buffMoves.length)]
    ) as Move
    const heroesInRange = this.getHeroesInRange(
      randomMove.range,
      currPos[0],
      currPos[1]
    ).filter(
      (h: HeroInMatch) =>
        !h.isDead &&
        !this.isPlayerHero(h) &&
        h.getHeroRef().heroId !== this.hero.getHeroRef().heroId
    )

    if (heroesInRange.length === 0) {
      return null
    }

    return {
      target: heroesInRange[Math.floor(Math.random() * heroesInRange.length)],
      user: this.hero,
      actionType: ActionTypes.SKILL,
      data: {
        move: randomMove,
      },
    }
  }
}
