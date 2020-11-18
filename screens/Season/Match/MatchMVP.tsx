import * as React from 'react'
import { Text, View } from 'react-native'
import { HeroStats } from '../../../lib/constants/HeroStats'
import { Hero } from '../../../lib/model/Hero'
import { HeroInMatch } from '../../../lib/model/HeroInMatch'

interface Props {
  mvp: HeroInMatch
  style?: any
}

export const MatchMVP: React.FC<Props> = ({ mvp, style }) => {
  const hero: Hero = mvp.getHeroRef()
  const stats: HeroStats = mvp.getHeroStats()
  return (
    <View
      style={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'gray',
          width: 150,
          height: 50,
          marginBottom: 10,
        }}
      ></View>
      <Text style={{ fontSize: 20, textAlign: 'center' }}>
        MVP: {hero.name}
      </Text>
      <View
        style={{
          width: 200,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        <Text style={{ flex: 1, fontSize: 16, textAlign: 'center' }}>
          {stats.numKills} kill(s)
        </Text>
        <Text style={{ flex: 1, fontSize: 16, textAlign: 'center' }}>
          {stats.numPoints} points
        </Text>
      </View>
    </View>
  )
}
