import * as React from 'react'
import { Text, View } from 'react-native'
import { Button, CustomModal } from '../../components'
import Slider from '@react-native-community/slider'
import { Hero } from '../../lib/model/Hero'
import { connect } from 'react-redux'
import { FrontOfficeManager } from '../../lib/FrontOfficeManager'

interface Props {
  isOpen: boolean
  onClose: Function
  hero: Hero
  onAccept: Function
  frontOfficeManager: FrontOfficeManager
}

export const ContractExtensionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  hero,
  onAccept,
  frontOfficeManager,
}) => {
  const [duration, setDuration] = React.useState(2)

  const durationAmount = FrontOfficeManager.getExtensionEstimate(hero, duration)
  const newContract = {
    amount: durationAmount,
    duration,
  }
  const { projectedSalary, diff } = frontOfficeManager.getProjectedSalaryCap(
    hero,
    newContract
  )

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={() => {
        onClose()
      }}
      customWidth={400}
      customHeight={300}
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
        <Text style={{ textAlign: 'center', marginBottom: 10, fontSize: 16 }}>
          For a {duration} year extension, {hero.name} is asking for{' '}
          <Text style={{ fontWeight: 'bold' }}>
            {durationAmount} gold per year
          </Text>{' '}
        </Text>
        <View
          style={{
            marginBottom: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ flex: 1, textAlign: 'center' }}>
            Cap room change:{' '}
            <Text
              style={{ fontWeight: 'bold', color: diff > 0 ? 'red' : 'green' }}
            >
              {diff > 0 ? `-${diff}` : `+${diff}`}G
            </Text>
          </Text>
          <Text style={{ flex: 1, textAlign: 'center' }}>
            Total salary after:{' '}
            <Text style={{ fontWeight: 'bold' }}>{projectedSalary}G</Text>
          </Text>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <Button
            style={{ marginRight: 10 }}
            onPress={() => {
              onAccept(newContract)
              onClose()
            }}
            text='Accept'
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
