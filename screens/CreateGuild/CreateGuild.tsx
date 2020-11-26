import * as React from 'react'
import { Text, View, StyleSheet, Pressable, StatusBar } from 'react-native'
import { BorderedPicker, Input, Button } from '../../components'
import { Picker } from '@react-native-community/picker'
import { ColorPickerModal } from './components'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

import { connect } from 'react-redux'
import * as guildActions from '../../redux/guildWidget'
import { HOME_CITIES } from '../../lib/constants/homeCities'

interface Props {
  navigation: any
  createGuild: Function
}

const colors = ['#3498db', '#2ecc71', '#c0392b', '#000000', '#8e44ad']

const CreateGuild: React.FC<Props> = ({ navigation, createGuild }) => {
  const [guildName, setGuildName] = React.useState('')
  const [homeCity, setHomeCity] = React.useState(HOME_CITIES[0])
  const [showColorModal, setShowColorModal] = React.useState(false)
  const [teamColor, setTeamColor] = React.useState(colors[0])

  const onSubmit = () => {
    const newGuild = {
      name: `${homeCity} ${guildName}`,
      homeCity,
      teamColor,
      teamId: uuidv4(),
    }
    createGuild(newGuild)
    navigation.navigate('StarterHeroes')
  }

  return (
    <View style={styles.root}>
      <StatusBar hidden />
      <ColorPickerModal
        titleText='Pick a team color'
        isOpen={showColorModal}
        onClose={() => setShowColorModal(false)}
        onConfirm={(color: string) => {
          setTeamColor(color)
        }}
      />
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Guild Manager!</Text>
        <Text style={styles.description}>
          Fill out the following information about your guild to get started!
        </Text>
      </View>
      <Text style={styles.inputLabel}>Select your city</Text>
      <BorderedPicker
        selectedValue={homeCity}
        onValueChange={(homeCity: string) => setHomeCity(homeCity)}
      >
        {HOME_CITIES.map((city: string) => {
          return <Picker.Item key={city} label={city} value={city} />
        })}
      </BorderedPicker>
      <Text style={styles.inputLabel}>Name your guild</Text>
      <Input
        style={{ marginBottom: 10 }}
        onChangeText={(guildName: string) => setGuildName(guildName)}
        value={guildName}
      />
      <Text style={styles.inputLabel}>Pick your guild colors</Text>
      <View style={{ flexDirection: 'row' }}>
        <Pressable
          onPress={() => {
            setShowColorModal(true)
          }}
        >
          <View style={{ width: 50, height: 50, backgroundColor: teamColor }} />
        </Pressable>
      </View>
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
    marginBottom: 5,
  },
  description: {
    fontSize: 15,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
})
