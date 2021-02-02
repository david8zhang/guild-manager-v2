import * as React from 'react'
import { ScrollView, Text, View } from 'react-native'
import { Navbar } from '../../components'
import { connect } from 'react-redux'
import { FontAwesome } from '@expo/vector-icons'
import { FrontOfficeManager } from '../../lib/FrontOfficeManager'
import { Portal } from 'react-native-paper'

interface Props {
  navigation: any
  guild: any
  league: any
  frontOffice: any
}

const TrophyCase: React.FC<Props> = ({
  navigation,
  guild,
  league,
  frontOffice,
}) => {
  const [
    frontOfficeManager,
    setFrontOfficeManager,
  ] = React.useState<FrontOfficeManager | null>(null)
  React.useEffect(() => {
    const foManager = new FrontOfficeManager(guild, league)
    if (frontOffice) {
      foManager.deserializeObj(frontOffice)
    }
    setFrontOfficeManager(foManager)
  }, [guild, league, frontOffice])

  if (!frontOfficeManager) {
    return <View />
  }

  const championships = frontOfficeManager.championships
  return (
    <Portal.Host>
      <Navbar title='Trophy Case' navigation={navigation} />
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 18 }}>
          Total Championships: {championships.length}
        </Text>
        <ScrollView horizontal style={{ marginTop: 10 }}>
          {championships.map((seasonNumber: number) => {
            return (
              <View
                key={`championship-${seasonNumber}`}
                style={{
                  flexDirection: 'column',
                  padding: 20,
                  height: 200,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: 'black',
                  margin: 5,
                }}
              >
                <FontAwesome
                  name='trophy'
                  color='#d4af37'
                  size={60}
                  style={{ marginBottom: 10 }}
                />
                <Text style={{ textAlign: 'center', fontSize: 25 }}>
                  Season {seasonNumber}
                </Text>
              </View>
            )
          })}
        </ScrollView>
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
