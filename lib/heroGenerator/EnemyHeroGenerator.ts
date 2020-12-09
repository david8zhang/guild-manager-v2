import { RangedHeroFactory } from '../factory/RangedHeroFactory'
import { SuperstarFactory } from '../factory/SuperstarFactory'
import { SupportHeroFactory } from '../factory/SupportHeroFactory'
import { TankHeroFactory } from '../factory/TankHeroFactory'
import { RandomHeroGenerator } from './RandomHeroGenerator'

export class EnemyHeroGenerator extends RandomHeroGenerator {
  constructor() {
    const factories = [
      SuperstarFactory,
      TankHeroFactory,
      RangedHeroFactory,
      SupportHeroFactory,
    ]
    super(factories)
  }
}
