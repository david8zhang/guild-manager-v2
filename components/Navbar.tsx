import * as React from 'react'
import { Animated, Pressable, Text, View } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { Portal } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { DEBUG_CONFIG } from '../lib/constants/debugConfig'

import { connect } from 'react-redux'
import * as leagueActions from '../redux/leagueWidget'
import * as seasonActions from '../redux/seasonWidget'
import * as frontOfficeActions from '../redux/frontOfficeWidget'
import * as guildActions from '../redux/guildWidget'
import { WarningModal } from './WarningModal'

interface Props {
  title: string
  style?: any
  navigation?: any
  saveGuild: Function
  saveSeason: Function
  saveFrontOffice: Function
  saveLeague: Function
}

const Navbar: React.FC<Props> = ({
  title,
  style,
  navigation,
  saveGuild,
  saveSeason,
  saveFrontOffice,
  saveLeague,
}) => {
  const [sideNavPos, setSideNavWidth] = React.useState(new Animated.Value(-200))
  const [showResetWarning, setShowResetWarning] = React.useState(false)

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

  const resetAllStates = () => {
    saveGuild(null)
    saveSeason(null)
    saveFrontOffice(null)
    saveLeague(null)
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
        <WarningModal
          warningText='Are you sure you want to reset? You will lose all your progress!'
          isOpen={showResetWarning}
          onClose={() => setShowResetWarning(false)}
          onConfirm={() => {
            navigation.jumpTo('Create')
            resetAllStates()
            AsyncStorage.clear()
          }}
        />
      </Portal>
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
                setShowResetWarning(true)
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

export const mapStateToProps = (state: any) => ({
  guild: state.guild,
  league: state.league,
  frontOffice: state.frontOffice,
  season: state.season,
})

export default connect(mapStateToProps, {
  ...guildActions,
  ...leagueActions,
  ...frontOfficeActions,
  ...seasonActions,
})(Navbar)
