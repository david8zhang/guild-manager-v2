import * as React from 'react'
import { Pressable, Text } from 'react-native'

interface Props {
  onPress: Function
  text: string
}

export const TextLink: React.FC<Props> = ({ onPress, text }) => {
  return (
    <Pressable onPress={() => onPress()} style={{ padding: 10 }}>
      <Text
        style={{
          fontWeight: 'bold',
          textDecorationLine: 'underline',
          color: 'blue',
        }}
      >
        {text}
      </Text>
    </Pressable>
  )
}
