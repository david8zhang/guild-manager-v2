import * as React from 'react'
import { View, Animated, Easing } from 'react-native'
import { Portal } from 'react-native-paper'
import { Button, CustomModal } from '../../../components'
import { MatchManager } from '../../../lib/MatchManager'
import { HeroInMatch, AttackResult } from '../../../lib/model/HeroInMatch'
import { AttackCutsceneHero } from './AttackCutsceneHero'
import { DamageText } from './DamageText'
import { ScoreModal } from './ScoreModal'

interface Props {
  isOpen: boolean
  onClose: Function
  targetHero: HeroInMatch
  playerHero: HeroInMatch
  matchManager: MatchManager
}

export const AttackCutsceneModal: React.FC<Props> = ({
  isOpen,
  onClose,
  targetHero,
  playerHero,
  matchManager,
}) => {
  if (!isOpen) {
    return <View />
  }
  const [attackerPos] = React.useState(new Animated.Value(0))
  const [attackerRot] = React.useState(new Animated.Value(0))
  const [attackerDamage, setAttackerDamage] = React.useState(-1)

  const [defenderPos] = React.useState(new Animated.Value(0))
  const [defenderRot] = React.useState(new Animated.Value(0))
  const [defenderDamage, setDefenderDamage] = React.useState(-1)

  const [scorePayload, setScorePayload] = React.useState<any>(null)
  const [isFinishedAttacking, setIsFinishedAttacking] = React.useState(false)

  const processPlayerHeroAttack = () => {
    setTimeout(() => {
      const attackResult: AttackResult = playerHero.attack(targetHero)
      setDefenderDamage(attackResult.damageDealt)
      if (targetHero.isDead) {
        matchManager.playerScoreKill()
        setScorePayload({
          message: `${playerHero.getHeroRef().name} killed ${
            targetHero.getHeroRef().name
          } and scored 2 points!`,
          score: matchManager.getPlayerScore(),
          teamName: matchManager.getPlayerTeamInfo().name,
        })
        matchManager.respawnHero(targetHero, 'enemy')
      }
    }, 1000)
  }

  const processDefenderHeroAttack = () => {
    setTimeout(() => {
      if (!targetHero.isDead) {
        const attackResult: AttackResult = targetHero.attack(playerHero)
        setAttackerDamage(Math.floor(attackResult.damageDealt))
        if (playerHero.isDead) {
          matchManager.enemyScoreKill()
          setScorePayload({
            message: `${targetHero.getHeroRef().name} killed ${
              playerHero.getHeroRef().name
            } and scored 2 points!`,
            score: matchManager.getEnemyScore(),
            teamName: matchManager.getEnemyTeamInfo().name,
          })
          matchManager.respawnHero(playerHero, 'player')
        }
      }
      setIsFinishedAttacking(true)
    }, 3500)
  }

  React.useEffect(() => {
    // Attacker wind up and lunge animations
    startAttackerAnimation()
    processPlayerHeroAttack()
    // Start the defender attack animation after the attacker animation has finished
    setTimeout(() => {
      if (!targetHero.isDead) {
        startDefenderAnimation()
      }
    }, 2500)
    processDefenderHeroAttack()
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

  const onAttackFinished = () => {
    setIsFinishedAttacking(false)
    onClose()
  }

  return (
    <CustomModal
      customHeight={300}
      customWidth={500}
      onClose={() => {}}
      hideCloseButton
      isOpen={isOpen}
    >
      <Portal>
        {scorePayload && (
          <ScoreModal
            isOpen={scorePayload !== null}
            score={scorePayload.score}
            teamName={scorePayload.teamName}
            message={scorePayload.message}
            onContinue={() => onAttackFinished()}
          />
        )}
      </Portal>
      <View
        style={{
          flexDirection: 'column',
        }}
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
            <DamageText
              isOpen={attackerDamage !== -1}
              damage={attackerDamage}
            />
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
            <DamageText
              isOpen={defenderDamage !== -1}
              damage={defenderDamage}
            />
            <AttackCutsceneHero hero={targetHero} />
          </Animated.View>
        </View>
        {isFinishedAttacking && (
          <Button
            style={{ position: 'absolute', bottom: -20, right: 200 }}
            text='Continue'
            onPress={() => {
              onAttackFinished()
            }}
          />
        )}
      </View>
    </CustomModal>
  )
}
