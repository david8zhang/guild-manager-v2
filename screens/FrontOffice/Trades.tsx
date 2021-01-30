import * as React from 'react'
import { ScrollView, Image, Text, View } from 'react-native'
import { Portal } from 'react-native-paper'
import { Button, Navbar } from '../../components'
import { TEAM_IMAGES } from '../../lib/constants/fullTeamImages'
import { FrontOfficeManager } from '../../lib/FrontOfficeManager'
import { TeamRosterDrilldown } from './TeamRosterDrilldown'

interface Props {
  navigation: any
  frontOfficeManager: FrontOfficeManager
  onBack: Function
}

export const Trades: React.FC<Props> = ({ navigation, frontOfficeManager }) => {
  const [teamToDrilldown, setTeamToDrilldown] = React.useState<any>(null)
  const teams = frontOfficeManager.getTeams()
  return (
    <Portal.Host>
      <Navbar title='Trades' navigation={navigation} />
      {teamToDrilldown ? (
        <TeamRosterDrilldown
          onBack={() => {
            setTeamToDrilldown(null)
          }}
          team={teamToDrilldown}
          frontOfficeManager={frontOfficeManager}
        />
      ) : (
        <ScrollView style={{ flexDirection: 'column' }}>
          {teams.map((team) => {
            return (
              <View
                key={team.teamId}
                style={{
                  flexDirection: 'row',
                  padding: 10,
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1,
                  }}
                >
                  <Image
                    style={{ width: 65, height: 65 }}
                    resizeMode='contain'
                    source={TEAM_IMAGES[team.name]}
                  />
                  <Text style={{ fontSize: 20, marginLeft: 10 }}>
                    {team.name}
                  </Text>
                </View>
                <View>
                  <Button
                    style={{ width: 200 }}
                    onPress={() => {
                      setTeamToDrilldown(team)
                    }}
                    text='View Roster'
                  />
                </View>
              </View>
            )
          })}
        </ScrollView>
      )}
    </Portal.Host>
  )
}
