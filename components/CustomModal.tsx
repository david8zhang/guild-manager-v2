import * as React from 'react'
import { Dimensions, Pressable, Text, View } from 'react-native'

interface Props {
  isOpen: boolean
  onClose: Function
  children: any
}

export const CustomModal: React.FC<Props> = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return <View />
  }

  const width = Dimensions.get('window').width * 0.9
  const height = Dimensions.get('window').height * 0.9

  return (
    <View
      style={{
        left: Dimensions.get('window').width / 2 - width / 2,
        top: Dimensions.get('window').height / 2 - height / 2,
        position: 'absolute',
        backgroundColor: 'white',
        borderWidth: 1,
        zIndex: 1,
        height,
        width,
        padding: 10,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        <Pressable onPress={() => onClose()}>
          <Text>Close</Text>
        </Pressable>
      </View>
      {children}
    </View>
  )
}
