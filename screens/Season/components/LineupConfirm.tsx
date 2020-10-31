import * as React from 'react'
import { Text, View } from 'react-native'
import { Button } from '../../../components'
import { Hero } from '../../../lib/model/Hero'
import { Team } from '../../../lib/model/Team'

interface Props {
  playerTeam: Team
  onConfirm: Function
}

export const LineupConfirm: React.FC<Props> = ({ playerTeam, onConfirm }) => {
  const { starterIds, roster } = playerTeam
  const starterHeroes = roster.filter((h) => starterIds.includes(h.heroId))
  return (
    <View>
      <View style={{ flexDirection: 'row' }}>
        {starterHeroes.map((hero: Hero) => {
          return (
            <View
              key={hero.heroId}
              style={{ padding: 10, flexDirection: 'column' }}
            >
              <Text>{hero.name}</Text>
              <Button text='Switch' onPress={() => {}} />
            </View>
          )
        })}
      </View>
      <Button
        onPress={() => {
          onConfirm()
        }}
        text='Start Game'
      />
    </View>
  )
}
