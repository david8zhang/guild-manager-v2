import { MatchManager } from '../MatchManager'
import { HeroInMatch } from '../model/HeroInMatch'

export abstract class PowerUp {
  public name: string = ''
  public currPosition: number[] = []
  public onGetPowerUp: Function = () => {}

  abstract processEffect(hero: HeroInMatch): void
  abstract getPowerUpSprite(
    hasConfirmedMove: boolean,
    allHeroPositions: number[][],
    matchManager: MatchManager
  ): any
  abstract clone(position: number[]): PowerUp
}
