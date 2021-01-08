import { HeroInMatch } from '../model/HeroInMatch'
import { PowerUp } from './PowerUp'
import * as React from 'react'
import { FontAwesome5 } from '@expo/vector-icons'

interface Props {
  onGetPowerUp: Function
}

export class HealthPowerUp extends PowerUp {
  constructor() {
    super()
    this.name = 'health'
  }

  public processEffect(hero: HeroInMatch): void {
    console.log('Healed: ' + hero.getHeroRef().name)
  }

  public getPowerUpSprite(): any {
    return <FontAwesome5 name='first-aid' size={24} color='red' />
  }

  public clone(): HealthPowerUp {
    return new HealthPowerUp()
  }
}
