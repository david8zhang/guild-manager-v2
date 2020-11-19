import { HeroInMatch } from '../model/HeroInMatch'

export interface Move {
  processMove(user: HeroInMatch, target: HeroInMatch): void
}
