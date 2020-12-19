import * as React from 'react'
import { Image, ImageBackground, Pressable, View } from 'react-native'

interface Props {
  onLongPress?: Function
  onPress?: Function
  cols: number
  children: any
  style?: any
  image?: any
}

export const Tile: React.FC<Props> = ({
  onLongPress,
  onPress,
  style,
  children,
  cols,
  image,
}) => {
  const WIDTH = `${100 / cols - 0.01}%`
  const HEIGHT = 58
  const defaultStyle = {
    height: HEIGHT,
    width: WIDTH,
    backgroundColor: 'white',
    ...style,
  }

  const imageBg = image ? (
    <Image
      source={image}
      style={{ width: '100%', height: '100%', zIndex: 0, position: 'absolute' }}
      resizeMode='cover'
    />
  ) : (
    <View />
  )

  if (!onLongPress && !onPress) {
    return (
      <View style={defaultStyle}>
        {imageBg}
        {children}
      </View>
    )
  }
  return (
    <Pressable
      onLongPress={() => {
        if (onLongPress) onLongPress()
      }}
      onPress={() => {
        if (onPress) onPress()
      }}
      style={defaultStyle}
    >
      {imageBg}
      {children}
    </Pressable>
  )
}
