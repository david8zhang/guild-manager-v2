import { ATKBuffMove } from './ATKBuffMove'
import { DEFBuffMove } from './DEFBuffMove'
import { HealMove } from './HealMove'

export const MoveMapper = {
  heal: HealMove,
  atkBuff: ATKBuffMove,
  defBuff: DEFBuffMove,
}
