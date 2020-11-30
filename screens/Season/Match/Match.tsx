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
  onContinue: Function
}

export const Match: React.FC<Props> = ({
  playerTeam,
  enemyTeam,
  onContinue,
}) => {
  const [matchManager, setMatchManager] = React.useState<MatchManager | null>(
    null
  )
  const [lineupConfirmed, setLineupConfirmed] = React.useState(false)
  const [score, setScore] = React.useState<any>({})
  const [turnsRemaining, setTurnsRemaining] = React.useState<number>(0)
  const [isMatchOver, setIsMatchOver] = React.useState(false)

  React.useEffect(() => {
    const config = {
      playerTeam,
      enemyTeam,
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
        enemyTeam={enemyTeam}
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
    return (
      <PostMatch
        score={score}
        matchManager={matchManager}
        onContinue={(outcome: {
          winner: string
          loser: string
          enemyId: string
        }) => {
          onContinue(outcome)
        }}
      />
    )
  }

  const playerColor = matchManager.getPlayerTeamInfo().color
  const enemyColor = matchManager.getEnemyTeamInfo().color

  return (
    <Portal.Host>
      <View style={{ flexDirection: 'column', flex: 1 }}>
        <ScoreBoard
          score={score}
          turnsRemaining={turnsRemaining}
          playerColor={playerColor}
          enemyColor={enemyColor}
        />
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
