import { HeroInMatch } from '../model/HeroInMatch'
import { Move } from './Move'

export class HealMove implements Move {
  public name: string
  public description: string
  public range: number
  public rangeHighlightColor: string

  constructor() {
    this.name = 'Heal'
    this.description =
      'Heal an allied hero for a fixed amount. Heal amount scales with the MGK attribute'
    this.range = 2
    this.rangeHighlightColor = 'green'
  }
  processMove(user: HeroInMatch, target: HeroInMatch) {}
}
