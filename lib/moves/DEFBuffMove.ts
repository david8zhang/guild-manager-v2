import { MatchManager } from '../MatchManager'
import { HeroInMatch } from '../model/HeroInMatch'
import { Move } from './Move'

export class DEFBuffMove implements Move {
  public name: string
  public description: string
  public range: number
  public rangeHighlightColor: string

  constructor() {
    this.name = 'DEF Buff'
    this.description =
      'Apply DEF increase by some percentage for 2 turns. Percentage increase scales with MGK attribute. Can stack this effect.'
    this.range = 2
    this.rangeHighlightColor = 'green'
  }
  processMove(user: HeroInMatch, target: HeroInMatch) {}
  getAnimation(user: HeroInMatch, target: HeroInMatch, side: string) {}
  isTargetValid(
    user: HeroInMatch,
    target: HeroInMatch,
    matchManager: MatchManager
  ): boolean {
    return true
  }
}
