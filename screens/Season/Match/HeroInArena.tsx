import * as React from 'react'
import { Text, View } from 'react-native'
import { HeroInMatch } from '../../../lib/model/HeroInMatch'
import { FontAwesome } from '@expo/vector-icons'
import { AnimatedHealthBar } from './AnimatedHealthBar'
import { HeroImage } from '../../../components'

interface Props {
  teamColor: string
  style?: any
  highlightColor?: string
  hero?: HeroInMatch
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
    <View style={{ height: '100%', width: '100%' }}>
      {hero.isDead && (
        <View
          style={{
            position: 'absolute',
            zIndex: 1,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <FontAwesome name='times' size={55} color='red' />
        </View>
      )}
      <HeroImage
        width={55}
        height={55}
        style={{ width: 55, height: 55, alignSelf: 'center' }}
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
          zIndex: 1,
          top: 2,
        }}
      />
      {hero.isUntargetable() && (
        <View
          style={{
            position: 'absolute',
            zIndex: 1,
            height: '100%',
            width: '100%',
            backgroundColor: '#DAA520',
            opacity: 0.4,
          }}
        ></View>
      )}
      {(hero.isDead || hero.hasMoved) && (
        <View
          style={{
            position: 'absolute',
            zIndex: 1,
            height: '100%',
            width: '100%',
            backgroundColor: 'black',
            opacity: 0.2,
          }}
        ></View>
      )}
      {highlightColor && (
        <View
          style={{
            position: 'absolute',
            zIndex: 1,
            height: '100%',
            width: '100%',
            backgroundColor: highlightColor,
            opacity: 0.4,
          }}
        ></View>
      )}
    </View>
  )
}
