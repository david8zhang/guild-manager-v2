import { HeroInMatch } from '../model/HeroInMatch'
import { PowerUp } from './PowerUp'
import * as React from 'react'
import { FontAwesome5 } from '@expo/vector-icons'
import { MatchManager } from '../MatchManager'
import { Animated, View } from 'react-native'
import { DEBUG_CONFIG } from '../constants/debugConfig'

interface HealthPowerUpProps {
  currPosition: number[]
  hasConfirmedMove: boolean
  allHeroPositions: number[][]
  matchManager: MatchManager
  processEffect: Function
  onGetPowerUp: Function
  healAmount: number
}

interface HealthPowerUpAnimationProps {
  matchManager: MatchManager
  currPosition: number[]
  healAmount: number
  processEffect: Function
}

const HealthPowerUpAnimation: React.FC<HealthPowerUpAnimationProps> = ({
  matchManager,
  currPosition,
  healAmount,
  processEffect,
}) => {
  const [opacity] = React.useState(new Animated.Value(1))
  const [yPos] = React.useState(new Animated.Value(60))
  React.useEffect(() => {
    processEffect()
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
    ]).start(() => {
      matchManager.removePowerUpAtLocation(currPosition)
      matchManager.spawnNewPowerUp()
    })
  }, [])

  return (
    <Animated.Text
      style={{
        position: 'absolute',
        opacity,
        bottom: yPos,
        right: 0,
        fontSize: 15,
        color: 'green',
        width: 40,
      }}
    >
      {`+${healAmount}`}
    </Animated.Text>
  )
}

const HealthPowerUpSprite: React.FC<HealthPowerUpProps> = ({
  currPosition,
  allHeroPositions,
  processEffect,
  healAmount,
  onGetPowerUp,
  matchManager,
  hasConfirmedMove,
}) => {
  const [heroOnPowerUp, setHeroOnPowerUp] = React.useState<any>(null)
  React.useEffect(() => {
    let heroOnPowerUp = null
    if (hasConfirmedMove) {
      allHeroPositions.forEach((position: number[]) => {
        if (position[0] == currPosition[0] && position[1] == currPosition[1]) {
          heroOnPowerUp = matchManager
            .getFullArena()
            .getHeroAtLocation(position[0], position[1]) as HeroInMatch
        }
      })
    }
    setHeroOnPowerUp(heroOnPowerUp)
  }, [allHeroPositions, hasConfirmedMove])
  return (
    <View>
      {heroOnPowerUp !== null && (
        <HealthPowerUpAnimation
          processEffect={() => {
            processEffect(heroOnPowerUp)
            onGetPowerUp()
          }}
          healAmount={healAmount}
          currPosition={currPosition}
          matchManager={matchManager}
        />
      )}
      <FontAwesome5 name='first-aid' size={24} color='red' />
    </View>
  )
}

export class HealthPowerUp extends PowerUp {
  private healAmount: number = DEBUG_CONFIG.healthPowerUpHealAmt || 50
  constructor(currPosition: number[]) {
    super()
    this.name = 'health'
    this.currPosition = currPosition
  }

  public processEffect(hero: HeroInMatch): void {
    hero.addHealth(this.healAmount)
  }

  public getPowerUpSprite(config: {
    hasConfirmedMove: boolean
    allHeroPositions: number[][]
    matchManager: MatchManager
    onGetPowerUp: Function
  }): any {
    const {
      hasConfirmedMove,
      allHeroPositions,
      matchManager,
      onGetPowerUp,
    } = config
    return (
      <HealthPowerUpSprite
        onGetPowerUp={onGetPowerUp}
        healAmount={this.healAmount}
        processEffect={(hero: HeroInMatch) => this.processEffect(hero)}
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
