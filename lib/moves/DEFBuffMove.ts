import { HeroInMatch } from '../model/HeroInMatch'
import { Move } from './Move'

export class DEFBuffMove implements Move {
  public name: string
  public description: string
  public range: number

  constructor() {
    this.name = 'DEF Buff'
    this.description = 'Description for defense buff'
    this.range = 2
  }
  processMove(user: HeroInMatch, target: HeroInMatch) {}
}
