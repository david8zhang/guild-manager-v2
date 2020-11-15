import * as React from 'react'
import { Text, View } from 'react-native'
import { AttackMatchupHealthBar } from './AttackMatchupHealthBar'

interface Props {
  name: string
  attack: number
  defense: number
  currHealth: number
  health: number
  predictedDamageTaken: number
}

export const AttackMatchupHero: React.FC<Props> = ({
  name,
  attack,
  defense,
  currHealth,
  health,
  predictedDamageTaken,
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
          flex: 1,
          backgroundColor: 'gray',
          width: 100,
          marginBottom: 10,
        }}
      ></View>
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
