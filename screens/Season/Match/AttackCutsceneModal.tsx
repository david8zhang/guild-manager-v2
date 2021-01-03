import * as React from 'react'
import { View, Animated, Easing, Image } from 'react-native'
import { Portal } from 'react-native-paper'
import { Button, CustomModal } from '../../../components'
import {
  TANK_ANIMATIONS,
  RANGER_ANIMATIONS,
} from '../../../lib/constants/animations'
import { DEBUG_CONFIG } from '../../../lib/constants/debugConfig'
import { MatchManager } from '../../../lib/MatchManager'
import { HeroType } from '../../../lib/model/Hero'
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

  const [attackAnimation, setAttackAnimation] = React.useState<any>(null)
  const [defenderAnimation, setDefenderAnimation] = React.useState<any>(null)

  const processPlayerHeroAttack = () => {
    const attackResult: AttackResult = playerHero.attack(
      targetHero,
      DEBUG_CONFIG.playerCritRate,
      DEBUG_CONFIG.playerOneShotRate
    )
    setDefenderDamage(attackResult.damageDealt)
    if (targetHero.isDead) {
      matchManager.playerScoreKill(
        playerHero.getHeroRef().heroId,
        targetHero.getHeroRef().heroId
      )
      setScorePayload({
        message: `${playerHero.getHeroRef().name} killed ${
          targetHero.getHeroRef().name
        } and scored 2 points!`,
        score: matchManager.getPlayerScore(),
        teamName: matchManager.getPlayerTeamInfo().name,
      })
      matchManager.respawnHero(targetHero, 'enemy')
    }
  }

  const processDefenderHeroAttack = () => {
    if (matchManager.canTargetRetaliate(targetHero, playerHero)) {
      const attackResult: AttackResult = targetHero.attack(
        playerHero,
        DEBUG_CONFIG.enemyCritRate,
        DEBUG_CONFIG.enemyOneShotRate
      )
      setAttackerDamage(Math.floor(attackResult.damageDealt))
      if (playerHero.isDead) {
        matchManager.enemyScoreKill(
          targetHero.getHeroRef().heroId,
          playerHero.getHeroRef().heroId
        )
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
  }

  React.useEffect(() => {
    startAttackerAnimation()
  }, [])

  const startDefenderAnimation = () => {
    const animation = getRandomAnimation(targetHero.getHeroRef().heroType)
    const { duration } = animation
    setDefenderAnimation(animation)
    setTimeout(() => {
      processDefenderHeroAttack()
      setDefenderAnimation(null)
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
      ]).start(() => {
        setIsFinishedAttacking(true)
      })
    }, duration)
  }

  const getRandomAnimation = (heroType: HeroType): any => {
    let animationPool

    switch (heroType) {
      case HeroType.RANGER: {
        animationPool = RANGER_ANIMATIONS
        break
      }
      case HeroType.TANK: {
        animationPool = TANK_ANIMATIONS
        break
      }
      default:
        animationPool = TANK_ANIMATIONS
        break
    }

    const allAnimations = Object.keys(animationPool)
    const randomAttackAnimation =
      allAnimations[Math.floor(Math.random() * allAnimations.length)]
    return animationPool[randomAttackAnimation]
  }

  const startAttackerAnimation = () => {
    const animation = getRandomAnimation(playerHero.getHeroRef().heroType)
    const { duration } = animation
    setAttackAnimation(animation)
    setTimeout(() => {
      processPlayerHeroAttack()
      setAttackAnimation(null)
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
      ]).start(() => {
        if (matchManager.canTargetRetaliate(targetHero, playerHero)) {
          startDefenderAnimation()
        } else {
          setIsFinishedAttacking(true)
        }
      })
    }, duration)
  }

  const onAttackFinished = () => {
    setScorePayload(null)
    setIsFinishedAttacking(false)
    setDefenderDamage(-1)
    setAttackerDamage(-1)
    onClose()
  }

  const playerTeamInfo = matchManager.getPlayerTeamInfo()
  const enemyTeamInfo = matchManager.getEnemyTeamInfo()

  return (
    <CustomModal
      customHeight={300}
      customWidth={500}
      onClose={() => {}}
      hideCloseButton
      isOpen={isOpen}
    >
      {attackAnimation !== null && (
        <View style={{ position: 'absolute', zIndex: 100, left: 50, top: 0 }}>
          <Image
            style={{ width: 300, height: 300 }}
            source={attackAnimation.source}
            resizeMode='contain'
          />
        </View>
      )}
      {defenderAnimation !== null && (
        <View
          style={{
            position: 'absolute',
            zIndex: 100,
            right: 50,
            top: 0,
            transform: [
              {
                scaleX: -1,
              },
            ],
          }}
        >
          <Image
            style={{ width: 300, height: 300 }}
            source={defenderAnimation.source}
            resizeMode='contain'
          />
        </View>
      )}
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
            <AttackCutsceneHero
              hero={playerHero}
              color={playerTeamInfo.color}
            />
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
            <AttackCutsceneHero hero={targetHero} color={enemyTeamInfo.color} />
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
