import * as React from 'react'
import { Text, View, StyleSheet, Image, StatusBar } from 'react-native'
import { BorderedPicker, Input, Button } from '../../components'
import { Picker } from '@react-native-community/picker'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

import { connect } from 'react-redux'
import * as guildActions from '../../redux/guildWidget'
import { TEAM_NAMES } from '../../lib/constants/fullTeamNames'
import { TEAM_IMAGES } from '../../lib/constants/fullTeamImages'
import { TEAM_COLOR } from '../../lib/constants/fullTeamColors'

interface Props {
  navigation: any
  createGuild: Function
}

const CreateGuild: React.FC<Props> = ({ navigation, createGuild }) => {
  const [teamName, setTeamName] = React.useState(TEAM_NAMES[0])

  const onSubmit = () => {
    const newGuild = {
      name: teamName,
      teamColor: TEAM_COLOR[teamName],
      teamId: uuidv4(),
    }
    createGuild(newGuild)
    navigation.navigate('StarterHeroes')
  }

  return (
    <View style={styles.root}>
      <StatusBar hidden />
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Guild Manager!</Text>
      </View>
      <Text style={{ textAlign: 'center', fontSize: 20, marginBottom: 10 }}>
        Select your team
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 10,
        }}
      >
        <Image
          resizeMode='contain'
          style={{ height: 150 }}
          source={TEAM_IMAGES[teamName]}
        />
      </View>

      <BorderedPicker
        selectedValue={teamName}
        onValueChange={(teamName: string) => setTeamName(teamName)}
      >
        {TEAM_NAMES.map((name: string) => {
          return <Picker.Item key={name} label={name} value={name} />
        })}
      </BorderedPicker>

      <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        <Button
          style={{ width: 200 }}
          text='Next'
          onPress={() => {
            onSubmit()
          }}
        />
      </View>
    </View>
  )
}

const mapStateToProps = (state: any) => ({
  guild: state.guild,
})

export default connect(mapStateToProps, { ...guildActions })(CreateGuild)

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingLeft: 30,
  },
  header: {
    paddingTop: 20,
    textAlign: 'left',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  description: {
    fontSize: 15,
    marginBottom: 20,
  },
})
