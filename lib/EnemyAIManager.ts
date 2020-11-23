import { Arena } from './model/Arena'
import { HeroType } from './model/Hero'
import { HeroInMatch } from './model/HeroInMatch'
import { Move } from './moves/Move'
import { MoveFactory } from './moves/MoveFactory'

export class EnemyAIManager {
  public static isHeroAttackable(hero: HeroInMatch): boolean {
    return hero && !hero.isDead && !hero.isUntargetable()
  }

  public static isHeroAlive(position: number[], arena: Arena) {
    const hero: HeroInMatch = arena.getHeroAtLocation(position[0], position[1])
    return hero && !hero.isDead
  }

  public static moveEnemyHeroes(
    arena: Arena,
    playerSpawnLocations: number[][]
  ) {
    const enemyHeroPositions: number[][] = arena.getEnemyHeroPositions()
    const playerHeroPositions: number[][] = arena.getPlayerHeroPositions()

    const livingEnemyHeroPositions = enemyHeroPositions.filter(
      (pos: number[]) => this.isHeroAlive(pos, arena)
    )
    livingEnemyHeroPositions.forEach((position) => {
      const hero: HeroInMatch = arena.getHeroAtLocation(
        position[0],
        position[1]
      )
      const range = hero.getMoveRange()
      const moveableSquares = arena.getSquaresInRange(
        range,
        position[0],
        position[1]
      )

      // If the hero is a support, get the closest allied hero.
      let closestSquareToTarget = position
      if (hero.getHeroRef().heroType === HeroType.SUPPORT) {
        const squareCandidate = this.getSquareClosestToAlliedHero(
          playerSpawnLocations,
          enemyHeroPositions,
          arena,
          moveableSquares,
          hero
        )
        if (squareCandidate) {
          closestSquareToTarget = squareCandidate
        }
      } else {
        const squareCandidate = this.getSquareClosestToPlayerHero(
          playerSpawnLocations,
          playerHeroPositions,
          arena,
          moveableSquares
        )
        if (squareCandidate) {
          closestSquareToTarget = squareCandidate
        }
      }

      // Target a random player and get the closest square within move range to the player's position
      arena.moveHero(
        {
          row: position[0],
          col: position[1],
        },
        {
          row: closestSquareToTarget[0],
          col: closestSquareToTarget[1],
        }
      )
    })
  }

  public static getSquareClosestToAlliedHero(
    playerSpawnLocations: number[][],
    enemyHeroPositions: number[][],
    arena: Arena,
    moveableSquares: number[][],
    currHero: HeroInMatch
  ) {
    const livingAlliedHeroPositions = enemyHeroPositions.filter(
      (position: number[]) => {
        const heroAtPos = arena.getHeroAtLocation(position[0], position[1])
        return (
          this.isHeroAlive(position, arena) &&
          heroAtPos.getHeroRef().heroId !== currHero.getHeroRef().heroId // exclude the current hero
        )
      }
    )

    // If all other allied heroes are dead
    if (livingAlliedHeroPositions.length === 0) {
      return null
    }

    const playerSpawnLocationStrings: string[] = playerSpawnLocations.map(
      (coord: number[]) => `${coord[0]},${coord[1]}`
    )
    const emptyMoveableSquares = moveableSquares.filter(
      (coordinate: number[]) => {
        return (
          !arena.getHeroAtLocation(coordinate[0], coordinate[1]) &&
          !playerSpawnLocationStrings.includes(
            `${coordinate[0]},${coordinate[1]}`
          )
        )
      }
    )

    // Get a random ally to target
    const randomAllyToTargetPosition =
      livingAlliedHeroPositions[
        Math.floor(Math.random() * livingAlliedHeroPositions.length)
      ]

    let closestSquareToTarget: number[] = []
    let runningDistance = Number.MAX_SAFE_INTEGER
    emptyMoveableSquares.forEach((coordinate: number[]) => {
      const currDistance = arena.getManhattanDistance(
        coordinate,
        randomAllyToTargetPosition
      )
      if (currDistance < runningDistance) {
        runningDistance = currDistance
        closestSquareToTarget = coordinate
      }
    })
    return closestSquareToTarget
  }

  public static getSquareClosestToPlayerHero(
    playerSpawnLocations: number[][],
    playerHeroPositions: number[][],
    arena: Arena,
    moveableSquares: number[][]
  ) {
    const livingPlayerHeroPositions = playerHeroPositions.filter(
      (pos: number[]) => this.isHeroAlive(pos, arena)
    )

    // If all heroes are dead, just stay where you are
    if (livingPlayerHeroPositions.length === 0) {
      return
    }

    // Filter out squares that are occupied or are part of the player's spawn locations
    const playerSpawnLocationStrings: string[] = playerSpawnLocations.map(
      (coord: number[]) => `${coord[0]},${coord[1]}`
    )
    const emptyMoveableSquares = moveableSquares.filter(
      (coordinate: number[]) => {
        return (
          !arena.getHeroAtLocation(coordinate[0], coordinate[1]) &&
          !playerSpawnLocationStrings.includes(
            `${coordinate[0]},${coordinate[1]}`
          )
        )
      }
    )

    // Get a random player hero to target
    // TODO: Better heuristic for determining which heroes to target
    const randomPlayerToTargetPosition =
      livingPlayerHeroPositions[
        Math.floor(Math.random() * livingPlayerHeroPositions.length)
      ]

    // Use manhattan distance to calculate the closest square
    let closestSquareToTarget: number[] = []
    let runningDistance = Number.MAX_SAFE_INTEGER
    emptyMoveableSquares.forEach((coordinate: number[]) => {
      const currDistance = arena.getManhattanDistance(
        coordinate,
        randomPlayerToTargetPosition
      )
      if (currDistance < runningDistance) {
        runningDistance = currDistance
        closestSquareToTarget = coordinate
      }
    })
    return closestSquareToTarget
  }

