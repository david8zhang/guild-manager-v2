import * as React from 'react'
import { Image, ImageBackground, Pressable, View } from 'react-native'

interface Props {
  onLongPress?: Function
  onPress?: Function
  cols: number
  children: any
  style?: any
  pointerEvents?: any
}

export const Tile: React.FC<Props> = ({
  onLongPress,
  onPress,
  style,
  children,
  cols,
  pointerEvents,
}) => {
  const WIDTH = `${100 / cols - 0.01}%`
  const HEIGHT = 58
  const defaultStyle = {
    height: HEIGHT,
    width: WIDTH,
    backgroundColor: 'white',
    ...style,
  }

  if (!onLongPress && !onPress) {
    return (
      <View pointerEvents={pointerEvents || 'auto'} style={defaultStyle}>
        {children}
      </View>
    )
  }
  return (
    <Pressable
      pointerEvents={pointerEvents || 'auto'}
      onLongPress={() => {
        if (onLongPress) onLongPress()
      }}
      onPress={() => {
        if (onPress) onPress()
      }}
      style={defaultStyle}
    >
      {children}
    </Pressable>
  )
}
