import * as React from 'react'
import { Pressable, Text } from 'react-native'

interface Props {
  onPress: Function
  text: string
}

export const TextLink: React.FC<Props> = ({ onPress, text }) => {
  const [isPressed, setIsPressed] = React.useState(false)
  return (
    <Pressable
      onPressIn={() => {
        setIsPressed(true)
      }}
      onPressOut={() => {
        setIsPressed(false)
      }}
      style={{ padding: 10 }}
    >
      <Text
        style={{
          fontWeight: 'bold',
          textDecorationLine: 'underline',
          color: 'blue',
          opacity: isPressed ? 0.2 : 1,
        }}
      >
        {text}
      </Text>
    </Pressable>
  )
}
