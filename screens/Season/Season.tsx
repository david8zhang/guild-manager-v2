import * as React from 'react'
import { connect } from 'react-redux'
import * as guildActions from '../../redux/guildWidget'
import { Text, View } from 'react-native'
import { Navbar } from '../../components'
import { TeamGenerator } from '../../lib/TeamGenerator'
import { HOME_CITIES } from '../../lib/constants/homeCities'
import { NAME_POOL } from '../../lib/constants/teamNames'
import { SeasonManager } from '../../lib/SeasonManager'
import { Team } from '../../lib/model/Team'

interface Props {
  guild: any
  navigation: any
  setOtherTeams: Function
}

const Season: React.FC<Props> = ({ navigation, guild, setOtherTeams }) => {
  const [
    seasonManager,
    setSeasonManager,
  ] = React.useState<SeasonManager | null>(null)
  React.useEffect(() => {
    let otherGuilds = guild.league
    if (!otherGuilds) {
      otherGuilds = TeamGenerator.generateRandomTeams({
        numTeams: 7,
        homeCityPool: HOME_CITIES,
        namePool: NAME_POOL,
        playerHomeCity: guild.homeCity,
      })
      const serializedGuilds = otherGuilds.map((team: Team) => team.serialize())
      setOtherTeams(serializedGuilds)
    }
    setSeasonManager(new SeasonManager(otherGuilds, guild))
  }, [])

  if (!seasonManager) {
    return <View />
  }

  return (
    <View style={{ flex: 1 }}>
      <Navbar title='Season' navigation={navigation} />
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 2 }}></View>
        <View style={{ flex: 1 }}>
          {seasonManager.getAllTeams().map((t) => {
            return (
              <View key={t.teamId}>
                <Text>{t.name}</Text>
              </View>
            )
          })}
        </View>
      </View>
    </View>
  )
}

const mapStateToProps = (state: any) => ({
  guild: state.guild,
})

export default connect(mapStateToProps, { ...guildActions })(Season)
