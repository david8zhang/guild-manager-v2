import { HeroFactory } from './HeroFactory'
import { Hero, HeroType } from '../model/Hero'

export class SupportHeroFactory extends HeroFactory {
  private static SUPPORT_MOVES = ['Heal', 'ATK Buff']

  getHeroes(numHeroes: number): Hero[] {
    const heroes: Hero[] = []
    for (let i = 0; i < numHeroes; i++) {
      const gender = super.generateRandomGender()
      const name = super.generateRandomName(gender)
      heroes.push(
        new Hero({
          heroType: HeroType.SUPPORT,
          heroId: super.generateRandomHeroId(),
          gender,
          name,
          attack: super.generateNumberWithinRange(
            this.minStat,
            this.maxStat - 10
          ),
          defense: super.generateNumberWithinRange(
            this.minStat,
            this.maxStat - 10
          ),
          magic: super.generateNumberWithinRange(70, 80),
          speed: super.generateNumberWithinRange(this.minStat, this.maxStat),
          health: super.generateNumberWithinRange(
            this.minHealth,
            this.maxHealth
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
