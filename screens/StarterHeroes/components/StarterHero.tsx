import * as React from 'react'
import { Pressable, Text, View } from 'react-native'
import { Button } from '../../../components'

interface Props {
  onShowDetails: Function
  attack: number
  defense: number
  speed: number
  potential: number
  health: number
  name: number
  onPick: Function
  isPicked: boolean
}

export const StarterHero: React.FC<Props> = ({
  onShowDetails,
  attack,
  defense,
  speed,
  potential,
  health,
  onPick,
  isPicked,
  name,
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
          padding: 10,
          height: 115,
          borderRadius: 5,
        }}
      >
        <View style={{ flex: 1 }}></View>
        <View style={{ flex: 2, flexDirection: 'column' }}>
          <Text style={{ fontSize: 14 }}>{name}</Text>
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
      <Button
        text={isPicked ? 'Unpick' : 'Pick'}
        onPress={() => onPick()}
        style={{
          width: '100%',
          padding: 5,
          marginTop: 10,
          backgroundColor: isPicked ? 'gray' : 'white',
        }}
        textStyle={{ color: isPicked ? 'white' : 'black' }}
      />
    </View>
  )
}
