import { RangedHeroFactory } from '../factory/RangedHeroFactory'
import { SuperstarFactory } from '../factory/SuperstarFactory'
import { SupportHeroFactory } from '../factory/SupportHeroFactory'
import { TankHeroFactory } from '../factory/TankHeroFactory'
import { RandomHeroGenerator } from './RandomHeroGenerator'

export class EnemyHeroGenerator extends RandomHeroGenerator {
  constructor() {
    const starterContract = {
      duration: 1,
      amount: 20,
    }

    const reserveContract = {
      duration: 1,
      amount: 5,
    }
    const factories = [
      SuperstarFactory,
      TankHeroFactory,
      RangedHeroFactory,
      SupportHeroFactory,
    ]
    super(factories, starterContract, reserveContract)
  }
}
