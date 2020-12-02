import * as React from 'react'
import { Animated, Easing, View } from 'react-native'
import { Portal } from 'react-native-paper'
import { Button, CustomModal } from '../../../components'
import { MatchManager } from '../../../lib/MatchManager'
import { AttackResult, HeroInMatch } from '../../../lib/model/HeroInMatch'
import { AttackCutsceneHero } from './AttackCutsceneHero'
import { DamageText } from './DamageText'
import { ScoreModal } from './ScoreModal'

interface Props {
  isOpen: boolean
  onContinue: Function
  attackAction: {
    attacker: HeroInMatch
    target: HeroInMatch
  }
  matchManager: MatchManager
}

export const EnemyAttackCutsceneModal: React.FC<Props> = ({
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

  React.useEffect(() => {
    if (isOpen && attackAction) {
      if (attackAction.target.isDead || attackAction.attacker.isDead) {
        onContinue()
      } else {
        startAttackerAnimation()
      }
    }
  }, [attackAction])

  if (!isOpen || !attackAction) {
    return <View />
  }

  const { attacker, target } = attackAction

  const processAttackerHeroAttack = async () => {
    const attackResult: AttackResult = attacker.attack(target)
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
    }
  }

  const processDefenderHeroAttack = () => {
    if (!target.isDead) {
      const attackResult: AttackResult = target.attack(attacker)
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
      }
    }
    setIsFinishedAttacking(true)
  }

  const startAttackerAnimation = () => {
    Animated.timing(enemyHeroPos, {
      toValue: -100,
      duration: 1000,
      easing: Easing.back(5),
      useNativeDriver: true,
    }).start(() => {
      processAttackerHeroAttack()
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
    })
  }

  const startDefenderAnimation = () => {
    Animated.timing(playerHeroPos, {
      toValue: 100,
      duration: 1000,
      easing: Easing.back(5),
      useNativeDriver: true,
    }).start(() => {
      processDefenderHeroAttack()
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
      ]).start()
    })
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
