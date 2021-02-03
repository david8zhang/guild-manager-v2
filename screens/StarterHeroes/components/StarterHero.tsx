import * as React from 'react'
import { Pressable, Text, View } from 'react-native'
import { Button } from '../../../components/Button'
import { HeroImage } from '../../../components'
import { Hero } from '../../../lib/model/Hero'

interface Props {
  hero: Hero
  onShowDetails: Function
  attack: number
  defense: number
  speed: number
  potential: number
  health: number
  name: string
  teamColor: string
  onPick?: Function
  isPicked?: boolean
  button?: any
  style?: any
  innerStyle?: any
}

export const StarterHero: React.FC<Props> = ({
  onShowDetails,
  onPick,
  isPicked,
  name,
  button,
  hero,
  teamColor,
  style,
  innerStyle,
}) => {
  const overall = hero.getOverall()
  return (
    <View
      style={{
        flexDirection: 'column',
        width: '30%',
        margin: 5,
        ...style,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: 'white',
          height: 115,
          borderRadius: 5,
          ...innerStyle,
        }}
      >
        <View style={{ flex: 1 }}>
          <HeroImage
            hero={hero}
            width={100}
            height={115}
            teamColor={teamColor}
          />
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
