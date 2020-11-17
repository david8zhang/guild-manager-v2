import * as React from 'react'
import { View } from 'react-native'
import { Button } from '../../../components'
import { MatchManager } from '../../../lib/MatchManager'
import { ScoreBoard } from './ScoreBoard'
import { MatchStats } from './MatchStats'

interface Props {
  score: any
  matchManager: MatchManager
}

export const PostMatch: React.FC<Props> = ({ score, matchManager }) => {
  const [showMatchStats, setShowMatchStats] = React.useState(false)
  if (showMatchStats) {
    return (
      <MatchStats
        matchManager={matchManager}
        onContinue={() => setShowMatchStats(false)}
      />
    )
  }
  return (
    <View style={{ flex: 1, flexDirection: 'column' }}>
      <ScoreBoard score={score} turnsRemaining={0} />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: 20,
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <Button text='Continue' style={{ margin: 5 }} onPress={() => {}} />
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
