import * as React from 'react'
import { connect } from 'react-redux'
import * as guildActions from '../../redux/guildWidget'
import { Pressable, Text, View } from 'react-native'
import { Button, Navbar } from '../../components'
import { SeasonManager } from '../../lib/SeasonManager'
import { TeamRecord } from './components/TeamRecord'
import { Schedule } from '../../lib/model/Schedule'
import { MatchupTeam } from './components/MatchupTeam'

interface Props {
  guild: any
  navigation: any
  setOtherTeams: Function
  setSchedule: Function
}

const Season: React.FC<Props> = ({
  navigation,
  guild,
  setOtherTeams,
  setSchedule,
}) => {
  const [
    seasonManager,
    setSeasonManager,
  ] = React.useState<SeasonManager | null>(null)

  React.useEffect(() => {
    const seasonManager = new SeasonManager(guild)
    setSeasonManager(seasonManager)
    if (!guild.league || !guild.schedule) {
      const serializedState = seasonManager.serialize()
      setOtherTeams(serializedState.teams)
      setSchedule(serializedState.schedule)
    }
  }, [])

  if (!seasonManager) {
    return <View />
  }

  const schedule: Schedule = seasonManager.getPlayerSchedule()
  const currentMatchup = schedule.getCurrentMatch()
  const playerTeam = seasonManager.getPlayer()

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Navbar title='Season' navigation={navigation} />
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1.4, flexDirection: 'column' }}>
          <Pressable onPress={() => {}}>
            <Text
              style={{
                textAlign: 'left',
                fontSize: 12,
                color: 'blue',
                textDecorationLine: 'underline',
                fontWeight: 'bold',
                marginTop: 10,
                marginLeft: 20,
              }}
            >
              Show full season calendar
            </Text>
          </Pressable>
          <View
            style={{
              flex: 1,
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
            onPress={() => {}}
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
              Tap a team to view their full roster
            </Text>
            {seasonManager.getAllTeams().map((t) => {
              const record = seasonManager.getTeamRecord(t.teamId)
              return (
                <TeamRecord
                  key={t.teamId}
                  record={record}
                  onPress={() => {}}
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
})

export default connect(mapStateToProps, { ...guildActions })(Season)
