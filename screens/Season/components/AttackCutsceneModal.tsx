import * as React from 'react'
import { Text, View } from 'react-native'
import { CustomModal } from '../../../components'
import { Hero } from '../../../lib/model/Hero'
import { HeroInMatch } from '../../../lib/model/HeroInMatch'

interface Props {
  isOpen: boolean
  onClose: Function
  targetHero: HeroInMatch
  playerHero: HeroInMatch
}

export const AttackCutsceneModal: React.FC<Props> = ({
  isOpen,
  onClose,
  targetHero,
  playerHero,
}) => {
  if (!isOpen) {
    return <View />
  }
  const playerHeroRef: Hero = playerHero.getHeroRef()
  const targetHeroRef: Hero = targetHero.getHeroRef()
  React.useEffect(() => {
    setTimeout(() => {
      onClose()
    }, 5000)
  }, [])
  return (
    <CustomModal
      customHeight={300}
      customWidth={500}
      onClose={() => {
        onClose()
      }}
      isOpen={isOpen}
    >
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1 }}>
          <Text>{playerHeroRef.name}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text>{targetHeroRef.name}</Text>
        </View>
      </View>
    </CustomModal>
  )
}
