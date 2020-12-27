import * as React from 'react'
import {
  Animated,
  Dimensions,
  Easing,
  Pressable,
  Text,
  View,
} from 'react-native'
import { CommonActions } from '@react-navigation/native'
import { FontAwesome } from '@expo/vector-icons'
import { Portal } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { DEBUG_CONFIG } from '../lib/constants/debugConfig'

interface Props {
  title: string
  style?: any
  navigation?: any
}

export const Navbar: React.FC<Props> = ({ title, style, navigation }) => {
  const [sideNavPos, setSideNavWidth] = React.useState(new Animated.Value(-200))
  const navStyle: any = {
    padding: 20,
    flexDirection: 'row',
    borderBottomWidth: 1,
    alignItems: 'center',
    ...style,
  }

  const closeMenu = () => {
    Animated.timing(sideNavPos, {
      toValue: -200,
      duration: 500,
      useNativeDriver: true,
    }).start()
  }

  const openMenu = () => {
    Animated.timing(sideNavPos, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start()
  }

  const navOptions = [
    {
      name: 'Home',
      value: 'Home',
    },
    {
      name: 'Front Office',
      value: 'FrontOffice',
    },
    {
      name: 'My Team',
      value: 'MyTeam',
    },
    {
      name: 'Season',
      value: 'Season',
    },
  ]
  return (
    <View style={navStyle}>
      <Portal>
        <Animated.View
          style={{
            position: 'absolute',
            width: 200,
            transform: [
              {
                translateX: sideNavPos,
              },
            ],
            height: '100%',
            zIndex: 3,
            backgroundColor: 'white',
            borderRightColor: 'black',
            borderRightWidth: 1,
          }}
        >
          <Pressable
            onPress={() => {
              closeMenu()
            }}
            style={{ padding: 10 }}
          >
            <FontAwesome
              style={{ alignSelf: 'flex-end' }}
              name='times'
              size={20}
            />
          </Pressable>
          {navOptions.map((navOption: any) => {
            return (
              <Pressable
                style={{ padding: 10 }}
                key={navOption.name}
                onPress={() => {
                  navigation.jumpTo(navOption.value)
                  closeMenu()
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                  {navOption.name}
                </Text>
              </Pressable>
            )
          })}
          {DEBUG_CONFIG.quitAndResetEnabled && (
            <Pressable
              style={{ padding: 10 }}
              key='reset-state'
              onPress={() => {
                AsyncStorage.clear()
                navigation.jumpTo('Create')
                closeMenu()
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                Hard Reset
              </Text>
            </Pressable>
          )}
        </Animated.View>
      </Portal>
      {navigation && (
        <Pressable
          onPress={() => {
            openMenu()
          }}
        >
          <FontAwesome name='bars' size={20} color='gray' />
        </Pressable>
      )}
      <View style={{ flex: 1, marginLeft: navigation ? 10 : 0 }}>
        <Text style={{ fontSize: 18 }}>{title}</Text>
      </View>
    </View>
  )
}
