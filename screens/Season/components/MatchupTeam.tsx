import * as React from 'react'
import { Text, View } from 'react-native'

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
        <View
          style={{
            height: '80%',
            width: '80%',
            backgroundColor: 'gray',
          }}
        ></View>
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
