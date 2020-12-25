import * as React from 'react'
import { View } from 'react-native'
import { Portal } from 'react-native-paper'

import { MenuOption } from '../Home/components'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { Navbar } from '../../components'
import { FrontOfficeManager } from '../../lib/FrontOfficeManager'
import { Contracts } from './Contracts'
import { Trades } from './Trades'
import { default as FreeAgency } from './FreeAgency'

// Redux
import { connect } from 'react-redux'

interface Props {
  guild: any
  league: any
  frontOffice: any
  navigation: any
}

const FrontOffice: React.FC<Props> = ({
  guild,
  league,
  frontOffice,
  navigation,
}) => {
  const [frontOfficeManager, setFrontOfficeManager] = React.useState<any>(null)
  const [currPage, setCurrPage] = React.useState<string>('')

  React.useEffect(() => {
    const foManager: FrontOfficeManager = new FrontOfficeManager(guild, league)
    if (frontOffice) {
      foManager.deserializeObj(frontOffice)
    }
    setFrontOfficeManager(foManager)
  }, [frontOffice])

  if (currPage === 'Contracts') {
    return (
      <Contracts
        navigation={navigation}
        frontOfficeManager={frontOfficeManager}
        onBack={() => {
          setCurrPage('')
        }}
      />
    )
  }

  if (currPage === 'Trades') {
    return <Trades />
  }

  if (currPage === 'Free Agents') {
    return (
      <FreeAgency
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
      <Navbar title='Front Office' navigation={navigation} />
      <View
        style={{
          flexDirection: 'row',
          paddingTop: 10,
          paddingLeft: 10,
          paddingRight: 10,
        }}
      >
        <MenuOption
          optionName='Contracts'
          icon={
            <MaterialCommunityIcons
              name='file-document-edit-outline'
              size={80}
            />
          }
          onPress={() => {
            setCurrPage('Contracts')
          }}
        />
        <MenuOption
          optionName='Trades'
          icon={<MaterialCommunityIcons name='account-switch' size={80} />}
          onPress={() => {
            setCurrPage('Trades')
          }}
        />
        <MenuOption
          optionName='Free Agents'
          icon={<MaterialIcons name='person-add' size={80} />}
          onPress={() => {
            setCurrPage('Free Agents')
          }}
        />
      </View>
    </Portal.Host>
  )
}

const mapStateToProps = (state: any) => ({
  guild: state.guild,
  league: state.league,
  frontOffice: state.frontOffice,
})

export default connect(mapStateToProps, null)(FrontOffice)
