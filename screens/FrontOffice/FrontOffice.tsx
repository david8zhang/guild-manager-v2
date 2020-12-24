import * as React from 'react'
import { View } from 'react-native'
import { MenuOption } from '../Home/components'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { Navbar } from '../../components'
import { FrontOfficeManager } from '../../lib/FrontOfficeManager'
import { Contracts } from './Contracts'
import { Trades } from './Trades'
import { default as FreeAgency } from './FreeAgency'

// Redux
import { connect } from 'react-redux'
import { saveGuild } from '../../redux/guildWidget'

interface Props {
  guild: any
  frontOffice: any
}

const FrontOffice: React.FC<Props> = ({ guild, frontOffice }) => {
  const [frontOfficeManager, setFrontOfficeManager] = React.useState<any>(null)
  const [currPage, setCurrPage] = React.useState<string>('')

  React.useEffect(() => {
    if (guild) {
      const foManager: FrontOfficeManager = new FrontOfficeManager(guild)
      if (frontOffice) {
        foManager.deserializeObj(frontOffice)
      }
      setFrontOfficeManager(foManager)
    }
  }, [])

  if (currPage === 'Contracts') {
    return (
      <Contracts
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
    return <FreeAgency frontOfficeManager={frontOfficeManager} />
  }

  return (
    <View>
      <Navbar title='Front Office' />
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
    </View>
  )
}

const mapStateToProps = (state: any) => ({
  guild: state.guild,
  frontOffice: state.frontOffice,
})

export default connect(mapStateToProps, { ...saveGuild })(FrontOffice)
