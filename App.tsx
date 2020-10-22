import React from 'react'
import { StyleSheet } from 'react-native'
import * as ScreenOrientation from 'expo-screen-orientation'
import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { HomeScreen, OnboardScreen } from './screens'
import { Provider } from 'react-redux'
import { store } from './redux/store'

export default function App() {
  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT)
  const Stack = createStackNavigator()
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator headerMode='none' initialRouteName='Home'>
          <Stack.Screen name='Onboard' component={OnboardScreen} />
          <Stack.Screen name='Home' component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
