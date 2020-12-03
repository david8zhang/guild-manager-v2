import * as React from 'react'
import { Text, View } from 'react-native'
import { Button } from '../../../components'
import { MatchManager } from '../../../lib/MatchManager'
import { ScoreBoard } from './ScoreBoard'
import { MatchStats } from './MatchStats'
import { MatchMVP } from './MatchMVP'

interface Props {
  score: any
  matchManager: MatchManager
  onContinue: Function
}

export const PostMatch: React.FC<Props> = ({
  score,
  matchManager,
  onContinue,
}) => {
  const [showMatchStats, setShowMatchStats] = React.useState(false)
  if (showMatchStats) {
    return (
      <MatchStats
        matchManager={matchManager}
        onContinue={() => setShowMatchStats(false)}
      />
    )
  }

  const enemyScore = matchManager.getEnemyScore()
  const playerScore = matchManager.getPlayerScore()

  const playerTeamId = matchManager.getPlayerTeamInfo().teamId
  const enemyTeamId = matchManager.getEnemyTeamInfo().teamId

  const winnerId = playerScore > enemyScore ? playerTeamId : enemyTeamId
  const loserId = playerScore > enemyScore ? enemyTeamId : playerTeamId

  const playerColor = matchManager.getPlayerTeamInfo().color
  const enemyColor = matchManager.getEnemyTeamInfo().color

  const mvp = matchManager.getMVP(winnerId)

  return (
    <View style={{ flex: 1, flexDirection: 'column' }}>
      <ScoreBoard
        isOvertime={false}
        score={score}
        turnsRemaining={0}
        playerColor={playerColor}
        enemyColor={enemyColor}
      />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: 20,
        }}
      >
        <MatchMVP
          mvp={mvp}
          style={{ flex: 1 }}
          teamColor={winnerId === playerTeamId ? playerColor : enemyColor}
        />
        <View style={{ flexDirection: 'row' }}>
          <Button
            text='Continue'
            style={{ margin: 5 }}
            onPress={() => {
              onContinue({
                winner: winnerId,
                loser: loserId,
                enemyId: enemyTeamId,
              })
            }}
          />
          <Button
            text='See more stats'
            style={{ margin: 5, width: 150 }}
            onPress={() => {
              setShowMatchStats(true)
            }}
          />
        </View>
      </View>
    </View>
  )
}
