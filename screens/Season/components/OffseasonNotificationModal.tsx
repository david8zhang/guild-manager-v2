import * as React from 'react'
import { Text, View } from 'react-native'
import { CustomModal, Button } from '../../../components'

interface Props {
  isOpen: boolean
  notification: {
    title: string
    description: string
    onContinue: Function
  }
}

export const OffseasonNotificationModal: React.FC<Props> = ({
  isOpen,
  notification,
}) => {
  const { title, description, onContinue } = notification
  return (
    <CustomModal
      hideCloseButton
      customWidth={350}
      customHeight={200}
      isOpen={isOpen}
      onClose={() => {}}
    >
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        <Text style={{ textAlign: 'center', fontSize: 20, marginBottom: 10 }}>
          {title}
        </Text>
        <Text style={{ textAlign: 'center', fontSize: 14 }}>{description}</Text>
        <Button
          style={{ marginTop: 20, width: 150 }}
          text='Continue'
          onPress={() => {
            onContinue()
          }}
        />
      </View>
    </CustomModal>
  )
}
