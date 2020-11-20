import { HeroInMatch } from '../model/HeroInMatch'
import { Move } from './Move'

export class HealMove implements Move {
  public name: string
  public description: string
  public range: number

  constructor() {
    this.name = 'Heal'
    this.description = 'Description for heal'
    this.range = 2
  }
  processMove(user: HeroInMatch, target: HeroInMatch) {}
}
