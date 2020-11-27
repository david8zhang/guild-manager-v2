import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { CustomModal } from '../../../components/CustomModal'
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'
import { TextLink } from '../../../components/TextLink'
import { MovesetModal } from './MovesetModal'
import { Portal } from 'react-native-paper'
import { HeroImage } from '../../../components'
import { Hero } from '../../../lib/model/Hero'

interface Props {
  isOpen: boolean
  onClose: Function
  hero: Hero
  teamColor: string
}

export const HeroDrilldownModal: React.FC<Props> = ({
  isOpen,
  onClose,
  hero,
  teamColor,
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
    moveSet,
  } = hero
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
          <HeroImage
            hero={hero}
            height={175}
            width={175}
            teamColor={teamColor}
          />
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
              {contract && (
                <Text style={{ width: '50%', fontSize: 20 }}>
                  Contract: {contract.duration}YR @ {contract.amount}G
                </Text>
              )}
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
