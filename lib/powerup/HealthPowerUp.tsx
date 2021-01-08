import { HeroInMatch } from '../model/HeroInMatch'
import { PowerUp } from './PowerUp'
import * as React from 'react'
import { FontAwesome5 } from '@expo/vector-icons'
import { MatchManager } from '../MatchManager'
import { Animated, View } from 'react-native'

interface HealthPowerUpProps {
  currPosition: number[]
  hasConfirmedMove: boolean
  allHeroPositions: number[][]
  matchManager: MatchManager
}

interface HealthPowerUpAnimationProps {
  matchManager: MatchManager
  currPosition: number[]
}

const HealthPowerUpAnimation: React.FC<HealthPowerUpAnimationProps> = ({
  matchManager,
}) => {
  const [opacity] = React.useState(new Animated.Value(1))
  const [yPos] = React.useState(new Animated.Value(60))
  React.useEffect(() => {
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
    ]).start(() => {})
  }, [])

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
      {`+100`}
    </Animated.Text>
  )
}

const HealthPowerUpSprite: React.FC<HealthPowerUpProps> = ({
  currPosition,
  allHeroPositions,
  matchManager,
  hasConfirmedMove,
}) => {
  const [isHeroOnPowerUp, setIsHeroOnPowerUp] = React.useState(false)
  React.useEffect(() => {
    let isHeroOnPowerUp = false
    if (hasConfirmedMove) {
      allHeroPositions.forEach((position: number[]) => {
        if (position[0] == currPosition[0] && position[1] == currPosition[1]) {
          isHeroOnPowerUp = true
        }
      })
      setIsHeroOnPowerUp(isHeroOnPowerUp)
    }
  }, [allHeroPositions, hasConfirmedMove])
  return (
    <View>
      {isHeroOnPowerUp && (
        <HealthPowerUpAnimation
          currPosition={currPosition}
          matchManager={matchManager}
        />
      )}
      <FontAwesome5 name='first-aid' size={24} color='red' />
    </View>
  )
}

export class HealthPowerUp extends PowerUp {
  constructor(currPosition: number[]) {
    super()
    this.name = 'health'
    this.currPosition = currPosition
  }

  public processEffect(hero: HeroInMatch): void {
    console.log('Healed: ' + hero.getHeroRef().name)
  }

  public getPowerUpSprite(
    hasConfirmedMove: boolean,
    allHeroPositions: number[][],
    matchManager: MatchManager
  ): any {
    return (
      <HealthPowerUpSprite
        hasConfirmedMove={hasConfirmedMove}
        allHeroPositions={allHeroPositions}
        matchManager={matchManager}
        currPosition={this.currPosition}
      />
    )
  }

  public clone(position: number[]): HealthPowerUp {
    return new HealthPowerUp(position)
  }
}
