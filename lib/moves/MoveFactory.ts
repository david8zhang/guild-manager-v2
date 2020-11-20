import { ATKBuffMove } from './ATKBuffMove'
import { DEFBuffMove } from './DEFBuffMove'
import { HealMove } from './HealMove'
import { Move } from './Move'

export class MoveFactory {
  static getMove(name: string): Move | null {
    switch (name) {
      case 'Heal':
        return new HealMove()
      case 'ATK Buff':
        return new ATKBuffMove()
      case 'DEF Buff':
        return new DEFBuffMove()
    }
    return null
  }
}
