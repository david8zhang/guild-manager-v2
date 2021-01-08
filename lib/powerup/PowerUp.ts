import { HeroInMatch } from '../model/HeroInMatch'

export abstract class PowerUp {
  public name: string = ''
  public onGetPowerUp: Function = () => {}

  abstract processEffect(hero: HeroInMatch): void
  abstract getPowerUpSprite(): any
  abstract clone(): PowerUp
}
