import * as React from 'react'
import { Text, View } from 'react-native'
import { MatchManager } from '../../../lib/MatchManager'
import { Team } from '../../../lib/model/Team'
import { Arena } from './Arena'
import { LineupConfirm } from './LineupConfirm'

interface Props {
  playerTeam: Team
  enemyTeam: Team
}

export const Match: React.FC<Props> = ({ playerTeam, enemyTeam }) => {
  const [matchManager, setMatchManager] = React.useState<MatchManager | null>(
    null
  )
  const [lineupConfirmed, setLineupConfirmed] = React.useState(false)
  const [matchTime, setMatchTime] = React.useState(0)
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
      onTickCallback: (currentTime: number) => {
        setMatchTime(currentTime)
      },
    }
    const manager = new MatchManager(config)
    setMatchManager(manager)
    return () => {
      matchManager?.stopMatch()
    }
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
          setLineupConfirmed(true)
        }}
      />
    )
  }

  const minutes = Math.floor(matchTime / 60)
  const seconds = matchTime % 60

  const { map, rows, cols } = matchManager?.getArena()
  const score = matchManager.getScore()

  return (
    <View style={{ flexDirection: 'column' }}>
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
        <View
          style={{
            padding: 10,
            borderWidth: 1,
            borderColor: 'gray',
            borderLeftWidth: 0,
          }}
        >
          <Text style={{ fontSize: 20 }}>
            {minutes}:{seconds}
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1.5 }}>
          <Arena map={map} rows={rows} cols={cols} />
        </View>
        <View style={{ flex: 1 }}></View>
      </View>
    </View>
  )
}
