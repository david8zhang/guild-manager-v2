import * as React from 'react'
import { Text, View } from 'react-native'
import { Button } from '../../../components'
import { MatchManager } from '../../../lib/MatchManager'
import { ScoreBoard } from './ScoreBoard'
import { MatchStats } from './MatchStats'
import { MatchMVP } from './MatchMVP'
import { PostMatchStatGains } from './PostMatchStatGains'

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
  const [showPostMatchGains, setShowPostMatchGains] = React.useState(false)
  const [statIncreases, setStatIncreases] = React.useState<any>(null)

  const enemyScore = matchManager.getEnemyScore()
  const playerScore = matchManager.getPlayerScore()

  const playerTeamId = matchManager.getPlayerTeamInfo().teamId
  const enemyTeamId = matchManager.getEnemyTeamInfo().teamId

  const playerColor = matchManager.getPlayerTeamInfo().color
  const enemyColor = matchManager.getEnemyTeamInfo().color

  const winnerId = playerScore > enemyScore ? playerTeamId : enemyTeamId
  const loserId = playerScore > enemyScore ? enemyTeamId : playerTeamId
  const mvp = matchManager.getMVP(winnerId)

  React.useEffect(() => {
    const statIncreases = matchManager.getStatIncreases(mvp.getHeroRef().heroId)
    setStatIncreases(statIncreases)
  }, [])

  if (showMatchStats) {
    return (
      <MatchStats
        matchManager={matchManager}
        onContinue={() => {
          setShowMatchStats(false)
          setShowPostMatchGains(true)
        }}
      />
    )
  }

  if (showPostMatchGains) {
    return (
      <PostMatchStatGains
        statIncreases={statIncreases}
        matchManager={matchManager}
        onBack={() => {
          setShowMatchStats(true)
          setShowPostMatchGains(false)
        }}
        onContinue={() => setShowPostMatchGains(false)}
      />
    )
  }

  return (
    <View style={{ flex: 1, flexDirection: 'column' }}>
      <ScoreBoard
        isOvertime={false}
        score={score}
        turnsRemaining={0}
        playerTeamName={matchManager.getPlayerTeamInfo().name}
        enemyTeamName={matchManager.getEnemyTeamInfo().name}
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
              const heroMatchStats = matchManager.getHeroMatchStats()
              onContinue({
                winner: winnerId,
                loser: loserId,
                enemyId: enemyTeamId,
                statIncreases,
                heroMatchStats,
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
