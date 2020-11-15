import * as React from 'react'
import { Text, View } from 'react-native'
import { MatchManager } from '../../../lib/MatchManager'
import { Team } from '../../../lib/model/Team'
import { Arena } from './Arena'
import { LineupConfirm } from './LineupConfirm'
import { Portal } from 'react-native-paper'
import { ScoreBoard } from './ScoreBoard'
import { PostMatch } from './PostMatch'

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
  const [turnsRemaining, setTurnsRemaining] = React.useState<number>(0)
  const [isMatchOver, setIsMatchOver] = React.useState(false)

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
          setTurnsRemaining(matchManager.getTurnsRemaining())
          setLineupConfirmed(true)
        }}
      />
    )
  }

  if (isMatchOver) {
    return <PostMatch score={score} matchManager={matchManager} />
  }

  return (
    <Portal.Host>
      <View style={{ flexDirection: 'column', flex: 1 }}>
        <ScoreBoard score={score} turnsRemaining={turnsRemaining} />
        <View style={{ flex: 1 }}>
          <Arena
            matchManager={matchManager}
            refreshScore={() => {
              setScore({ ...matchManager.getScore() })
            }}
            refreshTimer={() => {
              setIsMatchOver(matchManager.isGameOver())
              setTurnsRemaining(matchManager.getTurnsRemaining())
            }}
          />
        </View>
      </View>
    </Portal.Host>
  )
}
