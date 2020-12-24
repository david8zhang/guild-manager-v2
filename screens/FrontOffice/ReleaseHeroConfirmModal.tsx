import * as React from 'react'
import { Text, View } from 'react-native'
import { Button, CustomModal } from '../../components'
import { Hero } from '../../lib/model/Hero'

interface Props {
  isOpen: boolean
  onClose: Function
  onConfirm: Function
  hero: Hero
}

export const ReleaseHeroConfirmModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  hero,
}) => {
  return (
    <CustomModal
      customHeight={175}
      customWidth={350}
      isOpen={isOpen}
      onClose={() => {
        onClose()
      }}
    >
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 20, textAlign: 'center', marginBottom: 10 }}>
          Release {hero.name}?
        </Text>
        <Text style={{ fontSize: 15, textAlign: 'center' }}>
          This hero will be released into free agency!
        </Text>
        <View style={{ flexDirection: 'row', marginTop: 20 }}>
          <Button
            style={{ marginRight: 10 }}
            onPress={() => {
              onConfirm()
              onClose()
            }}
            text='Confirm'
          />
          <Button
            onPress={() => {
              onClose()
            }}
            text='Deny'
          />
        </View>
      </View>
    </CustomModal>
  )
}
