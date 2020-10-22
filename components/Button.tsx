import * as React from 'react'
import { Pressable, Text } from 'react-native'

interface Props {
  onPress: Function
  text: string
  style?: any
}

export const Button: React.FC<Props> = ({ onPress, text, style }) => {
  const [isPressing, setIsPressing] = React.useState(false)
  return (
    <Pressable
      onPress={() => onPress()}
      style={{
        width: 100,
        borderRadius: 4,
        borderWidth: 1,
        padding: 10,
        backgroundColor: isPressing ? 'gray' : 'white',
        ...style,
      }}
      onPressIn={() => setIsPressing(true)}
      onPressOut={() => setIsPressing(false)}
    >
      <Text style={{ textAlign: 'center' }}>{text}</Text>
    </Pressable>
  )
}
