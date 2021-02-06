import * as React from 'react'
import { Pressable, Text, View } from 'react-native'
import { Navbar } from '../../components'
import { FontAwesome } from '@expo/vector-icons'
import { FrontOfficeManager, HallOfFamer } from '../../lib/FrontOfficeManager'
import { Portal } from 'react-native-paper'
import { ScrollView } from 'react-native-gesture-handler'
import { chunk } from 'lodash'
import { HallOfFameHero } from './HallOfFameHero'
import { HallOfFameHeroDrilldown } from './HallOfFameHeroDrilldown'

interface Props {
  navigation: any
  frontOfficeManager: FrontOfficeManager
  onBack: Function
}

export const HallOfFame: React.FC<Props> = ({
  navigation,
  frontOfficeManager,
  onBack,
}) => {
  const [
    hofToDrilldown,
    setHofToDrilldown,
  ] = React.useState<HallOfFamer | null>(null)
  const hallOfFamers = frontOfficeManager.getHallOfFamers()
  const chunks = chunk(hallOfFamers, 3)
  return (
    <Portal.Host>
      <Navbar title='Hall of Fame' navigation={navigation} />
      {hofToDrilldown && (
        <HallOfFameHeroDrilldown
          hallOfFamer={hofToDrilldown as HallOfFamer}
          isOpen={hofToDrilldown !== null}
          onClose={() => setHofToDrilldown(null)}
          frontOfficeManager={frontOfficeManager}
        />
      )}
      <View style={{ padding: 10 }}>
        <Pressable
          onPress={() => {
            onBack()
          }}
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            marginBottom: 10,
          }}
        >
          <FontAwesome name='chevron-left' size={16} />
          <Text style={{ fontSize: 16, marginLeft: 10 }}>Back</Text>
        </Pressable>
      </View>
      <ScrollView>
        {chunks.map((chunk, index) => {
          return (
            <View
              key={`chunk-${index}`}
              style={{ flexDirection: 'row', width: '100%' }}
            >
              {chunk.map((h) => {
                return (
                  <View key={h.heroId} style={{ flex: 1, maxWidth: '33%' }}>
                    <HallOfFameHero
                      hallOfFamer={h}
                      frontOfficeManager={frontOfficeManager}
                      onShowDetails={() => {
                        setHofToDrilldown(h)
                      }}
                    />
                  </View>
                )
              })}
            </View>
          )
        })}
      </ScrollView>
    </Portal.Host>
  )
}
