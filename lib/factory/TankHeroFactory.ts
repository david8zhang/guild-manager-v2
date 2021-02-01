import { Hero, HeroType } from '../model/Hero'
import { HeroFactory } from './HeroFactory'

export class TankHeroFactory extends HeroFactory {
  private static MOVES = []

  getHeroes(numHeroes: number): Hero[] {
    const heroes: Hero[] = []
    for (let i = 0; i < numHeroes; i++) {
      const gender = super.generateRandomGender()
      const name = super.generateRandomName(gender)
      heroes.push(
        new Hero({
          heroType: HeroType.TANK,
          heroId: super.generateRandomHeroId(),
          age: super.generateRandomAge(),
          gender,
          name,
          attack: super.generateNumberWithinRange(
            this.minStat - 10,
            this.maxStat - 10
          ),
          defense: super.generateNumberWithinRange(
            this.minStat + 5,
            this.maxStat + 5
          ),
          magic: super.generateNumberWithinRange(
            this.minStat,
            this.maxStat - 10
          ),
          speed: super.generateNumberWithinRange(this.minStat, this.maxStat),
          health: super.generateNumberWithinRange(
            this.minHealth + 25,
            this.maxHealth + 25
          ),
          potential: super.generateNumberWithinRange(this.minPotential, 3),
          contract: { ...this.contract },
          moveSet: this.getRandomMovePool(TankHeroFactory.MOVES),
          heroImageData: super.generateRandomHeroImage(gender),
        })
      )
    }
    return heroes
  }
}
