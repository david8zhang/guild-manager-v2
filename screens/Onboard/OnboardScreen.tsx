import * as React from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Pressable } from 'react-native'
import { BorderedPicker, Input } from '../../components'
import { Picker } from '@react-native-community/picker'
import { ScrollView } from 'react-native-gesture-handler'

interface Props {
  navigation: any
}

const cities = [
  'Ironborn',
  'Bonepoint',
  'Cavebell',
  'Nightland',
  'Roguemire',
  'Grimborn',
  'Faycoast',
  'Quickwater',
  'Deadmere',
  'Thornford',
]

const colors = [
  '#3498db',
  '#2ecc71',
  '#c0392b',
  '#000000',
  '#8e44ad',
]

export const OnboardScreen: React.FC<Props> = ({ navigation }) => {
  const [guildName, setGuildName] = React.useState('')
  const [homeCity, setHomeCity] = React.useState('')
  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Guild Manager!</Text>
        <Text style={styles.description}>Fill out the following information about your guild to get started!</Text>
      </View>
      <Text style={styles.inputLabel}>
        Select your city
      </Text>
      <BorderedPicker
        selectedValue={homeCity}
        onValueChange={(homeCity: string) => setHomeCity(homeCity)}
      >
      {
          cities.map((city: string) => {
            return (
              <Picker.Item key={city} label={city} value={city} />
            )
          })
        }
      </BorderedPicker>
      <Text style={styles.inputLabel}>
        Name your guild
      </Text>
      <Input
        style={{ marginBottom: 10 }}
        onChangeText={(guildName: string) => setGuildName(guildName)}
        value={guildName}
      />
      <Text style={styles.inputLabel}>
        Pick your guild colors
      </Text>
      <View style={{ flexDirection: 'row' }}>
        <Pressable onPress={() => { console.log('Hello world' )}}>
          <View style={{ width: 50, height: 50, backgroundColor: colors[0] }} />
        </Pressable>
        <Pressable onPress={() => { console.log('Hello world' )}}>
          <View style={{ width: 50, height: 50, backgroundColor: colors[1] }} />
        </Pressable>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingLeft: 30,
  },
  header: {
    paddingTop: 35,
    textAlign: 'left'
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 5
  },
  description: {
    fontSize: 15,
    marginBottom: 20
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 10
  }
})