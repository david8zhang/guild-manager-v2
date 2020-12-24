import * as React from 'react'
import { Portal } from 'react-native-paper'
import { Text, View } from 'react-native'
import { Button, CustomModal } from '../../../components'

interface Props {
  isOpen: boolean
  onClose: Function
  onPress: Function
}

export const OffseasonContractExpireModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onPress,
}) => {
  return (
    <CustomModal
      isOpen={isOpen}
      onClose={() => {}}
      hideCloseButton
      customWidth={350}
      customHeight={200}
    >
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        <Text style={{ textAlign: 'center', fontSize: 20, marginBottom: 10 }}>
          You have contracts expiring!
        </Text>
        <Text style={{ textAlign: 'center', fontSize: 14 }}>
          Extend or release them before continuing
        </Text>
        <Button
          style={{ marginTop: 20, width: 150 }}
          text='Manage contracts'
          onPress={() => {
            onPress()
            onClose()
          }}
        />
      </View>
    </CustomModal>
  )
}
