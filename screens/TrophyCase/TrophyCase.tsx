import * as React from 'react'
import { View } from 'react-native'
import { Navbar } from '../../components'
import { connect } from 'react-redux'
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons'
import { Portal } from 'react-native-paper'
import { MenuOption } from '../Home/components'
import { FrontOfficeManager } from '../../lib/FrontOfficeManager'
import { TeamTrophies } from './TeamTrophies'
import { HallOfFame } from './HallOfFame'
import { GreatestOfAllTime } from './GreatestOfAllTime'

interface Props {
  navigation: any
  frontOffice: any
  guild: any
  league: any
}

const TrophyCase: React.FC<Props> = ({
  navigation,
  frontOffice,
  guild,
  league,
}) => {
  const [frontOfficeManager, setFrontOfficeManager] = React.useState<any>(null)
  const [currPage, setCurrPage] = React.useState<string>('')
  React.useEffect(() => {
    const foManager: FrontOfficeManager = new FrontOfficeManager(guild, league)
    if (frontOffice) {
      foManager.deserializeObj(frontOffice)
    }
    setFrontOfficeManager(foManager)
  }, [frontOffice, guild, league])

  if (currPage === 'Team Trophies') {
    return (
      <TeamTrophies
        navigation={navigation}
        frontOfficeManager={frontOfficeManager}
        onBack={() => {
          setCurrPage('')
        }}
      />
    )
  }

  if (currPage === 'Hall of Fame') {
    return (
      <HallOfFame
        navigation={navigation}
        frontOfficeManager={frontOfficeManager}
        onBack={() => {
          setCurrPage('')
        }}
      />
    )
  }

  if (currPage === 'GOAT') {
    return (
      <GreatestOfAllTime
        navigation={navigation}
        frontOfficeManager={frontOfficeManager}
        onBack={() => {
          setCurrPage('')
        }}
      />
    )
  }

  return (
    <Portal.Host>
      <Navbar title='Trophy Case' navigation={navigation} />
      <View
        style={{
          flexDirection: 'row',
          paddingTop: 10,
          paddingLeft: 10,
          paddingRight: 10,
        }}
      >
        <MenuOption
          optionName='GOAT'
          icon={<FontAwesome5 name='crown' size={80} />}
          onPress={() => {
            setCurrPage('GOAT')
          }}
        />
        <MenuOption
          optionName='Team Trophies'
          icon={<FontAwesome name='trophy' size={80} />}
          onPress={() => {
            setCurrPage('Team Trophies')
          }}
        />
        <MenuOption
          optionName='Hall of Fame'
          icon={<FontAwesome name='star' size={80} />}
          onPress={() => {
            setCurrPage('Hall of Fame')
          }}
        />
      </View>
    </Portal.Host>
  )
}

const mapStateToProps = (state: any) => ({
  guild: state.guild,
  frontOffice: state.frontOffice,
  league: state.league,
})

export default connect(mapStateToProps, null)(TrophyCase)
