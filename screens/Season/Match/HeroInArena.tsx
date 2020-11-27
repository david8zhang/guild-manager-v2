import * as React from 'react'
import { Text, View } from 'react-native'
import { HeroInMatch } from '../../../lib/model/HeroInMatch'
import { FontAwesome } from '@expo/vector-icons'
import { AnimatedHealthBar } from './AnimatedHealthBar'
import { HeroImage } from '../../../components'

interface Props {
  hero: HeroInMatch
  teamColor: string
  style?: any
  highlightColor?: string
}

export const HeroInArena: React.FC<Props> = ({
  hero,
  style,
  teamColor,
  highlightColor,
}) => {
  if (!hero) {
    return <Text></Text>
  }
  const heroRef = hero.getHeroRef()
  return (
    <View>
      {hero.isDead && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
          }}
        >
          <FontAwesome name='times' size={55} color='red' />
        </View>
      )}
      <HeroImage
        width={48}
        height={48}
        style={{ width: 48, height: 48, alignSelf: 'center' }}
        hero={hero.getHeroRef()}
        teamColor={teamColor}
        hideOverlay
      />
      <AnimatedHealthBar
        totalHealth={heroRef.health}
        currHealth={hero.getCurrHealth()}
        color='green'
        width={40}
        height={2}
        style={{
          alignSelf: 'center',
          padding: 1,
          marginTop: 2,
          position: 'absolute',
          top: 2,
        }}
      />
      {hero.isUntargetable() && (
        <View
          style={{
            position: 'absolute',
            height: 60,
            width: 60,
            backgroundColor: '#DAA520',
            opacity: 0.4,
          }}
        ></View>
      )}
      {hero.hasMoved && (
        <View
          style={{
            position: 'absolute',
            height: 60,
            width: 60,
            backgroundColor: 'black',
            opacity: 0.2,
          }}
        ></View>
      )}
      {highlightColor && (
        <View
          style={{
            position: 'absolute',
            height: 60,
            width: 60,
            backgroundColor: highlightColor,
            opacity: 0.4,
          }}
        ></View>
      )}
    </View>
  )
}
