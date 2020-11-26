import * as React from 'react'
import { Text, View } from 'react-native'
import { HeroImage } from '../../../components'
import { HeroStats } from '../../../lib/constants/HeroStats'
import { Hero } from '../../../lib/model/Hero'
import { HeroInMatch } from '../../../lib/model/HeroInMatch'

interface Props {
  mvp: HeroInMatch
  teamColor: string
  style?: any
}

export const MatchMVP: React.FC<Props> = ({ mvp, style, teamColor }) => {
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
      <HeroImage
        width={150}
        height={150}
        style={{ width: 150, flex: 1, marginBottom: 10 }}
        hero={hero}
        teamColor={teamColor}
      />
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
