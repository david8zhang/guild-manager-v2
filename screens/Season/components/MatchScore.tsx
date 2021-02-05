import * as React from 'react'
import { Image, Text, View } from 'react-native'
import { TEAM_IMAGES } from '../../../lib/constants/fullTeamImages'
import { Team } from '../../../lib/model/Team'

interface Props {
  team: Team
  playerTeam: Team
  playerScore: number
  enemyScore: number
  isHome: boolean
}

export const MatchScore: React.FC<Props> = ({
  team,
  playerTeam,
  playerScore,
  enemyScore,
  isHome,
}) => {
  const renderTeam = (team: Team, score: number) => {
    return (
      <View style={{ flexDirection: 'column', flex: 1 }}>
        <View
          style={{ flex: 3, alignItems: 'center', justifyContent: 'center' }}
        >
          <Image
            style={{
              height: '80%',
              width: '80%',
            }}
            resizeMode='contain'
            source={TEAM_IMAGES[team.name]}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, textAlign: 'center' }}>{team.name}</Text>
          <Text style={{ fontSize: 20, textAlign: 'center' }}>{score}</Text>
        </View>
      </View>
    )
  }
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 5,
      }}
    >
      {isHome
        ? renderTeam(playerTeam, playerScore)
        : renderTeam(team, enemyScore)}
      <Text style={{ fontSize: 20, textAlign: 'center' }}>@</Text>
      {isHome
        ? renderTeam(team, enemyScore)
        : renderTeam(playerTeam, playerScore)}
    </View>
  )
}
