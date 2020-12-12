import * as React from 'react'

// UI Components
import { Text, View } from 'react-native'
import { Button, Navbar } from '../../components'
import { TeamRecord } from './components/TeamRecord'
import { MatchupTeam } from './components/MatchupTeam'
import { SeasonCalendar } from './components/SeasonCalendar'
import { Match } from './Match/Match'
import { RosterPreview } from './components/RosterPreview'

// Game State
import { Team } from '../../lib/model/Team'
import { HeroStats } from '../../lib/model/HeroStats'
import { Schedule } from '../../lib/model/Schedule'
import { SeasonManager } from '../../lib/SeasonManager'

// Redux
import * as guildActions from '../../redux/guildWidget'
import * as seasonActions from '../../redux/seasonWidget'
import { connect } from 'react-redux'

interface Props {
  savedSeason: any
  guild: any
  navigation: any
  setOtherTeams: Function
  setSchedule: Function
}

const Season: React.FC<Props> = ({
  navigation,
  guild,
  savedSeason,
  setOtherTeams,
  setSchedule,
}) => {
  const [
    seasonManager,
    setSeasonManager,
  ] = React.useState<SeasonManager | null>(null)
  const [showMatch, setShowMatch] = React.useState(false)
  const [teamToShowRoster, setTeamToShowRoster] = React.useState<any>(null)

  React.useEffect(() => {
    const seasonManager = new SeasonManager(guild)
    if (!guild.league || !guild.schedule) {
      const serializedState = seasonManager.serialize()
      setOtherTeams(serializedState.teams)
      setSchedule(serializedState.schedule)
    } else if (savedSeason) {
      seasonManager.deserialize(savedSeason)
    }
    setSeasonManager(seasonManager)
  }, [])

  if (!seasonManager) {
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
    setShowMatch(false)
  }

  const applyTeamStatIncreases = (statIncreases: any) => {
    seasonManager.applyStatIncreases(statIncreases)
  }

  const saveHeroMatchStats = (heroMatchStats: {
    [heroId: string]: HeroStats
  }) => {
    seasonManager.saveHeroMatchStats(heroMatchStats)
  }

  // Save the season manager state within the redux store or persistent storage
  const serializeSeasonManager = () => {}

  if (showMatch) {
    return (
      <Match
        playerTeam={playerTeam}
        enemyTeam={
          seasonManager.getTeam(currentMatchup.teamInfo.teamId) as Team
        }
        onContinue={(outcome: {
          winner: string
          loser: string
          enemyId: string
          statIncreases: any
          heroMatchStats: {
            [heroId: string]: HeroStats
          }
        }) => {
          saveHeroMatchStats(outcome.heroMatchStats)
          applyTeamStatIncreases(outcome.statIncreases)
          updateTeamRecords(outcome)
          serializeSeasonManager()
        }}
      />
    )
  }

  if (teamToShowRoster) {
    return (
      <RosterPreview
        team={teamToShowRoster}
        onBack={() => setTeamToShowRoster(null)}
      />
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Navbar title='Season' navigation={navigation} />
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1.4, flexDirection: 'column' }}>
          <SeasonCalendar
            currentMatchIndex={schedule.getCurrentMatchIndex()}
            matchList={schedule.getMatchupList()}
          />
          <View
            style={{
              flex: 5,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MatchupTeam
              team={playerTeam}
              record={seasonManager.getTeamRecord(playerTeam.teamId)}
            />
            <Text style={{ fontSize: 20, textAlign: 'center' }}>@</Text>
            <MatchupTeam
              team={currentMatchup.teamInfo}
              record={seasonManager.getTeamRecord(
                currentMatchup.teamInfo.teamId
              )}
            />
          </View>
          <Button
            style={{ alignSelf: 'center', marginTop: 10 }}
            onPress={() => {
              setShowMatch(true)
            }}
            text='Start Game'
          />
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
  )
}

const mapStateToProps = (state: any) => ({
  guild: state.guild,
  savedSeason: state.season,
})

export default connect(mapStateToProps, { ...guildActions, ...seasonActions })(
  Season
)
