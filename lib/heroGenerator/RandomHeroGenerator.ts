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
  private starterContract: any = {
    duration: 1,
    amount: 20,
  }

  private reserveContract: any = {
    duration: 1,
    amount: 5,
  }
  constructor(factories?: any[], starterContract?: any, reserveContract?: any) {
    if (factories) {
      this.factories = factories
    }
    if (starterContract) {
      this.starterContract = starterContract
    }

    if (reserveContract) {
      this.reserveContract = reserveContract
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
        contract: this.starterContract,
      })
      heroes = heroes.concat(factory.getHeroes(1))
    }
    return heroes
  }

  generateReserveHeroes(numHeroes: number) {
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
        contract: this.reserveContract,
      })
      heroes = heroes.concat(factory.getHeroes(1))
    }
    return heroes
  }

  generateAnyHeroType(
    numHeroes: number,
    minStat: number,
    maxStat: number,
    minPotential: number
  ) {
    let heroes: Hero[] = []
    for (let i = 0; i < numHeroes; i++) {
      const RandomHeroFactory = this.factories[
        Math.floor(Math.random() * this.factories.length)
      ]
      const factory = new RandomHeroFactory({
        minStat,
        maxStat,
        minPotential,
        contract: this.reserveContract,
      })
      heroes = heroes.concat(factory.getHeroes(1))
    }
    return heroes
  }
}
