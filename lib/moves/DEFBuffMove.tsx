import * as React from 'react'
import { View, Animated, Easing } from 'react-native'
import { HeroInMatch } from '../model/HeroInMatch'
import { Move } from './Move'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Hero } from '../model/Hero'
import { AttackCutsceneHero } from '../../screens/Season/Match/AttackCutsceneHero'
import { Button } from '../../components'
import { MatchManager } from '../MatchManager'

interface DEFBuffAnimationIconProps {
  isOpen: boolean
}

const DEFBuffAnimationIcon: React.FC<DEFBuffAnimationIconProps> = ({
  isOpen,
}) => {
  const [opacity] = React.useState(new Animated.Value(1))
  const [yPos] = React.useState(new Animated.Value(60))
  React.useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(yPos, {
          toValue: 100,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]).start()
    }
  }, [isOpen])
  if (!isOpen) {
    return <View />
  }
  return (
    <Animated.View
      style={{ position: 'absolute', bottom: yPos, right: 0, opacity }}
    >
      <MaterialCommunityIcons
        style={{ color: 'blue' }}
        name='shield-plus'
        size={20}
      />
    </Animated.View>
  )
}

export interface DEFBuffAnimation {
  userTeamColor: string
  targetTeamColor: string
  user: HeroInMatch
  target: HeroInMatch
  userSide: string
  processMove: Function
  onFinished: Function
}

const DEFBuffAnimation: React.FC<DEFBuffAnimation> = ({
  userTeamColor,
  targetTeamColor,
  user,
  target,
  userSide,
  processMove,
  onFinished,
}) => {
  const [healAmount, setHealAmount] = React.useState(-1)
  const [targetColor, setTargetColor] = React.useState(new Animated.Value(0))
  const [isSkillFinished, setIsSkillFinished] = React.useState(false)
  React.useEffect(() => {
    Animated.sequence([
      Animated.timing(targetColor, {
        toValue: 1.0,
        duration: 400,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      Animated.timing(targetColor, {
        toValue: 0.0,
        duration: 400,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ]).start(() => {
      processMove()
      const healAmount = Math.floor(user.getHeroRef().magic * 0.75)
      setHealAmount(healAmount)
      setIsSkillFinished(true)
    })
  }, [])
  const targetStyle = {
    flex: 1,
    backgroundColor: targetColor.interpolate({
      inputRange: [0, 1],
      outputRange: ['white', 'blue'],
    }),
  }
  return (
    <View style={{ flexDirection: 'row' }}>
      <Animated.View style={userSide === 'left' ? { flex: 1 } : targetStyle}>
        {userSide === 'right' && (
          <DEFBuffAnimationIcon isOpen={healAmount !== -1} />
        )}
        <AttackCutsceneHero
          color={userTeamColor}
          hero={userSide === 'left' ? user : target}
        />
      </Animated.View>
      <Animated.View style={userSide === 'left' ? targetStyle : { flex: 1 }}>
        {userSide === 'left' && (
          <DEFBuffAnimationIcon isOpen={healAmount !== -1} />
        )}
        <AttackCutsceneHero
          color={targetTeamColor}
          hero={userSide === 'left' ? target : user}
        />
      </Animated.View>
      {isSkillFinished && (
        <Button
          style={{ position: 'absolute', bottom: -20, right: 200 }}
          text='Continue'
          onPress={() => {
            onFinished()
          }}
        />
      )}
    </View>
  )
}

export class DEFBuffMove implements Move {
  public name: string
  public description: string
  public range: number
  public rangeHighlightColor: string

  constructor() {
    this.name = 'DEF Buff'
    this.description =
      'Apply DEF increase by some percentage for 2 turns. Percentage increase scales with MGK attribute. Can stack this effect up to 2 times.'
    this.range = 3
    this.rangeHighlightColor = 'green'
  }
  processMove(user: HeroInMatch, target: HeroInMatch) {
    const userHeroRef: Hero = user.getHeroRef()
    const { magic } = userHeroRef
    let buffPercentage = 1
    if (magic < 60) {
      buffPercentage = 1.05
    } else if (magic >= 60 && magic <= 70) {
      buffPercentage = 1.1
    } else if (magic > 70 && magic <= 80) {
      buffPercentage = 1.15
    } else if (magic > 80 && magic <= 90) {
      buffPercentage = 1.2
    } else if (magic > 90 && magic <= 99) {
      buffPercentage = 1.25
    }
    // check if the target already has 2 attack buff stacks
    let numAttackBuffs: number = target.getBuffs().reduce((acc, curr) => {
      if (curr.stat === 'defense') {
        acc++
      }
      return acc
    }, 0)
    if (numAttackBuffs < 2) {
      target.applyBuff({
        stat: 'defense',
        percentage: buffPercentage,
      })
    }
  }
  getAnimation(
    user: HeroInMatch,
    target: HeroInMatch,
    userColor: string,
    targetColor: string,
    userSide: string,
    onFinished: Function
  ) {
    return (
      <DEFBuffAnimation
        user={user}
        userTeamColor={userColor}
        targetTeamColor={targetColor}
        target={target}
        userSide={userSide}
        processMove={() => {
          this.processMove(user, target)
        }}
        onFinished={onFinished}
      />
    )
  }

  isTargetValid(
    user: HeroInMatch,
    target: HeroInMatch,
    matchManager: MatchManager
  ) {
    const userTeam = matchManager.getHeroTeam(user)
    const targetTeam = matchManager.getHeroTeam(target)
    if (
      userTeam.teamId === targetTeam.teamId &&
      user.getHeroRef().heroId !== target.getHeroRef().heroId
    ) {
      return true
    }
    return false
  }
}
