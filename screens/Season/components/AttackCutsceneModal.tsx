import * as React from 'react'
import { Text, View, Animated, Easing } from 'react-native'
import { CustomModal } from '../../../components'
import { Hero } from '../../../lib/model/Hero'
import { HeroInMatch } from '../../../lib/model/HeroInMatch'
import { AttackCutsceneHero } from './AttackCutsceneHero'
import { DamageText } from './DamageText'

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
  const [attackerPos, setAttackerPos] = React.useState(new Animated.Value(0))
  const [defenderPos, setDefenderPos] = React.useState(new Animated.Value(0))
  const [counter, setCounter] = React.useState(0)
  const [defenderDamage, setDefenderDamage] = React.useState(-1)

  React.useEffect(() => {
    // Attacker wind up and lunge animations
    Animated.sequence([
      Animated.timing(attackerPos, {
        toValue: 100,
        duration: 1000,
        easing: Easing.back(5),
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(attackerPos, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(defenderPos, {
            toValue: 1.0,
            duration: 150,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(defenderPos, {
            toValue: -1.0,
            duration: 300,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(defenderPos, {
            toValue: 0.0,
            duration: 150,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start()

    setTimeout(() => {
      const damage = playerHero.calculateDamage(targetHero)
      playerHero.attack(targetHero)
      setDefenderDamage(Math.floor(damage))
    }, 1000)
  }, [])

  // React.useEffect(() => {
  //   setTimeout(() => {
  //     onClose()
  //   }, 5000)
  // }, [])

  return (
    <CustomModal
      customHeight={300}
      customWidth={500}
      onClose={() => {
        onClose()
      }}
      isOpen={isOpen}
    >
      <View
        style={{
          flexDirection: 'row',
        }}
      >
        <Animated.View
          style={{ flex: 1, transform: [{ translateX: attackerPos }] }}
        >
          <AttackCutsceneHero hero={playerHero} />
        </Animated.View>
        <Animated.View
          style={{
            flex: 1,
            transform: [
              {
                rotate: defenderPos.interpolate({
                  inputRange: [-1, 1],
                  outputRange: ['-0.1rad', '0.1rad'],
                }),
              },
            ],
          }}
        >
          <DamageText isOpen={defenderDamage !== -1} damage={defenderDamage} />
          <AttackCutsceneHero hero={targetHero} />
        </Animated.View>
      </View>
    </CustomModal>
  )
}
