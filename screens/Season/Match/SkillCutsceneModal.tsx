import * as React from 'react'
import { View } from 'react-native'
import { CustomModal } from '../../../components'
import { MatchManager } from '../../../lib/MatchManager'
import { HeroInMatch } from '../../../lib/model/HeroInMatch'
import { Move } from '../../../lib/moves/Move'

interface Props {
  isOpen: boolean
  skill: Move
  userHero: HeroInMatch
  targetHero: HeroInMatch
  userSide: string
  onClose: Function
  matchManager: MatchManager
}

export const SkillCutsceneModal: React.FC<Props> = ({
  isOpen,
  skill,
  userHero,
  targetHero,
  userSide,
  onClose,
  matchManager,
}) => {
  const playerColor = matchManager.getPlayerTeamInfo().color
  const enemyColor = matchManager.getEnemyTeamInfo().color
  return (
    <CustomModal
      customHeight={300}
      customWidth={500}
      hideCloseButton
      isOpen={isOpen}
      onClose={() => {}}
    >
      {skill.getAnimation(
        userHero,
        targetHero,
        playerColor,
        playerColor,
        userSide,
        onClose
      )}
    </CustomModal>
  )
}
