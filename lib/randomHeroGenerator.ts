import { SupportHeroFactory } from './factory/SupportHeroFactory'
import { AttackerHeroFactory } from './factory/AttackerHeroFactory'

export class RandomHeroGenerator {
  static generateStarterHeroes(numHeroes: number) {
    const supportStarterFactory = new SupportHeroFactory(200, 150, 65, 80, {
      duration: 5,
      amount: 200,
    })
    const attackStarterFactory = new AttackerHeroFactory(200, 150, 65, 80, {
      duration: 5,
      amount: 200,
    })
    const supportStarters = supportStarterFactory.getHeroes(
      Math.floor(numHeroes / 2)
    )
    const attackStarters = attackStarterFactory.getHeroes(
      numHeroes - Math.floor(numHeroes / 2)
    )
    return [...supportStarters, ...attackStarters]
  }

  static generateReserveHeroes(numHeroes: number) {
    const supportReserveFactory = new SupportHeroFactory(150, 100, 55, 70, {
      duration: 5,
      amount: 200,
    })
    const attackReserveFactory = new AttackerHeroFactory(150, 100, 55, 70, {
      duration: 5,
      amount: 200,
    })
    const supportReserves = supportReserveFactory.getHeroes(
      Math.floor(numHeroes / 2)
    )
    const attackReserves = attackReserveFactory.getHeroes(
      numHeroes - Math.floor(numHeroes / 2)
    )
    return [...supportReserves, ...attackReserves]
  }
}
