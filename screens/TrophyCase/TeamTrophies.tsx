import * as React from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { FrontOfficeManager } from '../../lib/FrontOfficeManager'
import { Portal } from 'react-native-paper'
import { FontAwesome } from '@expo/vector-icons'
import { Navbar } from '../../components'

interface Props {
  frontOfficeManager: FrontOfficeManager
  navigation: any
  onBack: Function
}

export const TeamTrophies: React.FC<Props> = ({
  frontOfficeManager,
  navigation,
  onBack,
}) => {
  if (!frontOfficeManager) {
    return <View />
  }

  const championships = frontOfficeManager.championships
  return (
    <Portal.Host>
      <Navbar title='Trophy Case' navigation={navigation} />
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
        <Text style={{ fontSize: 20 }}>
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
