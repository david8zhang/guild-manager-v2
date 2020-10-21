import * as React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export const HomeScreen: React.FC<{}> = () => {
  return (
    <View style={styles.root}>
      <Text>Home screen</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  }
})