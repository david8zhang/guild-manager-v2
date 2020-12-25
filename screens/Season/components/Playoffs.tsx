import * as React from 'react'
import { View } from 'react-native'
import { Button, Navbar } from '../../../components'
import { Match } from '../Match/Match'
import { PlayoffRound } from './PlayoffRound'

// Game state
import { HeroStats } from '../../../lib/model/HeroStats'
import {
  PlayoffBracket,
  PlayoffMatchup,
} from '../../../lib/model/PlayoffBracket'
import { Team } from '../../../lib/model/Team'
import { SeasonManager } from '../../../lib/SeasonManager'
import { DEBUG_CONFIG } from '../../../lib/constants/debugConfig'
import { ChampionshipResultsModal } from './ChampionshipResultsModal'
import { Record } from '../../../lib/model/Record'
import { Portal } from 'react-native-paper'

interface Props {
  seasonManager: SeasonManager
  onMatchContinue: Function
  proceedToOffseason: Function
  navigation: any
}

export const Playoffs: React.FC<Props> = ({
  seasonManager,
  onMatchContinue,
  proceedToOffseason,
  navigation,
}) => {
  const [
    playoffBracket,
    setPlayoffBracket,
  ] = React.useState<PlayoffBracket | null>(null)
  const [showMatch, setShowMatch] = React.useState<boolean>(false)
  const [isWinner, setIsWinner] = React.useState<boolean>(false)
  const [playoffsOutcome, setPlayoffsOutcome] = React.useState<string>('')

  // Auto win simulation
  const [counter, setCounter] = React.useState(0)

  React.useEffect(() => {
    const bracket = seasonManager.getPlayoffBracket()
    setPlayoffBracket(bracket)
  }, [])

  if (!playoffBracket) {
    return <View />
  }
  const updatePlayoffBracketScores = (winner: string) => {
    playoffBracket.updateScore(winner)
    if (playoffBracket.hasRoundFinished()) {
      const championId = playoffBracket.getChampionId()
      if (championId) {
        setPlayoffsOutcome(
          championId === seasonManager.getPlayer().teamId ? 'win' : 'loss'
        )
      } else {
        playoffBracket.goToNextRound()
      }
    }
  }

  const simulatePlayoffBracketGames = () => {
    playoffBracket.simulateGames(seasonManager)
    if (playoffBracket.hasRoundFinished()) {
      playoffBracket.goToNextRound()
      setIsWinner(false)
    }
    setCounter(counter + 1)
  }

  const checkIsWinner = () => {
    const matchup = playoffBracket.getPlayerMatchup()
    if (matchup && matchup.winnerId) {
      if (matchup.winnerId === seasonManager.getPlayer().teamId) {
        setIsWinner(true)
      } else {
        setPlayoffsOutcome('loss')
      }
    }
  }

  const getIsHome = (matchup: PlayoffMatchup) => {
    const playerTeamId = seasonManager.getPlayer().teamId
    const opponentId = matchup.teamIds.find(
      (id) => id !== seasonManager.getPlayer().teamId
    ) as string
    const opponentRecord = seasonManager.getTeamRecord(opponentId) as Record
    const playerRecord = seasonManager.getTeamRecord(playerTeamId) as Record
    const playerBetterRecord =
      playerRecord.getWinLossRatio() > opponentRecord.getWinLossRatio()

    if (matchup.gameNumber % 2 !== 0) {
      return playerBetterRecord
    } else {
      return !playerBetterRecord
    }
  }

  if (showMatch) {
    const matchup = playoffBracket.getPlayerMatchup() as PlayoffMatchup
    const opponentId = matchup.teamIds.find(
      (id) => id !== seasonManager.getPlayer().teamId
    ) as string

    return (
      <Match
        isHome={getIsHome(matchup)}
        playerTeam={seasonManager.getPlayer()}
        enemyTeam={seasonManager.getTeam(opponentId) as Team}
        onContinue={(outcome: {
          winner: string
          loser: string
          enemyId: string
          statIncreases: any
          heroMatchStats: {
            [heroId: string]: HeroStats
          }
        }) => {
          onMatchContinue(outcome)
          updatePlayoffBracketScores(outcome.winner)
          simulatePlayoffBracketGames()
          checkIsWinner()
          setShowMatch(false)
        }}
      />
    )
  }

  const renderBracket = () => {
    const numTotalRounds = playoffBracket.getNumTotalRounds()
    const rightSide: any[] = []
    const leftSide: any[] = []

    for (let i = 0; i < numTotalRounds; i++) {
      const roundResult = playoffBracket.getRoundResultForRoundNum(i + 1)
      let numBoxes = Math.pow(2, numTotalRounds - 1 - i)
      const matchups = roundResult.matchups
      if (roundResult) {
        leftSide.push(
          <PlayoffRound
            key={`round-${i}-left`}
            numBoxes={numBoxes}
            isFinal={i == numTotalRounds - 1}
            matchups={
              matchups.length > 1
                ? matchups.slice(0, matchups.length / 2)
                : matchups
            }
            seasonManager={seasonManager}
            side='left'
          />
        )
        rightSide.unshift(
          <PlayoffRound
            key={`round-${i}-right`}
            numBoxes={numBoxes}
            isFinal={i == numTotalRounds - 1}
            matchups={
              matchups.length > 1
                ? matchups.slice(matchups.length / 2)
                : matchups
            }
            seasonManager={seasonManager}
            side='right'
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
    <Portal.Host>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <Navbar title='Playoffs' navigation={navigation} />
        <ChampionshipResultsModal
          isOpen={playoffsOutcome !== ''}
          didWin={playoffsOutcome === 'win'}
          seasonManager={seasonManager}
          onContinue={() => proceedToOffseason()}
        />
        {renderBracket()}
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
          }}
        >
          <Button
            text={isWinner ? 'Simulate Match' : 'Play Match'}
            onPress={() => {
              if (isWinner) {
                simulatePlayoffBracketGames()
              } else {
                if (DEBUG_CONFIG.autoWinGames) {
                  updatePlayoffBracketScores(seasonManager.getPlayer().teamId)
                  simulatePlayoffBracketGames()
                  checkIsWinner()
                  setCounter(counter + 1)
                } else {
                  setShowMatch(true)
                }
              }
            }}
            style={{ width: 200 }}
          />
        </View>
      </View>
    </Portal.Host>
  )
}
