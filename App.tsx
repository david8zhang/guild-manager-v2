import React from 'react'
import { StyleSheet, BackHandler, StatusBar } from 'react-native'
import * as ScreenOrientation from 'expo-screen-orientation'
import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import {
  HomeScreen,
  CreateGuild,
  StarterHeroes,
  Season,
  MyTeam,
  FrontOffice,
  Draft,
} from './screens'
import { Provider } from 'react-redux'
import { store } from './redux/store'

export default function App() {
  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT)
  const Drawer = createDrawerNavigator()

  React.useEffect(() => {
    const unsubscribe = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        return true
      }
    )
  }, [])

  return (
    <Provider store={store}>
      <NavigationContainer>
        <StatusBar hidden />
        <Drawer.Navigator
          initialRouteName='Home'
          screenOptions={{ gestureEnabled: false, unmountOnBlur: true }}
        >
          <Drawer.Screen name='Create' component={CreateGuild} />
          <Drawer.Screen name='Home' component={HomeScreen} />
          <Drawer.Screen name='StarterHeroes' component={StarterHeroes} />
          <Drawer.Screen name='Season' component={Season} />
          <Drawer.Screen name='MyTeam' component={MyTeam} />
          <Drawer.Screen name='FrontOffice' component={FrontOffice} />
          <Drawer.Screen name='Draft' component={Draft} />
        </Drawer.Navigator>
      </NavigationContainer>
    </Provider>
  )
}
