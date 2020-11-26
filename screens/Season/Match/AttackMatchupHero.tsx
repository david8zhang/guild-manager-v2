import * as React from 'react'
import { Text, View } from 'react-native'
import { HeroImage } from '../../../components'
import { Hero } from '../../../lib/model/Hero'
import { AttackMatchupHealthBar } from './AttackMatchupHealthBar'

interface Props {
  name: string
  attack: number
  defense: number
  currHealth: number
  health: number
  predictedDamageTaken: number
  hero: Hero
  color: string
}

export const AttackMatchupHero: React.FC<Props> = ({
  name,
  attack,
  defense,
  currHealth,
  health,
  predictedDamageTaken,
  hero,
  color,
}) => {
  return (
    <View
      style={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        marginTop: 10,
        marginBottom: 10,
      }}
    >
      <Text style={{ textAlign: 'center', fontSize: 18, marginBottom: 10 }}>
        {name}
      </Text>
      <View
        style={{
          flex: 2,
          width: 100,
          marginBottom: 20,
        }}
      >
        <HeroImage hero={hero} width={100} height={100} teamColor={color} />
      </View>
      <AttackMatchupHealthBar
        predictedDmg={predictedDamageTaken}
        currHealth={currHealth}
        health={health}
        style={{ marginBottom: 10 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 18 }}>ATK: {attack}</Text>
        <Text style={{ fontSize: 18 }}>DEF: {defense}</Text>
      </View>
    </View>
  )
}
