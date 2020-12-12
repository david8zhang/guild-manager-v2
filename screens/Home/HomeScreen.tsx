import * as React from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet } from 'react-native'
import { Navbar } from '../../components/Navbar'
import { ScrollView } from 'react-native-gesture-handler'
import { MenuOption } from './components'

interface Props {
  navigation: any
  guild: any
}

const HomeScreen: React.FC<Props> = ({ navigation, guild }) => {
  React.useEffect(() => {
    if (!guild) {
      navigation.navigate('Create')
    }
  }, [])

  return (
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
          onPress={() => {}}
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
  )
}

const mapStateToProps = (state: any) => ({
  guild: state.guild,
})

export default connect(mapStateToProps, null)(HomeScreen)

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})
