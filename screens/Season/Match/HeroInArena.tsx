import * as React from 'react'
import { Text, View } from 'react-native'
import { HeroInMatch } from '../../../lib/model/HeroInMatch'
import { FontAwesome } from '@expo/vector-icons'

interface Props {
  hero: HeroInMatch
  style?: any
}

export const HeroInArena: React.FC<Props> = ({ hero, style }) => {
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
      <Text
        style={{
          fontSize: 11,
          ...style,
          color: hero.hasMoved ? 'gray' : 'black',
        }}
      >
        {heroRef.name}
      </Text>
    </View>
  )
}