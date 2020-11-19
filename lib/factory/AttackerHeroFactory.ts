import { Hero } from '../model/Hero'
import { HeroFactory } from './HeroFactory'

export class AttackerHeroFactory extends HeroFactory {
  private static MOVES = []
  constructor(
    minHealth: number,
    maxHealth: number,
    minStat: number,
    maxStat: number,
    contract: {
      duration: number
      amount: number
    }
  ) {
    super(minHealth, maxHealth, minStat, maxStat, contract)
  }

  getHeroes(numHeroes: number): Hero[] {
    const heroes: Hero[] = []
    for (let i = 0; i < numHeroes; i++) {
      const gender = super.generateRandomGender()
      const name = super.generateRandomName(gender)
      heroes.push(
        new Hero({
          heroId: super.generateRandomHeroId(),
          gender,
          name,
          attack: super.generateNumberWithinRange(this.minStat, this.maxStat),
          defense: super.generateNumberWithinRange(this.minStat, this.maxStat),
          magic: super.generateNumberWithinRange(
            this.minStat,
            this.maxStat - 10
          ),
          speed: super.generateNumberWithinRange(this.minStat, this.maxStat),
          health: super.generateNumberWithinRange(
            this.minHealth,
            this.maxHealth
          ),
          potential: super.generateNumberWithinRange(1, 3),
          contract: { ...this.contract },
          moveSet: this.getRandomMovePool(AttackerHeroFactory.MOVES),
        })
      )
    }
    return heroes
  }
}
