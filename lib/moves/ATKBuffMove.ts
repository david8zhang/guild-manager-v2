import { HeroInMatch } from '../model/HeroInMatch'
import { Move } from './Move'

export class ATKBuffMove implements Move {
  processMove(user: HeroInMatch, target: HeroInMatch) {}
}
