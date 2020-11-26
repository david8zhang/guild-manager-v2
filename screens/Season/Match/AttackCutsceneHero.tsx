import * as React from 'react'
import { Text, View } from 'react-native'
import { HeroImage } from '../../../components'
import { HeroInMatch } from '../../../lib/model/HeroInMatch'
import { AnimatedHealthBar } from './AnimatedHealthBar'

interface Props {
  hero: HeroInMatch
  color: string
}

export const AttackCutsceneHero: React.FC<Props> = ({ hero, color }) => {
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
        <HeroImage
          hero={heroRef}
          width={120}
          height={120}
          teamColor={color}
          style={{ width: 120, height: 120 }}
        />
      </View>
      <AnimatedHealthBar
        currHealth={hero.getCurrHealth()}
        totalHealth={heroRef.health}
      />
    </View>
  )
}
