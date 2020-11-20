import { HeroInMatch } from '../model/HeroInMatch'

export interface Move {
  name: string
  description: string
  range: number
  processMove(user: HeroInMatch, target: HeroInMatch): void
}
