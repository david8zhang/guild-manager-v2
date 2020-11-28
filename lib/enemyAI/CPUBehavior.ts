import { Arena } from '../model/Arena'
import { HeroInMatch } from '../model/HeroInMatch'

export enum ActionTypes {
  ATTACK = 'attack',
  SKILL = 'skill',
}

export abstract class CPUBehavior {
  constructor(
    public playerSpawnLocations: number[][],
    public playerHeroes: HeroInMatch[],
    public enemyHeroes: HeroInMatch[],
    public arena: Arena,
    public hero: HeroInMatch
  ) {}

  public isHeroAttackable(hero: HeroInMatch): boolean {
    return hero && !hero.isDead && !hero.isUntargetable()
  }

  public isHeroAlive(position: number[]) {
    const hero: HeroInMatch = this.arena.getHeroAtLocation(
      position[0],
      position[1]
    )
    return hero && !hero.isDead
  }

  public isPlayerHero(h: HeroInMatch) {
    const playerHeroIds = this.playerHeroes.map(
      (hero: HeroInMatch) => hero.getHeroRef().heroId
    )
    return playerHeroIds.includes(h.getHeroRef().heroId)
  }

  public getHeroesInRange(
    range: number,
    row: number,
    col: number
  ): HeroInMatch[] {
    const squaresInRange: number[][] = this.arena.getSquaresInRange(
      range,
      row,
      col
    )
    const heroesInRange: HeroInMatch[] = []
    squaresInRange.forEach((position: number[]) => {
      const hero = this.arena.getHeroAtLocation(position[0], position[1])
      if (hero) {
        heroesInRange.push(hero)
      }
    })
    return heroesInRange
  }

  public getMoveableSquares() {
    const range = this.hero.getMoveRange()
    const position = this.arena.getHeroLocation(this.hero.getHeroRef().heroId)
    return this.arena.getSquaresInRange(range, position[0], position[1])
  }

  public getClosestSquareToTarget(targetPosition: number[]) {
    // Filter out squares that are occupied or are part of the player's spawn locations
    const moveableSquares = this.getMoveableSquares()
    const playerSpawnLocationStrings: string[] = this.playerSpawnLocations.map(
      (coord: number[]) => `${coord[0]},${coord[1]}`
    )
    const emptyMoveableSquares = moveableSquares.filter(
      (coordinate: number[]) => {
        return (
          !this.arena.getHeroAtLocation(coordinate[0], coordinate[1]) &&
          !playerSpawnLocationStrings.includes(
            `${coordinate[0]},${coordinate[1]}`
          )
        )
      }
    )

    // Use manhattan distance to calculate the closest square
    let closestSquareToTarget: number[] = []
    let runningDistance = Number.MAX_SAFE_INTEGER
    emptyMoveableSquares.forEach((coordinate: number[]) => {
      const currDistance = this.arena.getManhattanDistance(
        coordinate,
        targetPosition
      )
      if (currDistance < runningDistance) {
        runningDistance = currDistance
        closestSquareToTarget = coordinate
      }
    })
    return closestSquareToTarget
  }

  // Get a movement action
  abstract getMovementAction(): { currPos: number[]; destination: number[] }

  // Get an action after moving the hero
  abstract getPostMovementAction(): {
    target: HeroInMatch
    user: HeroInMatch
    actionType: ActionTypes
    data?: any
  } | null
}
