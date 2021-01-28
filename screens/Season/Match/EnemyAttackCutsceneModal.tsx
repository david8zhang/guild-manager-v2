import * as React from 'react'
import { Animated, Easing, Image, View } from 'react-native'
import { Portal } from 'react-native-paper'
import { Button, CustomModal } from '../../../components'
import {
  RANGER_ANIMATIONS,
  SUPPORT_ANIMATIONS,
  TANK_ANIMATIONS,
} from '../../../lib/constants/animations'
import { DEBUG_CONFIG } from '../../../lib/constants/debugConfig'
import { MatchManager } from '../../../lib/MatchManager'
import { HeroType } from '../../../lib/model/Hero'
import { AttackResult, HeroInMatch } from '../../../lib/model/HeroInMatch'
import { AttackCutsceneHero } from './AttackCutsceneHero'
import { DamageText } from './DamageText'
import { ScoreModal } from './ScoreModal'
import { connect } from 'react-redux'
import {
  sendAttackEvent,
  sendKillEvent,
  EventTypes,
} from '../../../redux/matchEventWidget'

interface Props {
  isOpen: boolean
  onContinue: Function
  attackAction: {
    user: HeroInMatch
    target: HeroInMatch
  }
  matchManager: MatchManager
  sendAttackEvent?: Function
  sendKillEvent?: Function
}

