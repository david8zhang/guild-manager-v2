import * as React from 'react'
import { Text, View } from 'react-native'
import { fromHsv } from 'react-native-color-picker'
import { HoloColorPicker } from 'react-native-color-picker/dist/HoloColorPicker'
import { Button, CustomModal } from '../../../components'

interface Props {
  isOpen: boolean
  onClose: Function
  titleText: string
  onConfirm: Function
}

export const ColorPickerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  titleText,
  onConfirm,
}) => {
  const [colorPicked, setColorPicked] = React.useState('')
  return (
    <CustomModal
      isOpen={isOpen}
      onClose={() => {
        onClose()
      }}
    >
      <Text
        style={{
          textAlign: 'center',
          fontSize: 20,
          marginBottom: 10,
          fontWeight: 'bold',
        }}
      >
        {titleText}
      </Text>
      <HoloColorPicker
        onColorChange={(color) => {
          setColorPicked(fromHsv(color))
        }}
        style={{ flex: 1 }}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        <Button
          style={{ marginTop: 10 }}
          onPress={() => {
            onConfirm(colorPicked)
            onClose()
          }}
          text='Confirm'
        />
      </View>
    </CustomModal>
  )
}
