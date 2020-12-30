import * as React from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet, Text, StatusBar } from 'react-native'
import { Navbar } from '../../components'
import { ScrollView } from 'react-native-gesture-handler'
import { MenuOption } from './components'
import { Portal } from 'react-native-paper'

// Saved state
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as guildActions from '../../redux/guildWidget'
import * as leagueActions from '../../redux/leagueWidget'
import * as seasonActions from '../../redux/seasonWidget'
import * as frontOfficeActions from '../../redux/frontOfficeWidget'

interface Props {
  guild: any
  navigation: any
  saveGuild: Function
  saveLeague: Function
  saveSeason: Function
  saveFrontOffice: Function
}

const HomeScreen: React.FC<Props> = ({
  guild,
  navigation,
  saveGuild,
  saveLeague,
  saveSeason,
  saveFrontOffice,
}) => {
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    if (!guild) {
      AsyncStorage.getItem('@save')
        .then((res) => {
          if (res) {
            const saveState = JSON.parse(res)
            saveGuild(saveState.guild)
            saveLeague(saveState.league)
            saveSeason(saveState.season)
            saveFrontOffice(saveState.frontOffice)
            setIsLoading(false)
          } else {
            navigation.navigate('Create')
          }
        })
        .catch((err) => {
          navigation.navigate('Create')
        })
    } else {
      setIsLoading(false)
    }
  }, [guild])

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, textAlign: 'center' }}>Loading...</Text>
      </View>
    )
  }

  return (
    <Portal.Host>
      <View style={styles.root}>
        <Navbar title='Home' navigation={navigation} />
        <ScrollView horizontal style={{ paddingTop: 10, paddingLeft: 10 }}>
          <MenuOption
            optionName='My Team'
            iconName='group'
            onPress={() => {
              navigation.navigate('MyTeam')
            }}
          />
          <MenuOption
            optionName='Season'
            iconName='calendar'
            onPress={() => {
              navigation.navigate('Season')
            }}
          />
          <MenuOption
            optionName='Front Office'
            iconName='address-book-o'
            onPress={() => {
              navigation.navigate('FrontOffice')
            }}
          />
          <MenuOption
            optionName='News Headlines'
            iconName='newspaper-o'
            onPress={() => {}}
          />
          <MenuOption
            optionName='Trophy Case'
            iconName='trophy'
            onPress={() => {}}
          />
        </ScrollView>
      </View>
    </Portal.Host>
  )
}

const mapStateToProps = (state: any) => ({
  guild: state.guild,
  season: state.season,
  frontOffice: state.frontOffice,
  league: state.league,
})

export default connect(mapStateToProps, {
  ...guildActions,
  ...seasonActions,
  ...leagueActions,
  ...frontOfficeActions,
})(HomeScreen)

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})
