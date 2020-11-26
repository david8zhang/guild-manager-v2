import * as React from 'react'
import { View } from 'react-native'
import { CustomModal } from '../../../components'
import { HeroInMatch } from '../../../lib/model/HeroInMatch'
import { AttackMatchupHero } from './AttackMatchupHero'

interface Props {
  isOpen: boolean
  onClose: Function
  hero: HeroInMatch
  color: string
}

export const HeroInArenaDetails: React.FC<Props> = ({
  isOpen,
  onClose,
  hero,
  color,
}) => {
  const heroRef = hero.getHeroRef()
  return (
    <CustomModal
      customHeight={300}
      customWidth={500}
      isOpen={isOpen}
      onClose={() => onClose()}
    >
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View style={{ flex: 1, maxWidth: '50%' }}>
          <AttackMatchupHero
            color={color}
            hero={hero}
            name={heroRef.name}
            health={heroRef.health}
            currHealth={hero.getCurrHealth()}
            predictedDamageTaken={0}
            imageOptions={{
              width: 95,
              height: 95,
            }}
          />
        </View>
      </View>
    </CustomModal>
  )
}
