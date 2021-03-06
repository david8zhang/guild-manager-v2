import * as React from 'react'

// UI Components
import { Alert, Text, View } from 'react-native'
import { Portal } from 'react-native-paper'
import { Button, Navbar } from '../../components'
import { TeamRecord } from './components/TeamRecord'
import { MatchupTeam } from './components/MatchupTeam'
import { SeasonCalendar } from './components/SeasonCalendar'
import { RosterPreview } from './components/RosterPreview'
import { Playoffs } from './components/Playoffs'
import { SeasonOverModal } from './components/SeasonOverModal'
import { Offseason } from './components/Offseason'
import { MatchScore } from './components/MatchScore'

// Game State
import { Team } from '../../lib/model/Team'
import { HeroStats } from '../../lib/model/HeroStats'
import { Schedule } from '../../lib/model/Schedule'
import { SeasonManager } from '../../lib/SeasonManager'
import { FrontOfficeManager } from '../../lib/FrontOfficeManager'

// Redux
import * as guildActions from '../../redux/guildWidget'
import * as seasonActions from '../../redux/seasonWidget'
import * as frontOfficeActions from '../../redux/frontOfficeWidget'
import * as leagueActions from '../../redux/leagueWidget'
import { connect } from 'react-redux'
import {
  MatchOutcome,
  MatchSimulator,
} from '../../lib/simulation/MatchSimulator'
import { MatchResultModal } from './components/MatchResultModal'

interface Props {
  savedSeason: any
  guild: any
  league: any
  frontOffice: any
  navigation: any
  saveSeason: Function
  saveGuild: Function
  setSchedule: Function
  saveFrontOffice: Function
  saveLeague: Function
}

