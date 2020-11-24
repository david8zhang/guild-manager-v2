import * as React from 'react'
import { View } from 'react-native'

interface Props {
  totalHealth: number
  currHealth: number
  style?: any
  color?: any
  width?: number
  height?: number
}

export const AnimatedHealthBar: React.FC<Props> = ({
  totalHealth,
  currHealth,
  style,
  color,
  width,
  height,
}) => {
  const defaultWidth = 200
  const defaultHeight = 10
  const percentage = currHealth / totalHealth
  return (
    <View
      style={{
        width: width ? width + 2 : defaultWidth + 2,
        height: height ? height : defaultHeight,
        backgroundColor: 'white',
        borderWidth: 1,
        padding: 5,
        ...style,
      }}
    >
      <View
        style={{
          position: 'absolute',
          backgroundColor: color ? color : 'red',
          width: width ? width * percentage : defaultWidth * percentage,
          height: height ? height : defaultHeight,
          opacity: 1,
        }}
      ></View>
    </View>
  )
}
