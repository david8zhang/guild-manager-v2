import * as React from 'react'
import { Animated, View } from 'react-native'

interface Props {
  isOpen: boolean
  damage: number
}

export const DamageText: React.FC<Props> = ({ isOpen, damage }) => {
  const opacity = new Animated.Value(1)
  const yPos = new Animated.Value(60)
  React.useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(yPos, {
          toValue: 100,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]).start()
    }
  }, [isOpen])

  if (!isOpen) {
    return <View />
  }

  return (
    <Animated.Text
      style={{
        position: 'absolute',
        opacity,
        bottom: yPos,
        right: 0,
        fontSize: 20,
        color: 'red',
      }}
    >
      {`-${damage}`}
    </Animated.Text>
  )
}
