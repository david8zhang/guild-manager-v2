import * as React from 'react'
import { Text, View } from 'react-native'
import { HeroInMatch } from '../../../lib/model/HeroInMatch'
import { AnimatedHealthBar } from './AnimatedHealthBar'

interface Props {
  hero: HeroInMatch
}

export const AttackCutsceneHero: React.FC<Props> = ({ hero }) => {
  const heroRef = hero.getHeroRef()
  return (
    <View
      style={{
        height: '90%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontSize: 18 }}>{heroRef.name}</Text>
      <View
        style={{
          marginTop: 10,
          marginBottom: 20,
        }}
      >
        <View
          style={{
            backgroundColor: 'gray',
            width: 100,
            height: 100,
          }}
        />
      </View>
      <AnimatedHealthBar
        currHealth={hero.getCurrHealth()}
        totalHealth={heroRef.health}
      />
    </View>
  )
}
