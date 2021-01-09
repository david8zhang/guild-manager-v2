import * as React from 'react'
import { Text, View } from 'react-native'
import { Button } from './Button'
import { CustomModal } from './CustomModal'

interface Props {
  isOpen: boolean
  onClose: Function
  warningText: string
  onConfirm: Function
}

export const WarningModal: React.FC<Props> = ({
  isOpen,
  onClose,
  warningText,
  onConfirm,
}) => {
  return (
    <CustomModal
      customWidth={300}
      customHeight={200}
      isOpen={isOpen}
      hideCloseButton
      onClose={() => {}}
    >
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 25, textAlign: 'center', marginTop: 20 }}>
          Warning!
        </Text>
        <Text style={{ fontSize: 16, textAlign: 'center' }}>{warningText}</Text>
        <View style={{ flexDirection: 'row', marginTop: 15 }}>
          <Button
            text='Confirm'
            onPress={() => {
              onConfirm()
            }}
            style={{ backgroundColor: 'red', marginRight: 10 }}
            textStyle={{ color: 'white' }}
          />
          <Button
            text='Cancel'
            onPress={() => {
              onClose()
            }}
          />
        </View>
      </View>
    </CustomModal>
  )
}
