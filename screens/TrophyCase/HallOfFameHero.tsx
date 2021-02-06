import * as React from 'react'
import { Pressable, Text, View } from 'react-native'
import { HeroImage } from '../../components'
import { FrontOfficeManager, HallOfFamer } from '../../lib/FrontOfficeManager'
import { Team } from '../../lib/model/Team'

interface Props {
  frontOfficeManager: FrontOfficeManager
  hallOfFamer: HallOfFamer
  style?: any
  innerStyle?: any
  onShowDetails: Function
}

export const HallOfFameHero: React.FC<Props> = ({
  hallOfFamer,
  style,
  innerStyle,
  frontOfficeManager,
  onShowDetails,
}) => {
  const team = frontOfficeManager.getTeam(hallOfFamer.team.id) as Team
  return (
    <View
      style={{
        flexDirection: 'column',
        margin: 5,
        ...style,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: 'white',
          height: 115,
          borderRadius: 5,
          ...innerStyle,
        }}
      >
        <View style={{ flex: 1 }}>
          <HeroImage
            hero={{
              heroImageData: hallOfFamer.image,
              heroType: hallOfFamer.type,
            }}
            width={100}
            height={115}
            teamColor={team.color}
          />
        </View>
        <View style={{ flex: 1, flexDirection: 'column', padding: 5 }}>
          <Text style={{ fontSize: 14, height: 35 }}>{hallOfFamer.name}</Text>
          <Text style={{ fontSize: 30 }}>{hallOfFamer.overall}</Text>
          <Pressable
            onPress={() => {
              onShowDetails()
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: 'bold',
                textDecorationLine: 'underline',
                color: 'blue',
              }}
            >
              More Info
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}
