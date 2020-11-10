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
  const [attackerPos, setAttackerPos] = React.useState(new Animated.Value(0))
  const [attackerRot, setAttackerRot] = React.useState(new Animated.Value(0))
  const [attackerDamage, setAttackerDamage] = React.useState(-1)

  const [defenderPos, setDefenderPos] = React.useState(new Animated.Value(0))
  const [defenderRot, setDefenderRot] = React.useState(new Animated.Value(0))
  const [defenderDamage, setDefenderDamage] = React.useState(-1)

  React.useEffect(() => {
    // Attacker wind up and lunge animations
    startAttackerAnimation()
    setTimeout(() => {
      const damage = playerHero.calculateDamage(targetHero)
      playerHero.attack(targetHero)
      setDefenderDamage(Math.floor(damage))
      if (targetHero.isDead) {
        // Show scoring animation
      }
    }, 1000)
    setTimeout(() => {
      if (!targetHero.isDead) {
        startDefenderAnimation()
      }
    }, 2500)
    setTimeout(() => {
      if (!targetHero.isDead) {
        const damage = targetHero.calculateDamage(playerHero)
        targetHero.attack(playerHero)
        setAttackerDamage(Math.floor(damage))
        if (playerHero.isDead) {
          // Show scoring animation
        }
      }
    }, 3500)
  }, [])

  const startDefenderAnimation = () => {
    Animated.sequence([
      Animated.timing(defenderPos, {
        toValue: -100,
        duration: 1000,
        easing: Easing.back(5),
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(defenderPos, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(attackerRot, {
            toValue: 1.0,
            duration: 150,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(attackerRot, {
            toValue: -1.0,
            duration: 300,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(attackerRot, {
            toValue: 0.0,
            duration: 150,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start()
  }

  const startAttackerAnimation = () => {
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
          Animated.timing(defenderRot, {
            toValue: 1.0,
            duration: 150,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(defenderRot, {
            toValue: -1.0,
            duration: 300,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(defenderRot, {
            toValue: 0.0,
            duration: 150,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start()
  }

  React.useEffect(() => {
    setTimeout(() => {
      onClose()
    }, 6000)
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
      <View
        style={{
          flexDirection: 'row',
        }}
      >
        <Animated.View
          style={{
            flex: 1,
            transform: [
              {
                rotate: attackerRot.interpolate({
                  inputRange: [-1, 1],
                  outputRange: ['-0.1rad', '0.1rad'],
                }),
              },
              {
                translateX: attackerPos,
              },
            ],
          }}
        >
          <DamageText isOpen={attackerDamage !== -1} damage={attackerDamage} />
          <AttackCutsceneHero hero={playerHero} />
        </Animated.View>
        <Animated.View
          style={{
            flex: 1,
            transform: [
              {
                rotate: defenderRot.interpolate({
                  inputRange: [-1, 1],
                  outputRange: ['-0.1rad', '0.1rad'],
                }),
              },
              {
                translateX: defenderPos,
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
