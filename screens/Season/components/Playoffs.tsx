import * as React from 'react'
import { Alert, View } from 'react-native'
import { Button, Navbar } from '../../../components'
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
import { Portal } from 'react-native-paper'
import { MatchSimulator } from '../../../lib/simulation/MatchSimulator'
import { FrontOfficeManager } from '../../../lib/FrontOfficeManager'

interface Props {
  seasonManager: SeasonManager
  frontOfficeManager: FrontOfficeManager
  onMatchContinue: Function
  proceedToOffseason: Function
  navigation: any
}

export const Playoffs: React.FC<Props> = ({
  seasonManager,
  frontOfficeManager,
  onMatchContinue,
  proceedToOffseason,
  navigation,
}) => {
  const [
    playoffBracket,
    setPlayoffBracket,
  ] = React.useState<PlayoffBracket | null>(null)
  const [isWinner, setIsWinner] = React.useState<boolean>(false)
  const [playoffsOutcome, setPlayoffsOutcome] = React.useState<string>('')
  const [CPUChampionId, setCPUChampionId] = React.useState<string>('')

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

  const checkHasRoundWon = () => {
    const matchup = playoffBracket.getPlayerMatchup()
    if (!matchup) {
      processPlayerLoss()
    } else if (matchup.winnerId) {
      if (matchup.winnerId === seasonManager.getPlayer().teamId) {
        setIsWinner(true)
      } else {
        processPlayerLoss()
      }
    }
  }

  const processPlayerLoss = () => {
    const winnerId = playoffBracket.getEventualWinner(seasonManager)
    frontOfficeManager.processCPUChampionship(winnerId)
    setCPUChampionId(winnerId as string)
    setPlayoffsOutcome('loss')
  }

  const saveHeroMatchStats = (heroMatchStats: {
    [heroId: string]: HeroStats
  }) => {
    seasonManager.saveHeroMatchStats(heroMatchStats)
  }

  const simulateMatchup = () => {
    const matchup = playoffBracket.getPlayerMatchup() as PlayoffMatchup
    if (!matchup) {
      return
    }
    const opponentId = matchup.teamIds.find(
      (id) => id !== seasonManager.getPlayer().teamId
    ) as string

    const team1 = seasonManager.getPlayer()
    const team2 = seasonManager.getTeam(opponentId) as Team

    const outcome = MatchSimulator.simulateMatchup(team1, team2)
    updatePlayoffBracketScores(outcome.winnerId)
    seasonManager.applyStatIncreases(
      team1.teamId,
      outcome.statIncreases[team1.teamId]
    )
    seasonManager.applyStatIncreases(
      team2.teamId,
      outcome.statIncreases[team2.teamId]
    )
    saveHeroMatchStats(outcome.heroMatchStats)
    simulatePlayoffBracketGames()
    checkHasRoundWon()
    onMatchContinue(outcome)
  }

  const processChampionshipResult = (didWin: boolean) => {
    if (didWin) {
      frontOfficeManager.addChampionship(seasonManager.seasonNumber)
      seasonManager.addRingsToPlayerHeroes()
    }
    proceedToOffseason()
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
          onContinue={() => {
            if (playoffsOutcome !== 'win') {
              const cpuChampionTeam = seasonManager.getTeam(CPUChampionId)
              if (cpuChampionTeam) {
                Alert.alert(
                  `${cpuChampionTeam.name} have won the championships!`,
                  '',
                  [
                    {
                      text: 'OK',
                      onPress: () => {
                        processChampionshipResult(playoffsOutcome === 'win')
                      },
                    },
                  ]
                )
              }
            } else {
              processChampionshipResult(playoffsOutcome === 'win')
            }
          }}
        />
        {renderBracket()}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
          }}
        >
          <Button
            style={{ marginLeft: 10, width: 200 }}
            onPress={() => {
              if (isWinner) {
                simulatePlayoffBracketGames()
              } else {
                simulateMatchup()
              }
            }}
            text='Simulate'
          />
        </View>
      </View>
    </Portal.Host>
  )
}
