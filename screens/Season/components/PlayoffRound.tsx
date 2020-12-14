import * as React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { SeasonManager } from '../../../lib/SeasonManager'
import { PlayoffMatchup } from '../../../lib/model/PlayoffBracket'
import { TEAM_IMAGES } from '../../../lib/constants/fullTeamImages'

interface Props {
  matchups: PlayoffMatchup[]
  seasonManager: SeasonManager
  numBoxes: number
}

const roundComp = (numBoxes: number) => {
  const boxes = []
  for (let i = 0; i < numBoxes; i++) {
    boxes.push(
      <View
        key={`placeholder-box-${i}`}
        style={{
          ...styles.teamBox,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: 50, color: 'gray' }}>?</Text>
      </View>
    )
  }
  return (
    <View style={{ flexDirection: 'column', alignItems: 'center', margin: 5 }}>
      {boxes}
    </View>
  )
}

export const PlayoffRound: React.FC<Props> = ({
  matchups,
  seasonManager,
  numBoxes,
}) => {
  if (matchups.length === 0) {
    return roundComp(numBoxes)
  }

  const renderMatchup = (matchup: PlayoffMatchup) => {
    return (
      <View style={{ flexDirection: 'column' }}>
        {matchup.teamIds.map((teamId: string) => {
          const team = seasonManager.getTeam(teamId)
          if (!team) {
            return <View />
          }
          return (
            <View
              key={`teamMatchup-${team.teamId}`}
              style={{
                ...styles.teamBox,
                backgroundColor: 'white',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 50 }}>
                  {matchup.score[team.teamId]}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  flex: 2,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  source={TEAM_IMAGES[team.name]}
                  resizeMode='contain'
                  style={{ width: 50, height: 50 }}
                />
                <Text style={{ fontSize: 15, textAlign: 'center' }}>
                  {team.getNameAbbrev()}
                </Text>
              </View>
            </View>
          )
        })}
      </View>
    )
  }

  return (
    <View style={{ flexDirection: 'column', alignItems: 'center', margin: 5 }}>
      {matchups.map((m: PlayoffMatchup) => renderMatchup(m))}
    </View>
  )
}

const styles = StyleSheet.create({
  teamBox: {
    width: 150,
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 5,
    padding: 10,
  },
})
