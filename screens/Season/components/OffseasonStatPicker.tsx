import * as React from 'react'
import { View, Text } from 'react-native'
import { Button } from '../../../components'

export interface Props {
  stats: string[]
  statsToTrain: string[]
  getPlayerTeamAverageStat: Function
  onSelectStat: Function
}

export const OffseasonStatPicker: React.FC<Props> = ({
  stats,
  statsToTrain,
  getPlayerTeamAverageStat,
  onSelectStat,
}) => {
  return (
    <View style={{ flexDirection: 'row' }}>
      {stats.map((stat) => {
        const averageStatValue = getPlayerTeamAverageStat(stat)
        const statSelected = statsToTrain.includes(stat)
        return (
          <View
            key={stat}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
              flex: 1,
              height: 210,
              borderWidth: 1,
              borderColor: 'black',
              margin: 5,
            }}
          >
            <Text style={{ fontSize: 20, marginBottom: 5 }}>{stat}</Text>
            <Text style={{ fontSize: 40 }}>{averageStatValue}</Text>
            <Text
              style={{ fontSize: 14, textAlign: 'center', marginBottom: 15 }}
            >
              Avg. {stat}
            </Text>
            <Button
              style={{
                backgroundColor: statSelected ? '#444' : 'white',
              }}
              textStyle={{
                color: statSelected ? 'white' : '#444',
              }}
              text={statSelected ? 'Deselect' : 'Select'}
              onPress={() => {
                onSelectStat(stat, statsToTrain.includes(stat))
              }}
            />
          </View>
        )
      })}
    </View>
  )
}
