import { HeroInMatch } from '../model/HeroInMatch'
import { Move } from './Move'

export class ATKBuffMove implements Move {
  public name: string
  public description: string
  public range: number
  public rangeHighlightColor: string

  constructor() {
    this.name = 'ATK Buff'
    this.description =
      'Apply ATK increase by some percentage for 2 turns. Percentage increase scales with MGK attribute. Can stack this effect.'
    this.range = 2
    this.rangeHighlightColor = 'green'
  }
  processMove(user: HeroInMatch, target: HeroInMatch) {}
}
