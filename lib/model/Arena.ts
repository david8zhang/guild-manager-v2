import { HeroInMatch } from './HeroInMatch'

export class Arena {
  public static NUM_COLS = 6
  public static NUM_ROWS = 5
  public map: {
    [key: string]: HeroInMatch
  }
  private enemyHeroes: HeroInMatch[]
  private playerHeroes: HeroInMatch[]

  constructor(playerHeroes: HeroInMatch[], enemyHeroes: HeroInMatch[]) {
    this.playerHeroes = playerHeroes
    this.enemyHeroes = enemyHeroes
    this.map = {}
  }

  public getMap(): { [key: string]: HeroInMatch } {
    return this.map
  }

  public initializeArena(): void {
    let playerHeroesIndex: number = 0
    let enemyHeroesIndex: number = 0

    // Initialize player heroes on the left side of the map
    for (let i = 1; i < Arena.NUM_ROWS; i++) {
      if (playerHeroesIndex < this.playerHeroes.length) {
        this.map[`${i},0`] = this.playerHeroes[playerHeroesIndex++]
      }
    }

    // Initialize enemy heroes on the right side of the map
    for (let i = 1; i < Arena.NUM_ROWS; i++) {
      if (enemyHeroesIndex < this.enemyHeroes.length) {
        this.map[`${i},${Arena.NUM_COLS - 1}`] = this.enemyHeroes[
          enemyHeroesIndex++
        ]
      }
    }
  }
}
