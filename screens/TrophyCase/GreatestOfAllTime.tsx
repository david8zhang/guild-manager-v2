import * as React from 'react'
import { Image, Pressable, Text, View } from 'react-native'
import { Portal } from 'react-native-paper'
import { HeroImage, Navbar } from '../../components'
import { TEAM_IMAGES } from '../../lib/constants/fullTeamImages'
import { FrontOfficeManager } from '../../lib/FrontOfficeManager'
import { Team } from '../../lib/model/Team'
import {
  FontAwesome,
  MaterialCommunityIcons,
  Foundation,
} from '@expo/vector-icons'

interface Props {
  navigation: any
  frontOfficeManager: FrontOfficeManager
  onBack: Function
}

export const GreatestOfAllTime: React.FC<Props> = ({
  navigation,
  frontOfficeManager,
  onBack,
}) => {
  const goat = frontOfficeManager.getGOAT()
  const team = frontOfficeManager.getTeam(goat.team.id) as Team
  return (
    <Portal.Host>
      <Navbar title='Greatest of all Time' navigation={navigation} />
      <View style={{ padding: 10 }}>
        <Pressable
          onPress={() => {
            onBack()
          }}
          style={{
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          <FontAwesome name='chevron-left' size={16} />
          <Text style={{ fontSize: 16, marginLeft: 10 }}>Back</Text>
        </Pressable>
      </View>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'column',
          marginTop: -20,
        }}
      >
        <Text style={{ fontSize: 30 }}>{goat.name}</Text>
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <Image
            source={TEAM_IMAGES[team.name]}
            resizeMode='contain'
            style={{
              height: 30,
              width: 30,
              marginRight: 10,
            }}
          />
          <Text style={{ fontSize: 18, color: team.color }}>{team.name}</Text>
        </View>
        {/* Image */}
        <View
          style={{
            backgroundColor: 'red',
            height: 150,
            width: 150,
            marginTop: 10,
          }}
        >
          <HeroImage
            hero={{ heroImageData: goat.image, heroType: goat.type }}
            height={150}
            width={150}
            teamColor={team.color}
          />
        </View>

        <View
          style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 10,
            }}
          >
            <FontAwesome name='trophy' color='#d4af37' size={20} />
            <Text style={{ fontStyle: 'italic', fontSize: 17, marginLeft: 5 }}>
              Championships:{' '}
              <Text style={{ fontWeight: 'bold' }}>{goat.rings}</Text>
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 10,
              marginRight: 10,
            }}
          >
            <MaterialCommunityIcons name='tournament' size={20} />
            <Text style={{ fontStyle: 'italic', fontSize: 17, marginLeft: 5 }}>
              Playoff Appearances:{' '}
              <Text style={{ fontWeight: 'bold' }}>{goat.playoffs}</Text>
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 10,
            }}
          >
            <Foundation name='graph-bar' size={20} />
            <Text style={{ fontStyle: 'italic', fontSize: 17, marginLeft: 5 }}>
              Highest Overall:{' '}
              <Text style={{ fontWeight: 'bold' }}>{goat.overall}</Text>
            </Text>
          </View>
        </View>
      </View>
    </Portal.Host>
  )
}