  public static doEnemySkills(
    playerHeroes: HeroInMatch[],
    enemyHeroes: HeroInMatch[],
    arena: Arena
  ) {
    const skillActions: any[] = []
    const enemyHeroPositions: number[][] = arena.getEnemyHeroPositions()
    const livingEnemyHeroPositions = enemyHeroPositions.filter(
      (position: number[]) => {
        const hero = arena.getHeroAtLocation(position[0], position[1])
        return hero && !hero.isDead
      }
    )
    livingEnemyHeroPositions.forEach((position: number[]) => {
      const hero: HeroInMatch = arena.getHeroAtLocation(
        position[0],
        position[1]
      )

      // Only use skills if the user has skills to use
      const moveNames: string[] = hero.getHeroRef().moveSet
      if (moveNames.length > 0) {
        const moveSet: any[] = moveNames.map((name: string) =>
          MoveFactory.getMove(name)
        )

        // Select a move to use based on what heroes it can affect in its range
        const moveToUseAndTarget = this.getMoveToUseAndTarget(
          moveSet,
          position,
          arena,
          playerHeroes
        )
        if (moveToUseAndTarget) {
          skillActions.push({
            target: moveToUseAndTarget.target,
            move: moveToUseAndTarget.move,
            user: hero,
          })
        }
      }
    })
    return skillActions
  }

  public static isPlayerHero(h: HeroInMatch, playerHeroes: HeroInMatch[]) {
    const playerHeroIds = playerHeroes.map(
      (hero: HeroInMatch) => hero.getHeroRef().heroId
    )
    return playerHeroIds.includes(h.getHeroRef().heroId)
  }

  public static getMoveToUseAndTarget(
    moveSet: Move[],
    position: number[],
    arena: Arena,
    playerHeroes: HeroInMatch[]
  ) {
    let result = null
    for (let i = 0; i < moveSet.length; i++) {
      const move = moveSet[i]
      const range = move.range
      const heroesInRange = this.getHeroesInRange(
        range,
        position[0],
        position[1],
        arena
      )

      // If there are any heroes that have missing health, heal the one with the lowest health.
      // Otherwise, use a buff

      // TODO: Right now, buff moves have not been implemented so only takes care of healing
      const alliesWithMissingHealth: HeroInMatch[] = heroesInRange.filter(
        (hero: HeroInMatch) => {
          return (
            hero.getCurrHealth() < hero.getHeroRef().health &&
            !hero.isDead &&
            !this.isPlayerHero(hero, playerHeroes)
          )
        }
      )

      if (alliesWithMissingHealth.length > 0) {
        if (move.name === 'Heal') {
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
            move,
          }
        }
      }
    }
    return result
  }

  public static getHeroesInRange(
    range: number,
    row: number,
    col: number,
    arena: Arena
  ): HeroInMatch[] {
    const squaresInRange: number[][] = arena.getSquaresInRange(range, row, col)
    const heroesInRange: HeroInMatch[] = []
    squaresInRange.forEach((position: number[]) => {
      const hero = arena.getHeroAtLocation(position[0], position[1])
      if (hero) {
        heroesInRange.push(hero)
      }
    })
    return heroesInRange
  }

  public static doEnemyHeroAttacks(playerHeroes: HeroInMatch[], arena: Arena) {
    const attackActions: any[] = []
    const enemyHeroPositions: number[][] = arena.getEnemyHeroPositions()
    const livingEnemyHeroPositions = enemyHeroPositions.filter(
      (position: number[]) => {
        const hero = arena.getHeroAtLocation(position[0], position[1])
        return hero && !hero.isDead
      }
    )
    livingEnemyHeroPositions.forEach((position: number[]) => {
      const hero: HeroInMatch = arena.getHeroAtLocation(
        position[0],
        position[1]
      )
      const range = hero.getAttackRange()
      const attackableSquares = arena.getSquaresInRange(
        range,
        position[0],
        position[1]
      )
      let heroToAttack: any = null

      attackableSquares.forEach((square: number[]) => {
        const target: HeroInMatch = arena.getHeroAtLocation(
          square[0],
          square[1]
        )
        // If the hero is attackable and is on the player's side
        if (
          this.isHeroAttackable(target) &&
          this.isPlayerHero(target, playerHeroes)
        ) {
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
        attackActions.push({
          target: heroToAttack,
          attacker: hero,
        })
      }
    })
    return attackActions
  }
}
