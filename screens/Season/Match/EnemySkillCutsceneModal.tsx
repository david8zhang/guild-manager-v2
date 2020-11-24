import * as React from 'react'
import { View } from 'react-native'
import { CustomModal } from '../../../components'
import { MatchManager } from '../../../lib/MatchManager'
import { HeroInMatch } from '../../../lib/model/HeroInMatch'
import { Move } from '../../../lib/moves/Move'

interface Props {
  isOpen: boolean
  onContinue: Function
  skillAction: {
    user: HeroInMatch
    target: HeroInMatch
    move: Move
  }
  matchManager: MatchManager
}

export const EnemySkillCutsceneModal: React.FC<Props> = ({
  isOpen,
  onContinue,
  skillAction,
  matchManager,
}) => {
  if (!skillAction || !isOpen) {
    return <View />
  }
  const { move, user, target } = skillAction
  return (
    <CustomModal
      customHeight={300}
      customWidth={500}
      isOpen={isOpen}
      onClose={() => {}}
      hideCloseButton
    >
      {move.getAnimation(user, target, 'right', onContinue)}
    </CustomModal>
  )
}
