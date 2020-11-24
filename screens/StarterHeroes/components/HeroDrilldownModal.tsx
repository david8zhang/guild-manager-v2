import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { CustomModal } from '../../../components/CustomModal'
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'
import { TextLink } from '../../../components/TextLink'
import { MovesetModal } from './MovesetModal'
import { Portal } from 'react-native-paper'

interface Props {
  isOpen: boolean
  onClose: Function
  hero: {
    attack: number
    health: number
    defense: number
    speed: number
    magic: number
    potential: number
    name: string
    heroType: string
    moveSet: string[]
    contract: {
      amount: number
      duration: number
    }
  }
}

export const HeroDrilldownModal: React.FC<Props> = ({
  isOpen,
  onClose,
  hero,
}) => {
  const [showMovesetModal, setShowMovesetModal] = React.useState(false)
  if (!hero || !isOpen) {
    return <View />
  }
  const {
    name,
    attack,
    defense,
    health,
    speed,
    potential,
    contract,
    magic,
    heroType,
    moveSet,
  } = hero
  const { amount, duration } = contract
  const ovr = Math.round((attack + defense + speed) / 3)
  const stars = []
  for (let i = 0; i < potential; i++) {
    stars.push(<FontAwesome key={`star-${i}`} name='star' size={20} />)
  }
  return (
    <CustomModal
      isOpen={isOpen}
      onClose={() => onClose()}
      style={{ padding: 20 }}
      customHeight={285}
    >
      <View
        style={{
          flexDirection: 'row',
          marginTop: 20,
          justifyContent: 'center',
        }}
      >
        {/* Image */}
        <View style={{ flex: 1 }}>
          <View
            style={{ backgroundColor: 'gray', height: '90%', width: '90%' }}
          >
            <View
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                padding: 5,
                borderColor: 'black',
                borderWidth: 1,
                backgroundColor: 'white',
              }}
            >
              <MaterialCommunityIcons
                name={heroType === 'attacker' ? 'sword-cross' : 'medical-bag'}
                size={20}
              />
            </View>
          </View>
        </View>

        {/* Body */}
        <View style={{ flex: 2, flexDirection: 'column' }}>
          {/* Header Section */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 30 }}>{name}</Text>
              <View
                style={{
                  marginTop: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                {stars}
              </View>
            </View>
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 50 }}>{ovr}</Text>
              <Text>OVR</Text>
            </View>
          </View>

          {/* Stats section */}
          <View style={{ flexDirection: 'column' }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              <Text style={{ width: '25%', fontSize: 20 }}>ATK: {attack}</Text>
              <Text style={{ width: '25%', fontSize: 20 }}>SPD: {speed}</Text>
              <Text style={{ width: '50%', fontSize: 20 }}>MGK: {magic}</Text>

              <Text style={{ width: '25%', fontSize: 20 }}>DEF: {defense}</Text>
              <Text style={{ width: '25%', fontSize: 20 }}>HP: {health}</Text>
              <Text style={{ width: '50%', fontSize: 20 }}>
                Contract: {duration}YR @ {amount}G
              </Text>
            </View>
          </View>

          {/* Show Moveset modal */}
          <Portal>
            <MovesetModal
              isOpen={showMovesetModal}
              onClose={() => setShowMovesetModal(false)}
              moveSet={moveSet}
            />
          </Portal>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              marginTop: 20,
            }}
          >
            {moveSet.length > 0 && (
              <TextLink
                text='Show move set'
                onPress={() => {
                  setShowMovesetModal(true)
                }}
              />
            )}
          </View>
        </View>
      </View>
    </CustomModal>
  )
}

const styles = StyleSheet.create({
  statsText: {
    width: '33%',
    fontSize: 20,
  },
})
