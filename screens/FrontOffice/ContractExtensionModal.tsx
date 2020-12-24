import * as React from 'react'
import { Text, View } from 'react-native'
import { Button, CustomModal, Input } from '../../components'
import Slider from '@react-native-community/slider'
import { Hero } from '../../lib/model/Hero'
import { TextInput } from 'react-native-paper'
import { FrontOfficeManager } from '../../lib/FrontOfficeManager'

interface Props {
  isOpen: boolean
  onClose: Function
  hero: Hero
}

export const ContractExtensionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  hero,
}) => {
  const [duration, setDuration] = React.useState(2)

  const durationAmount = FrontOfficeManager.getExtensionEstimate(hero, duration)
  return (
    <CustomModal
      isOpen={isOpen}
      onClose={() => {
        onClose()
      }}
      customWidth={350}
      customHeight={275}
    >
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Text style={{ textAlign: 'center', fontSize: 18, marginBottom: 10 }}>
          Extend Contract?
        </Text>
        <Text style={{ marginBottom: 5, fontSize: 20 }}>{duration} Years</Text>
        <Slider
          value={duration}
          style={{ width: '100%', marginBottom: 20 }}
          onValueChange={(duration) => setDuration(duration)}
          step={1}
          minimumValue={2}
          maximumValue={5}
        />
        <Text style={{ textAlign: 'center', marginBottom: 20 }}>
          For a {duration} year extension, {hero.name} is asking for{' '}
          <Text style={{ fontWeight: 'bold' }}>
            {durationAmount} gold per year
          </Text>{' '}
          ({durationAmount * duration} Gold total contract)
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <Button
            style={{ marginRight: 10 }}
            onPress={() => {}}
            text='Accept'
          />
          <Button onPress={() => {}} text='Deny' />
        </View>
      </View>
    </CustomModal>
  )
}
