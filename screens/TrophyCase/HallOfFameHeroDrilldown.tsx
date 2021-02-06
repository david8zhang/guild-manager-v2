import * as React from 'react'
import { Image, Text, View } from 'react-native'
import { CustomModal, HeroImage } from '../../components'
import { TEAM_IMAGES } from '../../lib/constants/fullTeamImages'
import { FrontOfficeManager, HallOfFamer } from '../../lib/FrontOfficeManager'
import { Team } from '../../lib/model/Team'
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'

interface Props {
  hallOfFamer: HallOfFamer
  onClose: Function
  isOpen: boolean
  frontOfficeManager: FrontOfficeManager
}

export const HallOfFameHeroDrilldown: React.FC<Props> = ({
  hallOfFamer,
  onClose,
  isOpen,
  frontOfficeManager,
}) => {
  const { name, image, type, overall, rings, playoffs } = hallOfFamer
  const team = frontOfficeManager.getTeam(hallOfFamer.team.id) as Team
  return (
    <CustomModal
      isOpen={isOpen}
      onClose={() => onClose()}
      style={{ padding: 20 }}
      customHeight={285}
      customWidth={700}
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
            hero={{ heroImageData: image, heroType: type }}
            height={175}
            width={175}
            teamColor={team.color}
          />
        </View>

        {/* Body */}
        <View style={{ flex: 2, flexDirection: 'column' }}>
          {/* Header Section */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 35, marginBottom: 10 }}>{name}</Text>
              <View style={{ flexDirection: 'row' }}>
                <Image
                  source={TEAM_IMAGES[team.name]}
                  resizeMode='contain'
                  style={{
                    height: 30,
                    width: 30,
                    marginRight: 10,
                  }}
                />
                <Text style={{ fontSize: 18, color: team.color }}>
                  {team.name}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 50 }}>{overall}</Text>
              <Text>Highest OVR</Text>
            </View>
          </View>

          {/* Stats section */}
          <View style={{ flexDirection: 'column' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <FontAwesome name='trophy' color='#d4af37' size={20} />
              <Text
                style={{ fontStyle: 'italic', fontSize: 17, marginLeft: 10 }}
              >
                Championships: {rings}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons name='tournament' size={20} />
              <Text
                style={{ fontStyle: 'italic', fontSize: 17, marginLeft: 10 }}
              >
                Playoff Appearances: {playoffs}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </CustomModal>
  )
}
