import { HeroInMatch } from '../model/HeroInMatch'
import { Move } from './Move'

export class ATKBuffMove implements Move {
  public name: string
  public description: string
  public range: number
  constructor() {
    this.name = 'ATK Buff'
    this.description = 'Description for attack buff'
    this.range = 2
  }
  processMove(user: HeroInMatch, target: HeroInMatch) {}
}
