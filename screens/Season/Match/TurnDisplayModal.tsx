import * as React from 'react'
import { Text, View } from 'react-native'
import { CustomModal } from '../../../components'

interface Props {
  isOpen: boolean
  onClose: Function
  currTurn: string
}

export const TurnDisplayModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currTurn,
}) => {
  return (
    <CustomModal
      customWidth={300}
      customHeight={150}
      isOpen={isOpen}
      hideCloseButton
      onClose={() => {}}
    >
      <View
        style={{
          height: '100%',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: 25 }}>{currTurn} Turn</Text>
      </View>
    </CustomModal>
  )
}
