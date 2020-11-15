import * as React from 'react'
import { View } from 'react-native'

interface Props {
  totalHealth: number
  currHealth: number
  style?: any
}

export const AnimatedHealthBar: React.FC<Props> = ({
  totalHealth,
  currHealth,
  style,
}) => {
  const width = 200
  const percentage = currHealth / totalHealth
  return (
    <View
      style={{
        width: width + 2,
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
          backgroundColor: 'red',
          width: width * percentage,
          height: 10,
          opacity: 1,
        }}
      ></View>
    </View>
  )
}
