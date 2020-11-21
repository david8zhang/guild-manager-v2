import { MatchManager } from '../MatchManager'
import { HeroInMatch } from '../model/HeroInMatch'

export interface Move {
  name: string
  description: string
  range: number

  // Color to highlight squares around
  rangeHighlightColor: string

  processMove(user: HeroInMatch, target: HeroInMatch): void
}
