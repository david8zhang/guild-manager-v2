import * as React from 'react'
import { Text, View } from 'react-native'
import { Button, CustomModal } from '../../../components'

interface Props {
  message: string
  score: string
  teamName: string
  onClose: Function
  isOpen: boolean
  onContinue: Function
}

export const ScoreModal: React.FC<Props> = ({
  message,
  score,
  onClose,
  teamName,
  isOpen,
  onContinue,
}) => {
  if (!isOpen) {
    return <View />
  }
  return (
    <CustomModal
      onClose={() => {
        onClose()
      }}
      hideCloseButton
      isOpen={isOpen}
      customWidth={400}
      customHeight={250}
    >
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        <Text style={{ fontSize: 18, marginBottom: 10, fontWeight: 'bold' }}>
          {teamName}
        </Text>
        <Text style={{ fontSize: 24, marginBottom: 10 }}>{score}</Text>
        <Text style={{ fontSize: 16, textAlign: 'center' }}>{message}</Text>
        <Button
          style={{ marginTop: 20 }}
          text='Continue'
          onPress={() => {
            onContinue()
          }}
        />
      </View>
    </CustomModal>
  )
}
