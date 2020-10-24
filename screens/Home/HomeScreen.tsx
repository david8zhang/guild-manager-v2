import * as React from 'react'
import { connect } from 'react-redux'
import { View, Text, StyleSheet } from 'react-native'
import { Navbar } from '../../components/Navbar'

interface Props {
  navigation: any
  guild: any
}

const HomeScreen: React.FC<Props> = ({ navigation, guild }) => {
  console.log(guild)
  React.useEffect(() => {
    if (!guild) {
      navigation.navigate('Create')
    }
  }, [])

  return (
    <View style={styles.root}>
      <Navbar title='Home' />
      <Text>Home screen</Text>
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