const Season: React.FC<Props> = ({
  navigation,
  guild,
  league,
  frontOffice,
  savedSeason,
  setSchedule,
  saveSeason,
  saveGuild,
  saveFrontOffice,
  saveLeague,
}) => {
  const [
    seasonManager,
    setSeasonManager,
  ] = React.useState<SeasonManager | null>(null)

  const [
    frontOfficeManager,
    setFrontOfficeManager,
  ] = React.useState<FrontOfficeManager | null>(null)

  const [matchOutcome, setMatchOutcome] = React.useState<any>({})
  const [teamToShowRoster, setTeamToShowRoster] = React.useState<any>(null)
  const [showPlayoffs, setShowPlayoffs] = React.useState<boolean>(false)
  const [showSeasonOver, setShowSeasonOver] = React.useState<boolean>(false)
  const [isOffseason, setIsOffseason] = React.useState<boolean>(false)

  // For viewing previous match scores
  const [matchToView, setMatchToView] = React.useState<number>(0)

  React.useEffect(() => {
    const seasonManager = new SeasonManager(guild, league)
    const frontOfficeManager = new FrontOfficeManager(guild, null)

    // Point the front office manager team references to the season manager ones
    frontOfficeManager.setPlayerTeamReference(seasonManager.getPlayer())
    frontOfficeManager.setTeamReference(seasonManager.getAllTeams())

    // Reconstruct the front office manager and seasonManagers from saved state
    if (frontOffice) {
      frontOfficeManager.deserializeObj(frontOffice)
    }
    if (savedSeason) {
      seasonManager.deserialize(savedSeason)
    } else if (!league || !guild.schedule) {
      const serializedState = seasonManager.serialize()
      saveLeague(seasonManager.getSerializedNonPlayerTeams())
      setSchedule(serializedState.schedule)
    }
    setSeasonManager(seasonManager)
    setFrontOfficeManager(frontOfficeManager)
    setShowPlayoffs(seasonManager.getPlayoffBracket() !== null)
    setIsOffseason(seasonManager.getIsOffseason())

    // Set the current match to view
    const schedule: Schedule = seasonManager.getPlayerSchedule()
    setMatchToView(schedule.getCurrentMatchupIndex())
  }, [guild, frontOffice, league])

  if (!seasonManager || !frontOfficeManager) {
    return <View />
  }

  const schedule: Schedule = seasonManager.getPlayerSchedule()
  const currentMatchup = schedule.getCurrentMatch()
  const playerTeam = seasonManager.getPlayer()

  const updateTeamRecords = (matchOutcome: {
    winner: string
    loser: string
    enemyId: string
  }) => {
    const { winner, loser, enemyId } = matchOutcome
    seasonManager.updateTeamRecord(winner, true)
    seasonManager.updateTeamRecord(loser, false)
    seasonManager.simulateMatchesAndUpdateRecords(enemyId)
    schedule.advanceToNextMatch()
    if (!schedule.getIsRegularSeason()) {
      // If the regular season is over, check if the player made the playoffs. If so, show the playoffs UI. If not, show a model that just restarts with a new season
      handlePostSeason()
    }
  }

  const handlePostSeason = () => {
    const madePlayoffs = seasonManager.didPlayerMakePlayoffs()
    if (!madePlayoffs) {
      setShowSeasonOver(true)
    } else {
      seasonManager.createPlayoffBracket()
      setShowPlayoffs(true)
    }
    seasonManager.incrementPlayoffCounts()
    serializeAllStates()
  }

  // Handle CPU winning championship when player misses the playoffs
  const handleCPUPostSeason = (callback: Function) => {
    const playoffBracket = seasonManager.createPlayoffBracket()
    const winnerId = playoffBracket.getEventualWinner(seasonManager)
    if (winnerId) {
      const championTeam = seasonManager.getTeam(winnerId) as Team
      Alert.alert(`${championTeam.name} has won the championship!`, '', [
        {
          text: 'Ok',
          onPress: () => {
            frontOfficeManager.processCPUChampionship(championTeam.teamId)
            callback()
          },
        },
      ])
    }
  }

  const startOffseason = () => {
    seasonManager.startOffseason()
    frontOfficeManager.incrementHeroAges()
    frontOfficeManager.decrementContractDuration()
    frontOfficeManager.processHeroStatDecay()
    frontOfficeManager.addHallOfFamers()
    setShowPlayoffs(false)
    setIsOffseason(true)
    serializeAllStates()
  }

  const restartSeason = () => {
    seasonManager.restartSeason()
    frontOfficeManager.onSeasonStart()
    setIsOffseason(false)
    serializeAllStates()
  }

  const saveHeroMatchStats = (heroMatchStats: {
    [heroId: string]: HeroStats
  }) => {
    seasonManager.saveHeroMatchStats(heroMatchStats)
  }

  // Save the season manager state within the redux store or persistent storage
  const serializeAllStates = () => {
    const serializedSeason = seasonManager.serialize()
    saveSeason(serializedSeason)

    const serializedPlayerTeam = playerTeam.serialize()
    saveGuild(serializedPlayerTeam)

    const serializedFrontOffice = frontOfficeManager.serialize()
    saveFrontOffice(serializedFrontOffice)

    // save other teams
    const serializedTeams = seasonManager.getSerializedNonPlayerTeams()
    saveLeague(serializedTeams)
  }

  const simulateMatchup = () => {
    const team1 = seasonManager.getPlayer()
    const team2 = seasonManager.getTeam(currentMatchup.teamInfo.teamId) as Team
    const outcome = MatchSimulator.simulateMatchup(team1, team2)
    setMatchOutcome({ outcome, team1, team2 })
  }

  const processMatchupOutcome = (
    outcome: MatchOutcome,
    team1: Team,
    team2: Team
  ) => {
    const playerScore = outcome.score[team1.name]
    const enemyScore = outcome.score[team2.name]
    const loserId =
      outcome.winnerId === team1.teamId ? team2.teamId : team1.teamId
    updateTeamRecords({
      winner: outcome.winnerId,
      loser: loserId,
      enemyId: currentMatchup.teamInfo.teamId,
    })
    saveHeroMatchStats(outcome.heroMatchStats)
    seasonManager.applyStatIncreases(
      team1.teamId,
      outcome.statIncreases[team1.teamId]
    )
    seasonManager.applyStatIncreases(
      team2.teamId,
      outcome.statIncreases[team2.teamId]
    )
    seasonManager.addMatchResult({
      playerScore,
      enemyScore,
      enemyTeamId: team2.teamId,
      isHome: currentMatchup.isHome,
    })
    serializeAllStates()
  }

  if (teamToShowRoster) {
    return (
      <RosterPreview
        team={teamToShowRoster}
        onBack={() => setTeamToShowRoster(null)}
      />
    )
  }

  if (isOffseason) {
    return (
      <Offseason
        navigation={navigation}
        frontOfficeManager={frontOfficeManager}
        seasonManager={seasonManager}
        onRestartSeason={() => {
          restartSeason()
        }}
      />
    )
  }

  if (showPlayoffs) {
    return (
      <Playoffs
        navigation={navigation}
        frontOfficeManager={frontOfficeManager}
        seasonManager={seasonManager}
        onMatchContinue={() => {
          serializeAllStates()
        }}
        proceedToOffseason={() => {
          startOffseason()
        }}
      />
    )
  }

  const renderMatchupView = () => {
    if (matchToView === schedule.getCurrentMatchupIndex()) {
      return (
        <View
          style={{
            flex: 5,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {currentMatchup.isHome ? (
            <MatchupTeam
              team={playerTeam}
              record={seasonManager.getTeamRecord(playerTeam.teamId)}
            />
          ) : (
            <MatchupTeam
              team={currentMatchup.teamInfo}
              record={seasonManager.getTeamRecord(
                currentMatchup.teamInfo.teamId
              )}
            />
          )}
          <Text style={{ fontSize: 20, textAlign: 'center' }}>@</Text>
          {currentMatchup.isHome ? (
            <MatchupTeam
              team={currentMatchup.teamInfo}
              record={seasonManager.getTeamRecord(
                currentMatchup.teamInfo.teamId
              )}
            />
          ) : (
            <MatchupTeam
              team={playerTeam}
              record={seasonManager.getTeamRecord(playerTeam.teamId)}
            />
          )}
        </View>
      )
    } else {
      const matchResult = seasonManager.getMatchResultAtIndex(matchToView)
      if (matchResult) {
        const team = seasonManager.getTeam(matchResult.enemyTeamId) as Team
        const playerTeam = seasonManager.getPlayer()
        const { isHome, playerScore, enemyScore } = matchResult
        return (
          <MatchScore
            team={team}
            isHome={isHome}
            playerTeam={playerTeam}
            playerScore={playerScore}
            enemyScore={enemyScore}
          />
        )
      } else {
        return <View />
      }
    }
  }

  return (
    <Portal.Host>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <SeasonOverModal
          onContinue={() => {
            handleCPUPostSeason(() => {
              setShowSeasonOver(false)
              startOffseason()
            })
          }}
          isOpen={showSeasonOver}
        />
        <MatchResultModal
          isOpen={matchOutcome.outcome !== undefined}
          onContinue={() => {
            const { outcome, team1, team2 } = matchOutcome
            processMatchupOutcome(outcome, team1, team2)
            setMatchOutcome({})
          }}
          matchOutcome={matchOutcome.outcome}
          seasonManager={seasonManager}
        />
        <Navbar title='Season' navigation={navigation} />
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1.4, flexDirection: 'column' }}>
            <SeasonCalendar
              matchIndexToBold={matchToView}
              currentMatchIndex={schedule.getCurrentMatchIndex()}
              matchList={schedule.getMatchupList()}
              onMatchPress={(index: number) => {
                if (index <= schedule.getCurrentMatchIndex()) {
                  setMatchToView(index)
                }
              }}
            />
            {renderMatchupView()}
            <View
              style={{
                flexDirection: 'row',
                marginTop: 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Button
                style={{ marginLeft: 10 }}
                onPress={() => {
                  simulateMatchup()
                }}
                text='Simulate'
              />
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ padding: 10 }}>
              <Text style={{ textAlign: 'center', fontSize: 24 }}>
                Season Rankings
              </Text>
              <Text
                style={{ textAlign: 'center', fontSize: 12, marginBottom: 10 }}
              >
                Tap a team to view their starting lineups
              </Text>
              {seasonManager.getAllTeams().map((t) => {
                const record = seasonManager.getTeamRecord(t.teamId)
                return (
                  <TeamRecord
                    key={t.teamId}
                    record={record}
                    onPress={() => {
                      setTeamToShowRoster(t)
                    }}
                    name={t.name}
                    abbrev={t.getNameAbbrev()}
                  />
                )
              })}
            </View>
          </View>
        </View>
      </View>
    </Portal.Host>
  )
}

const mapStateToProps = (state: any) => ({
  guild: state.guild,
  savedSeason: state.season,
  frontOffice: state.frontOffice,
  league: state.league,
})

export default connect(mapStateToProps, {
  ...guildActions,
  ...seasonActions,
  ...frontOfficeActions,
  ...leagueActions,
})(Season)
