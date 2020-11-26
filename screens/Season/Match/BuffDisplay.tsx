import * as React from 'react'
import { View, Text } from 'react-native'
import { Buff, HeroInMatch } from '../../../lib/model/HeroInMatch'
import { SimpleLineIcons, MaterialCommunityIcons } from '@expo/vector-icons'

interface Props {
  hero: HeroInMatch
}

export const BuffDisplay: React.FC<Props> = ({ hero }) => {
  const currBuffs: Buff[] = hero.getBuffs()
  const statBuffGroupings: any = {}
  currBuffs.forEach((buff: Buff) => {
    if (!statBuffGroupings[buff.stat]) {
      statBuffGroupings[buff.stat] = buff.percentage
    } else {
      statBuffGroupings[buff.stat] *= buff.percentage
    }
  })

  const getIconForStat = (stat: string) => {
    if (stat === 'magic') {
      return <SimpleLineIcons size={15} name='magic-wand' color='blue' />
    } else {
      let iconName = ''
      switch (stat) {
        case 'attack':
          iconName = 'sword-cross'
          break
        case 'defense':
          iconName = 'shield'
          break
        case 'speed':
          iconName = 'run-fast'
          break
      }
      return <MaterialCommunityIcons size={15} name={iconName} color='blue' />
    }
  }

  return (
    <View
      style={{
        width: '80%',
        flexDirection: 'row',
        marginTop: 10,
        paddingBottom: 2,
        justifyContent: 'flex-end',
        height: 20,
      }}
    >
      {Object.keys(statBuffGroupings).map((stat: string) => {
        const percentage = statBuffGroupings[stat]
        return (
          <View
            key={stat}
            style={{
              flexDirection: 'row',
              marginRight: 5,
              alignItems: 'center',
            }}
          >
            {getIconForStat(stat)}
            <Text style={{ color: 'blue', fontSize: 10, fontStyle: 'italic' }}>
              x{statBuffGroupings[stat].toFixed(2)}
            </Text>
          </View>
        )
      })}
    </View>
  )
}
