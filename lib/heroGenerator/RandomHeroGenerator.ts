import { SupportHeroFactory } from '../factory/SupportHeroFactory'
import { TankHeroFactory } from '../factory/TankHeroFactory'
import { RangedHeroFactory } from '../factory/RangedHeroFactory'
import { Hero } from '../model/Hero'

export class RandomHeroGenerator {
  private factories: any[] = [
    SupportHeroFactory,
    TankHeroFactory,
    RangedHeroFactory,
  ]
  constructor(factories?: any[]) {
    if (factories) {
      this.factories = factories
    }
  }

  generateStarterHeroes(numHeroes: number) {
    const minStat = 69
    const maxStat = 80

    let heroes: Hero[] = []
    for (let i = 0; i < numHeroes; i++) {
      const RandomHeroFactory = this.factories[
        Math.floor(Math.random() * this.factories.length)
      ]
      const factory = new RandomHeroFactory({
        minStat,
        maxStat,
        contract: {
          duration: 1,
          amount: 20,
        },
      })
      heroes = heroes.concat(factory.getHeroes(1))
    }
    return heroes
  }

  generateReserveHeroes(numHeroes: number) {
    const defaultContract = {
      duration: 1,
      amount: 5,
    }
    const minStat = 59
    const maxStat = 70
    const minPotential = 2

    let heroes: Hero[] = []
    for (let i = 0; i < numHeroes; i++) {
      const RandomHeroFactory = this.factories[
        Math.floor(Math.random() * this.factories.length)
      ]
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
