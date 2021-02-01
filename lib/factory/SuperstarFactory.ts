import { Hero, HeroType } from '../model/Hero'
import { HeroFactory } from './HeroFactory'

export class SuperstarFactory extends HeroFactory {
  private static MOVES: any = {
    [HeroType.SUPPORT]: ['Heal', 'ATK Buff', 'DEF Buff'],
  }

  private heroTypeStats: any = {
    [HeroType.SUPPORT]: ['magic'],
    [HeroType.TANK]: ['health', 'defense'],
    [HeroType.RANGER]: ['attack', 'speed'],
  }

  private heroAttackRange: any = {
    [HeroType.SUPPORT]: 2,
    [HeroType.TANK]: 2,
    [HeroType.RANGER]: 4,
  }

  generateStat(heroType: HeroType, stat: string) {
    let minStat = this.minStat
    let maxStat = this.maxStat
    let minHealth = this.minHealth
    let maxHealth = this.maxHealth
    if (this.heroTypeStats[heroType].includes(stat)) {
      minStat = 80
      maxStat = 99
      minHealth = 200
      maxHealth = 300
    }
    return stat === 'health'
      ? super.generateNumberWithinRange(minHealth, maxHealth)
      : super.generateNumberWithinRange(minStat, maxStat)
  }

  getHeroes(numHeroes: number): Hero[] {
    const heroes: Hero[] = []

    const heroTypes = [HeroType.RANGER, HeroType.SUPPORT, HeroType.TANK]

    for (let i = 0; i < numHeroes; i++) {
      const gender = super.generateRandomGender()
      const name = super.generateRandomName(gender)
      const heroType = heroTypes[Math.floor(Math.random() * heroTypes.length)]

      heroes.push(
        new Hero({
          attackRange: this.heroAttackRange[heroType],
          heroType,
          heroId: super.generateRandomHeroId(),
          age: super.generateRandomAge(),
          gender,
          name,
          attack: this.generateStat(heroType, 'attack'),
          defense: this.generateStat(heroType, 'defense'),
          magic: this.generateStat(heroType, 'magic'),
          speed: this.generateStat(heroType, 'speed'),
          health: this.generateStat(heroType, 'health'),
          potential: super.generateNumberWithinRange(this.minPotential, 3),
          contract: { ...this.contract },
          moveSet: this.getRandomMovePool(SuperstarFactory.MOVES[heroType]),
          heroImageData: super.generateRandomHeroImage(gender),
        })
      )
    }
    return heroes
  }
}
