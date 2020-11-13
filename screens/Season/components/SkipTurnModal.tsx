import * as React from 'react'
import { Text, View } from 'react-native'
import { Button, CustomModal } from '../../../components'

interface Props {
  isOpen: boolean
  onContinue: Function
}

export const SkipTurnModal: React.FC<Props> = ({ isOpen, onContinue }) => {
  return (
    <CustomModal
      customWidth={300}
      customHeight={200}
      isOpen={isOpen}
      onClose={() => {}}
      hideCloseButton
    >
      <View
        style={{
          height: '100%',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ textAlign: 'center', marginBottom: 20, fontSize: 18 }}>
          All your heroes are dead!
        </Text>
        <Button
          text='Skip turn'
          onPress={() => {
            onContinue()
          }}
        />
      </View>
    </CustomModal>
  )
}