const EnemyAttackCutsceneModal: React.FC<Props> = ({
  isOpen,
  onContinue,
  attackAction,
  matchManager,
}) => {
  const [playerHeroPos] = React.useState(new Animated.Value(0))
  const [playerHeroRot] = React.useState(new Animated.Value(0))
  const [playerHeroDamage, setPlayerHeroDamage] = React.useState(-1)

  const [enemyHeroPos] = React.useState(new Animated.Value(0))
  const [enemyHeroRot] = React.useState(new Animated.Value(0))
  const [enemyHeroDamage, setEnemyHeroDamage] = React.useState(-1)

  const [scorePayload, setScorePayload] = React.useState<any>(null)
  const [isFinishedAttacking, setIsFinishedAttacking] = React.useState(false)

  const [attackAnimation, setAttackAnimation] = React.useState<any>(null)
  const [defenderAnimation, setDefenderAnimation] = React.useState<any>(null)

  React.useEffect(() => {
    if (isOpen && attackAction) {
      if (attackAction.target.isDead || attackAction.user.isDead) {
        onContinue()
      } else {
        startAttackerAnimation()
      }
    }
  }, [attackAction])

  if (!isOpen || !attackAction) {
    return <View />
  }

  const { user, target } = attackAction
  const attacker = user

  const processAttackerHeroAttack = async () => {
    const attackResult: AttackResult = attacker.attack(
      target,
      DEBUG_CONFIG.enemyCritRate,
      DEBUG_CONFIG.enemyOneShotRate
    )
    setPlayerHeroDamage(attackResult.damageDealt)
    if (target.isDead) {
      matchManager.enemyScoreKill(
        attacker.getHeroRef().heroId,
        target.getHeroRef().heroId
      )
      setScorePayload({
        message: `${attacker.getHeroRef().name} killed ${
          target.getHeroRef().name
        } and scored 2 points!`,
        score: matchManager.getEnemyScore(),
        teamName: matchManager.getEnemyTeamInfo().name,
      })
      matchManager.respawnHero(target, 'player')
    } else {
      sendAttackEvent({
        attacker: attacker.getHeroRef(),
        target: target.getHeroRef(),
        attackResult,
        eventType: EventTypes.Damage,
      })
    }
  }

  const processDefenderHeroAttack = () => {
    if (!target.isDead) {
      const attackResult: AttackResult = target.attack(
        attacker,
        DEBUG_CONFIG.playerCritRate,
        DEBUG_CONFIG.playerOneShotRate
      )
      setEnemyHeroDamage(Math.floor(attackResult.damageDealt))
      if (attacker.isDead) {
        matchManager.playerScoreKill(
          target.getHeroRef().heroId,
          attacker.getHeroRef().heroId
        )
        setScorePayload({
          message: `${target.getHeroRef().name} killed ${
            attacker.getHeroRef().name
          } and scored 2 points!`,
          score: matchManager.getPlayerScore(),
          teamName: matchManager.getPlayerTeamInfo().name,
        })
        matchManager.respawnHero(attacker, 'enemy')
      } else {
        sendAttackEvent({
          attacker: target.getHeroRef(),
          target: attacker.getHeroRef(),
          attackResult,
          eventType: EventTypes.Damage,
        })
      }
    }
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
      case HeroType.SUPPORT: {
        animationPool = SUPPORT_ANIMATIONS
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
    const animation = getRandomAnimation(user.getHeroRef().heroType)
    const { duration } = animation
    setAttackAnimation(animation)
    setTimeout(() => {
      processAttackerHeroAttack()
      setAttackAnimation(null)
      Animated.parallel([
        Animated.timing(enemyHeroPos, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(playerHeroRot, {
            toValue: 1.0,
            duration: 150,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(playerHeroRot, {
            toValue: -1.0,
            duration: 300,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(playerHeroRot, {
            toValue: 0.0,
            duration: 150,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        if (matchManager.canTargetRetaliate(target, attacker)) {
          startDefenderAnimation()
        } else {
          setIsFinishedAttacking(true)
        }
      })
    }, duration)
  }

  const startDefenderAnimation = () => {
    const animation = getRandomAnimation(target.getHeroRef().heroType)
    const { duration } = animation
    setDefenderAnimation(animation)
    setTimeout(() => {
      processDefenderHeroAttack()
      setDefenderAnimation(null)
      Animated.parallel([
        Animated.timing(playerHeroPos, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(enemyHeroRot, {
            toValue: 1.0,
            duration: 150,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(enemyHeroRot, {
            toValue: -1.0,
            duration: 300,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(enemyHeroRot, {
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

  const onAttackFinished = () => {
    setScorePayload(null)
    setEnemyHeroDamage(-1)
    setPlayerHeroDamage(-1)
    setIsFinishedAttacking(false)
    onContinue()
  }

  const playerColor = matchManager.getPlayerTeamInfo().color
  const enemyColor = matchManager.getEnemyTeamInfo().color

  return (
    <CustomModal
      customHeight={300}
      customWidth={500}
      isOpen={isOpen}
      onClose={() => {}}
      hideCloseButton
    >
      <Portal>
        {scorePayload && (
          <ScoreModal
            isOpen={scorePayload !== null}
            score={scorePayload.score}
            teamName={scorePayload.teamName}
            message={scorePayload.message}
            onContinue={() => {
              onAttackFinished()
            }}
          />
        )}
      </Portal>
      {attackAnimation !== null && (
        <View
          style={{
            position: 'absolute',
            zIndex: 100,
            right: 50,
            top: 20,
            transform: [
              {
                scaleX: -1,
              },
            ],
          }}
        >
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
            left: 50,
            top: 20,
          }}
        >
          <Image
            style={{ width: 300, height: 300 }}
            source={defenderAnimation.source}
            resizeMode='contain'
          />
        </View>
      )}
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
                  rotate: playerHeroRot.interpolate({
                    inputRange: [-1, 1],
                    outputRange: ['-0.1rad', '0.1rad'],
                  }),
                },
                {
                  translateX: playerHeroPos,
                },
              ],
            }}
          >
            {playerHeroDamage !== -1 && (
              <DamageText
                isOpen={playerHeroDamage !== -1}
                damage={playerHeroDamage}
              />
            )}
            <AttackCutsceneHero hero={target} color={playerColor} />
          </Animated.View>
          <Animated.View
            style={{
              flex: 1,
              transform: [
                {
                  rotate: enemyHeroRot.interpolate({
                    inputRange: [-1, 1],
                    outputRange: ['-0.1rad', '0.1rad'],
                  }),
                },
                {
                  translateX: enemyHeroPos,
                },
              ],
            }}
          >
            {enemyHeroDamage !== -1 && (
              <DamageText
                isOpen={enemyHeroDamage !== -1}
                damage={enemyHeroDamage}
              />
            )}
            <AttackCutsceneHero hero={attacker} color={enemyColor} />
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

export default connect(null, { sendKillEvent, sendAttackEvent })(
  EnemyAttackCutsceneModal
)
