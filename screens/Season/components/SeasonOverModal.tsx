import * as React from 'react'
import { Text, View } from 'react-native'
import { Button, CustomModal } from '../../../components'

interface Props {
  isOpen: boolean
  onContinue: Function
}

export const SeasonOverModal: React.FC<Props> = ({ isOpen, onContinue }) => {
  return (
    <CustomModal
      customWidth={300}
      customHeight={200}
      hideCloseButton
      isOpen={isOpen}
      onClose={() => {}}
    >
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: 20 }}>You missed the playoffs...</Text>
        <Text style={{ fontSize: 14 }}>Try again next season!</Text>
        <Button
          style={{ marginTop: 25 }}
          text='Continue'
          onPress={() => {
            onContinue()
          }}
        />
      </View>
    </CustomModal>
  )
}
