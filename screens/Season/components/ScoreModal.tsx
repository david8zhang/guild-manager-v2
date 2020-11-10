import * as React from 'react'
import { Text, View } from 'react-native'
import { CustomModal } from '../../../components'

interface Props {
  message: string
  score: string
  teamName: string
  onClose: Function
  isOpen: boolean
}

export const ScoreModal: React.FC<Props> = ({
  message,
  score,
  onClose,
  teamName,
  isOpen,
}) => {
  if (!isOpen) {
    return <View />
  }
  return (
    <CustomModal
      onClose={() => {
        onClose()
      }}
      isOpen={isOpen}
      customWidth={200}
      customHeight={200}
    >
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: 18, marginBottom: 10 }}>{teamName}</Text>
        <Text style={{ fontSize: 24, marginBottom: 10 }}>{score}</Text>
        <Text style={{ fontSize: 16 }}>{message}</Text>
      </View>
    </CustomModal>
  )
}
