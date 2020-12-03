import { MatchManager } from '../MatchManager'
import { HeroInMatch } from '../model/HeroInMatch'

export interface Move {
  name: string
  description: string
  range: number

  // Color to highlight squares around
  rangeHighlightColor: string

  processMove(user: HeroInMatch, target: HeroInMatch): void
  getAnimation(
    user: HeroInMatch,
    target: HeroInMatch,
    userColor: string,
    targetColor: string,
    userSide: string,
    onFinished: Function
  ): any

  // used to restrict which heroes can be targeted by the move. Some moves target allies, others target enemies
  isTargetValid(
    user: HeroInMatch,
    target: HeroInMatch,
    matchManager: MatchManager
  ): boolean
}
