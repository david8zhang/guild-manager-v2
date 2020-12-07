import * as React from 'react'
import { Text, View, Image } from 'react-native'
import { TEAM_IMAGES } from '../../../lib/constants/fullTeamImages'

interface Props {
  team: {
    name: string
  }
  record: {
    numWins: number
    numLosses: number
  }
}

export const MatchupTeam: React.FC<Props> = ({ team, record }) => {
  const { name } = team
  const { numWins, numLosses } = record
  return (
    <View style={{ flexDirection: 'column', flex: 1 }}>
      <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center' }}>
        <Image
          style={{
            height: '80%',
            width: '80%',
          }}
          resizeMode='contain'
          source={TEAM_IMAGES[name]}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 20, textAlign: 'center' }}>{name}</Text>
        <Text style={{ fontSize: 14, textAlign: 'center' }}>
          {numWins}W - {numLosses}L
        </Text>
      </View>
    </View>
  )
}
