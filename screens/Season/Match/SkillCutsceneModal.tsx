import * as React from 'react'
import { View } from 'react-native'
import { CustomModal } from '../../../components'
import { HeroInMatch } from '../../../lib/model/HeroInMatch'
import { Move } from '../../../lib/moves/Move'

interface Props {
  isOpen: boolean
  skill: Move
  userHero: HeroInMatch
  targetHero: HeroInMatch
  userSide: string
  onClose: Function
}

export const SkillCutsceneModal: React.FC<Props> = ({
  isOpen,
  skill,
  userHero,
  targetHero,
  userSide,
  onClose,
}) => {
  return (
    <CustomModal
      customHeight={300}
      customWidth={500}
      hideCloseButton
      isOpen={isOpen}
      onClose={() => {}}
    >
      {skill.getAnimation(userHero, targetHero, userSide, onClose)}
    </CustomModal>
  )
}
