import { HeroInMatch } from './HeroInMatch'

export class Arena {
  private static WIDTH = 6
  private static HEIGHT = 4
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

  public initializeArena(): void {
    let playerHeroesIndex: number = 0
    let enemyHeroesIndex: number = 0

    // Initialize player heroes on the left side of the map
    for (let i = 0; i < Arena.WIDTH / 2; i++) {
      for (let j = 0; j < Arena.HEIGHT; j++) {
        if (playerHeroesIndex < this.playerHeroes.length) {
          this.map[`${i},${j}`] = this.playerHeroes[playerHeroesIndex++]
        }
      }
    }

    // Initialize enemy heroes on the right side of the map
    for (let i = Arena.WIDTH - 1; i >= 0; i--) {
      for (let j = 0; j < Arena.HEIGHT; j++) {
        if (enemyHeroesIndex < this.enemyHeroes.length) {
          this.map[`${i}-${j}`] = this.enemyHeroes[enemyHeroesIndex++]
        }
      }
    }
  }
}
