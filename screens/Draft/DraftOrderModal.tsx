import * as React from 'react'
import { View, Text } from 'react-native'
import { CustomModal, Button } from '../../components'

interface Props {
  isOpen: boolean
  onClose: Function
  pickNumber: number
  onContinue: Function
}

export const DraftOrderModal: React.FC<Props> = ({
  isOpen,
  onClose,
  pickNumber,
  onContinue,
}) => {
  const getSuffix = (number: number) => {
    if (number === 1) return 'st'
    if (number === 2) return 'nd'
    if (number === 3) return 'rd'
    return 'th'
  }
  return (
    <CustomModal
      customHeight={200}
      customWidth={300}
      isOpen={isOpen}
      onClose={() => {}}
      hideCloseButton
    >
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ textAlign: 'center' }}>
          Based on your performance in the regular season, you will be selecting
        </Text>
        <Text
          style={{
            fontSize: 24,
            textAlign: 'center',
            marginBottom: 10,
            marginTop: 10,
          }}
        >
          {pickNumber}
          {getSuffix(pickNumber)}
        </Text>
        <Text style={{ textAlign: 'center' }}>in the draft</Text>
        <Button
          onPress={() => {
            onContinue()
          }}
          text='Continue'
          style={{ alignSelf: 'center', marginTop: 15 }}
        />
      </View>
    </CustomModal>
  )
}
