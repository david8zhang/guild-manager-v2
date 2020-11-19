import { HeroInMatch } from '../model/HeroInMatch'
import { Move } from './Move'

export class HealMove implements Move {
  processMove(user: HeroInMatch, target: HeroInMatch) {}
}
