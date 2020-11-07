import * as React from 'react'
import { Text, View } from 'react-native'
import { CustomModal } from '../../../components'
import { HeroInMatch } from '../../../lib/model/HeroInMatch'

interface Props {
  isOpen: boolean
  onClose: Function
  targetToAttack: HeroInMatch
  playerHero: HeroInMatch
}

export const AttackMatchupModal: React.FC<Props> = ({
  isOpen,
  onClose,
  targetToAttack,
  playerHero,
}) => {
  if (!targetToAttack || !playerHero) {
    return <View />
  }
  return (
    <CustomModal
      customHeight={300}
      customWidth={500}
      isOpen={isOpen}
      onClose={() => onClose()}
    >
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1 }}>
          <Text>{playerHero.getHeroRef().name}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text>{targetToAttack.getHeroRef().name}</Text>
        </View>
      </View>
    </CustomModal>
  )
}
