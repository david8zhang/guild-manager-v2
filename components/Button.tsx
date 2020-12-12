import * as React from 'react'
import { Pressable, Text } from 'react-native'

interface Props {
  onPress: Function
  text: string
  style?: any
  textStyle?: any
  disabled?: boolean
}

export const Button: React.FC<Props> = ({
  onPress,
  text,
  style,
  textStyle,
  disabled,
}) => {
  const [isPressing, setIsPressing] = React.useState(false)
  return (
    <Pressable
      disabled={disabled}
      onPress={() => onPress()}
      style={{
        width: 100,
        borderRadius: 4,
        borderWidth: 1,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isPressing ? 'gray' : 'white',
        ...style,
      }}
      onPressIn={() => setIsPressing(true)}
      onPressOut={() => setIsPressing(false)}
    >
      <Text style={{ textAlign: 'center', ...textStyle }}>{text}</Text>
    </Pressable>
  )
}
