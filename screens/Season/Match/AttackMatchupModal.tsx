import * as React from 'react'
import { Text, View } from 'react-native'
import { Button, CustomModal } from '../../../components'
import { Hero } from '../../../lib/model/Hero'
import { HeroInMatch } from '../../../lib/model/HeroInMatch'
import { AttackMatchupHero } from './AttackMatchupHero'

interface Props {
  isOpen: boolean
  onClose: Function
  targetToAttack: HeroInMatch
  playerHero: HeroInMatch
  onAttack: Function
  playerColor: string
  enemyColor: string
}

export const AttackMatchupModal: React.FC<Props> = ({
  isOpen,
  onClose,
  targetToAttack,
  playerHero,
  onAttack,
  playerColor,
  enemyColor,
}) => {
  if (!targetToAttack || !playerHero) {
    return <View />
  }
  const targetHeroRef: Hero = targetToAttack.getHeroRef()
  const playerHeroRef: Hero = playerHero.getHeroRef()

  const playerHeroDamageTaken: number = targetToAttack.calculateDamage(
    playerHero
  )
  const targetHeroDamageTaken: number = playerHero.calculateDamage(
    targetToAttack
  )

  return (
    <CustomModal
      customHeight={320}
      customWidth={500}
      isOpen={isOpen}
      onClose={() => onClose()}
    >
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <View style={{ flex: 1 }}>
          <AttackMatchupHero
            color={playerColor}
            hero={playerHero}
            name={playerHeroRef.name}
            health={playerHeroRef.health}
            currHealth={playerHero.getCurrHealth()}
            predictedDamageTaken={playerHeroDamageTaken}
          />
        </View>
        <View style={{ flex: 1 }}>
          <AttackMatchupHero
            color={enemyColor}
            hero={targetToAttack}
            currHealth={targetToAttack.getCurrHealth()}
            name={targetHeroRef.name}
            health={targetHeroRef.health}
            predictedDamageTaken={targetHeroDamageTaken}
          />
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Button
          onPress={() => {
            onAttack()
          }}
          text='Attack'
        />
      </View>
    </CustomModal>
  )
}
