import * as React from 'react'
import { Text, View } from 'react-native'
import { MatchManager } from '../../../lib/MatchManager'
import { Team } from '../../../lib/model/Team'
import { Arena } from './Arena'
import { LineupConfirm } from './LineupConfirm'
import { Portal } from 'react-native-paper'

interface Props {
  playerTeam: Team
  enemyTeam: Team
}

export const Match: React.FC<Props> = ({ playerTeam, enemyTeam }) => {
  const [matchManager, setMatchManager] = React.useState<MatchManager | null>(
    null
  )
  const [lineupConfirmed, setLineupConfirmed] = React.useState(false)
  const [score, setScore] = React.useState<any>({})

  React.useEffect(() => {
    const playerHeroes = playerTeam.roster.filter((h) =>
      playerTeam.starterIds.includes(h.heroId)
    )
    const enemyHeroes = enemyTeam.roster.filter((h) =>
      enemyTeam.starterIds.includes(h.heroId)
    )

    const config = {
      playerTeamInfo: {
        name: playerTeam.name,
        abbrev: playerTeam.getNameAbbrev(),
      },
      enemyTeamInfo: {
        name: enemyTeam.name,
        abbrev: enemyTeam.getNameAbbrev(),
      },
      playerHeroes,
      enemyHeroes,
    }
    const manager = new MatchManager(config)
    setMatchManager(manager)
  }, [])

  if (!matchManager) {
    return <View />
  }

  if (!lineupConfirmed) {
    return (
      <LineupConfirm
        playerTeam={playerTeam}
        onConfirm={() => {
          matchManager.startMatch()
          setScore(matchManager.getScore())
          setLineupConfirmed(true)
        }}
      />
    )
  }

  return (
    <Portal.Host>
      <View style={{ flexDirection: 'column', flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            width: 450,
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {Object.keys(score).map((key: string) => {
            return (
              <View
                key={key}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  borderWidth: 1,
                  borderColor: 'gray',
                  marginTop: 10,
                  marginBottom: 10,
                }}
              >
                <View style={{ backgroundColor: 'gray', flex: 1 }}></View>
                <View style={{ flexDirection: 'row', padding: 10, flex: 3 }}>
                  <Text style={{ fontSize: 20, flex: 1 }}>{key}</Text>
                  <Text style={{ fontSize: 20 }}>{score[key]}</Text>
                </View>
              </View>
            )
          })}
        </View>
        <View style={{ flex: 1 }}>
          <Arena
            matchManager={matchManager}
            refreshScore={() => {
              setScore({ ...matchManager.getScore() })
            }}
          />
        </View>
      </View>
    </Portal.Host>
  )
}
