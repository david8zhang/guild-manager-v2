import * as React from 'react'
import { View } from 'react-native'

interface Props {
  currHealth: number
  health: number
  predictedDmg: number
  style?: any
}

export const AttackMatchupHealthBar: React.FC<Props> = ({
  currHealth,
  health,
  style,
  predictedDmg,
}) => {
  const width = 200
  const beforeDmgPercent = currHealth / health
  const afterDmgPercent = (currHealth - predictedDmg) / health
  return (
    <View
      style={{
        width,
        height: 10,
        ...style,
        backgroundColor: 'white',
        borderWidth: 1,
        padding: 5,
      }}
    >
      <View
        style={{
          position: 'absolute',
          zIndex: 2,
          backgroundColor: 'red',
          opacity: 0.2,
          width: width * beforeDmgPercent,
          height: 10,
        }}
      />
      <View
        style={{
          position: 'absolute',
          backgroundColor: 'red',
          width: width * afterDmgPercent,
          height: 10,
          opacity: 1,
        }}
      ></View>
    </View>
  )
}
