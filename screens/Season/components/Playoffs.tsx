import * as React from 'react'
import { View } from 'react-native'
import { Button, Navbar } from '../../../components'
import { PlayoffBracket } from '../../../lib/model/PlayoffBracket'
import { SeasonManager } from '../../../lib/SeasonManager'
import { PlayoffRound } from './PlayoffRound'

interface Props {
  navigation: any
  seasonManager: SeasonManager
}

export const Playoffs: React.FC<Props> = ({ navigation, seasonManager }) => {
  const [
    playoffBracket,
    setPlayoffBracket,
  ] = React.useState<PlayoffBracket | null>(null)
  React.useEffect(() => {
    let bracket = seasonManager.getPlayoffBracket()
    if (!bracket) {
      bracket = seasonManager.createPlayoffBracket()
    }
    setPlayoffBracket(bracket)
  }, [])

  if (!playoffBracket) {
    return <View />
  }

  const renderBracket = () => {
    const numTotalRounds = playoffBracket.getNumTotalRounds()
    const rightSide: any[] = []
    const leftSide: any[] = []

    for (let i = 0; i < numTotalRounds; i++) {
      const roundResult = playoffBracket.getRoundResultForRoundNum(i + 1)
      if (roundResult) {
        let numBoxes = Math.pow(2, numTotalRounds - 1 - i)
        const matchups = roundResult.matchups
        leftSide.push(
          <PlayoffRound
            numBoxes={numBoxes}
            matchups={matchups.slice(0, matchups.length / 2)}
            seasonManager={seasonManager}
          />
        )
        rightSide.unshift(
          <PlayoffRound
            numBoxes={numBoxes}
            matchups={matchups.slice(matchups.length / 2)}
            seasonManager={seasonManager}
          />
        )
      }
    }
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {leftSide}
        {rightSide}
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Navbar title='Playoffs' />
      {renderBracket()}
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
        }}
      >
        <Button text='Play Match' onPress={() => {}} style={{ width: 200 }} />
      </View>
    </View>
  )
}
