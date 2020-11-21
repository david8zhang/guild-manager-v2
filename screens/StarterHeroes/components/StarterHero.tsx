import * as React from 'react'
import { Pressable, Text, View } from 'react-native'
import { Button } from '../../../components/Button'
import { MaterialCommunityIcons } from '@expo/vector-icons'

interface Props {
  onShowDetails: Function
  attack: number
  defense: number
  heroType: string
  speed: number
  potential: number
  health: number
  name: string
  onPick?: Function
  isPicked?: boolean
  button?: any
}

export const StarterHero: React.FC<Props> = ({
  onShowDetails,
  heroType,
  attack,
  defense,
  speed,
  onPick,
  isPicked,
  name,
  button,
}) => {
  const overall = Math.round((attack + defense + speed) / 3)
  return (
    <View
      style={{
        flexDirection: 'column',
        width: '30%',
        margin: 5,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: 'white',
          height: 115,
          borderRadius: 5,
        }}
      >
        <View style={{ flex: 1 }}>
          <View
            style={{ backgroundColor: 'gray', width: '90%', height: '100%' }}
          >
            <View
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                padding: 5,
                borderColor: 'black',
                borderWidth: 1,
                backgroundColor: 'white',
              }}
            >
              <MaterialCommunityIcons
                name={heroType === 'attacker' ? 'sword-cross' : 'medical-bag'}
                size={20}
              />
            </View>
          </View>
        </View>
        <View style={{ flex: 1, flexDirection: 'column', padding: 5 }}>
          <Text style={{ fontSize: 14, height: 35 }}>{name}</Text>
          <Text style={{ fontSize: 30 }}>{overall}</Text>
          <Pressable
            onPress={() => {
              onShowDetails()
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: 'bold',
                textDecorationLine: 'underline',
                color: 'blue',
              }}
            >
              More Info
            </Text>
          </Pressable>
        </View>
      </View>

      {button || (
        <Button
          text={isPicked ? 'Unpick' : 'Pick'}
          onPress={() => {
            if (onPick) {
              onPick()
            }
          }}
          style={{
            width: '100%',
            padding: 5,
            marginTop: 10,
            backgroundColor: isPicked ? 'gray' : 'white',
          }}
          textStyle={{ color: isPicked ? 'white' : 'black' }}
        />
      )}
    </View>
  )
}
