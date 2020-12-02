import { SupportHeroFactory } from './factory/SupportHeroFactory'
import { TankHeroFactory } from './factory/TankHeroFactory'
import { RangedHeroFactory } from './factory/RangedHeroFactory'
import { Hero } from './model/Hero'

const factories = [SupportHeroFactory, TankHeroFactory, RangedHeroFactory]

export class RandomHeroGenerator {
  static generateStarterHeroes(numHeroes: number) {
    const minStat = 69
    const maxStat = 80

    let heroes: Hero[] = []
    for (let i = 0; i < numHeroes; i++) {
      const RandomHeroFactory =
        factories[Math.floor(Math.random() * factories.length)]
      const factory = new RandomHeroFactory({
        minStat,
        maxStat,
        contract: {
          duration: 5,
          amount: 200,
        },
      })
      heroes = heroes.concat(factory.getHeroes(1))
    }
    return heroes
  }

  static generateReserveHeroes(numHeroes: number) {
    const defaultContract = {
      duration: 5,
      amount: 50,
    }
    const minStat = 59
    const maxStat = 70
    const minPotential = 2

    let heroes: Hero[] = []
    for (let i = 0; i < numHeroes; i++) {
      const RandomHeroFactory =
        factories[Math.floor(Math.random() * factories.length)]
      const factory = new RandomHeroFactory({
        minStat,
        maxStat,
        minPotential,
        contract: defaultContract,
      })
      heroes = heroes.concat(factory.getHeroes(1))
    }
    return heroes
  }
}
