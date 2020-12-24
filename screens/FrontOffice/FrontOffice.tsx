import * as React from 'react'
import { connect } from 'react-redux'
import { View } from 'react-native'
import { saveGuild } from '../../redux/guildWidget'
import { MenuOption } from '../Home/components'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { Navbar } from '../../components'
import { FrontOfficeManager } from '../../lib/FrontOfficeManager'
import { Contracts } from './Contracts'
import { Trades } from './Trades'

interface Props {
  guild: any
}

const FrontOffice: React.FC<Props> = ({ guild }) => {
  const [frontOfficeManager, setFrontOfficeManager] = React.useState<any>(null)
  const [currPage, setCurrPage] = React.useState<string>('')

  React.useEffect(() => {
    if (guild) {
      const foManager: FrontOfficeManager = new FrontOfficeManager(guild)
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
    return <View />
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
})

export default connect(mapStateToProps, { ...saveGuild })(FrontOffice)
