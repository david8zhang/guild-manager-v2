import { HeroFactory } from './HeroFactory'
import { Hero, HeroType } from '../model/Hero'

export class SupportHeroFactory extends HeroFactory {
  private static SUPPORT_MOVES = ['Heal', 'ATK Buff', 'DEF Buff']

  getHeroes(numHeroes: number): Hero[] {
    const heroes: Hero[] = []
    for (let i = 0; i < numHeroes; i++) {
      const gender = super.generateRandomGender()
      const name = super.generateRandomName(gender)
      heroes.push(
        new Hero({
          heroType: HeroType.SUPPORT,
          heroId: super.generateRandomHeroId(),
          age: super.generateRandomAge(),
          gender,
          name,
          attack: super.generateNumberWithinRange(
            this.minStat - 5,
            this.maxStat - 5
          ),
          defense: super.generateNumberWithinRange(
            this.minStat - 10,
            this.maxStat - 10
          ),
          magic: super.generateNumberWithinRange(
            this.minStat + 10,
            this.maxStat + 10
          ),
          speed: super.generateNumberWithinRange(this.minStat, this.maxStat),
          health: super.generateNumberWithinRange(
            this.minHealth - 25,
            this.maxHealth - 25
          ),
          potential: super.generateNumberWithinRange(this.minPotential, 3),
          contract: { ...this.contract },
          moveSet: this.getRandomMovePool(SupportHeroFactory.SUPPORT_MOVES),
          heroImageData: super.generateRandomHeroImage(gender),
        })
      )
    }
    return heroes
  }
}
