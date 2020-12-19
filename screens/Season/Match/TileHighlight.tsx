import * as React from 'react'
import { View } from 'react-native'

interface Props {
  backgroundColor: string
}

export const TileHighlight: React.FC<Props> = ({ backgroundColor }) => {
  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        backgroundColor,
        opacity: backgroundColor === 'white' ? 0 : 1,
      }}
    ></View>
  )
}
