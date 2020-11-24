import { Hero } from '../model/Hero'
import { HeroInMatch } from '../model/HeroInMatch'
import { Move } from './Move'
import * as React from 'react'
import { Animated, View, Easing } from 'react-native'
import { AttackCutsceneHero } from '../../screens/Season/Match/AttackCutsceneHero'
import { Button } from '../../components'

interface HealAnimationTextProps {
  isOpen: boolean
  healAmount: number
}

const HealAnimationText: React.FC<HealAnimationTextProps> = ({
  isOpen,
  healAmount,
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
    <Animated.Text
      style={{
        position: 'absolute',
        opacity,
        bottom: yPos,
        right: 0,
        fontSize: 20,
        color: 'green',
      }}
    >
      {`+${healAmount}`}
    </Animated.Text>
  )
}

interface HealAnimationProps {
  user: HeroInMatch
  target: HeroInMatch
  userSide: string
  processMove: Function
  onFinished: Function
}

const HealAnimation: React.FC<HealAnimationProps> = ({
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
      outputRange: ['white', 'green'],
    }),
  }
  return (
    <View style={{ flexDirection: 'row' }}>
      <Animated.View style={userSide === 'left' ? { flex: 1 } : targetStyle}>
        {userSide === 'right' && (
          <HealAnimationText
            isOpen={healAmount !== -1}
            healAmount={healAmount}
          />
        )}
        <AttackCutsceneHero hero={userSide === 'left' ? user : target} />
      </Animated.View>
      <Animated.View style={userSide === 'left' ? targetStyle : { flex: 1 }}>
        {userSide === 'left' && (
          <HealAnimationText
            isOpen={healAmount !== -1}
            healAmount={healAmount}
          />
        )}
        <AttackCutsceneHero hero={userSide === 'left' ? target : user} />
      </Animated.View>
      {isSkillFinished && (
        <Button
          style={{ position: 'absolute', bottom: -20, right: 200 }}
          text='Continue'
          onPress={() => {
            setHealAmount(-1)
            onFinished()
          }}
        />
      )}
    </View>
  )
}

export class HealMove implements Move {
  public name: string
  public description: string
  public range: number
  public rangeHighlightColor: string

  constructor() {
    this.name = 'Heal'
    this.description =
      'Heal an allied hero for a fixed amount. Heal amount scales with the MGK attribute'
    this.range = 6
    this.rangeHighlightColor = 'green'
  }
  processMove(user: HeroInMatch, target: HeroInMatch) {
    const userHeroRef: Hero = user.getHeroRef()
    const healAmount = Math.floor(userHeroRef.magic * 0.75)
    const targetMaxHealth = target.getHeroRef().health
    const targetTotalHealth = Math.min(
      targetMaxHealth,
      target.getCurrHealth() + healAmount
    )
    target.setCurrHealth(targetTotalHealth)
  }

  getAnimation(
    user: HeroInMatch,
    target: HeroInMatch,
    userSide: string,
    onFinished: Function
  ): any {
    return (
      <HealAnimation
        user={user}
        target={target}
        userSide={userSide}
        processMove={() => {
          this.processMove(user, target)
        }}
        onFinished={onFinished}
      />
    )
  }
}