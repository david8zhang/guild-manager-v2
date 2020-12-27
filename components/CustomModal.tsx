import * as React from 'react'
import { Dimensions, Pressable, Text, View } from 'react-native'

interface Props {
  isOpen: boolean
  onClose: Function
  children: any
  customWidth?: number
  customHeight?: number
  style?: any
  hideCloseButton?: boolean
}

export const CustomModal: React.FC<Props> = ({
  isOpen,
  onClose,
  children,
  customWidth,
  customHeight,
  style,
  hideCloseButton,
}) => {
  if (!isOpen) {
    return <View />
  }

  const width = customWidth || 300
  const height = customHeight || 200

  return (
    <View
      style={{
        position: 'absolute',
        height: '100%',
        width: '100%',
        zIndex: 100,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          width,
          height,
          backgroundColor: 'white',
          borderWidth: 1,
          padding: 10,
          ...style,
        }}
      >
        {!hideCloseButton && (
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Pressable onPress={() => onClose()}>
              <Text>Close</Text>
            </Pressable>
          </View>
        )}
        {children}
      </View>
    </View>
  )
}
