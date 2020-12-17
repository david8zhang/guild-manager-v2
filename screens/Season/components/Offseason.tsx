import * as React from 'react'
import { Text, View } from 'react-native'
import { Button, Navbar } from '../../../components'
import { SeasonManager } from '../../../lib/SeasonManager'
import { TrainingCamp } from './TrainingCamp'

interface Props {
  seasonManager: SeasonManager
  onRestartSeason: Function
}

export const Offseason: React.FC<Props> = ({
  seasonManager,
  onRestartSeason,
}) => {
  const [statsToTrain, setStatsToTrain] = React.useState<string[]>([])
  const [campStarted, setCampStarted] = React.useState<boolean>(false)

  const selectStatToTrain = (stat: string) => {
    if (statsToTrain.length < 2) {
      setStatsToTrain(statsToTrain.concat(stat))
    }
  }

  const deselectStatToTrain = (stat: string) => {
    const newStatsToTrain = statsToTrain.filter((s) => s !== stat)
    setStatsToTrain(newStatsToTrain)
  }

  const isStatSelected = (stat: string): boolean => {
    return statsToTrain.includes(stat)
  }

  const startTrainingCamp = () => {
    setCampStarted(true)
  }

  if (campStarted) {
    return (
      <TrainingCamp
        seasonManager={seasonManager}
        statsToTrain={statsToTrain}
        onFinishTrainingCamp={() => {
          setCampStarted(false)
          onRestartSeason()
        }}
      />
    )
  }

  const stats = ['Attack', 'Defense', 'Speed', 'Magic', 'Health']
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Navbar title='Offseason' />
      <View style={{ margin: 15, flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 25 }}>Offseason Training Camp</Text>
          <Text style={{ fontSize: 16 }}>
            Select 2 areas to focus on during training camp
          </Text>
        </View>
        <View>
          {statsToTrain.length === 2 ? (
            <Button
              text='Start Camp'
              onPress={() => {
                startTrainingCamp()
              }}
            />
          ) : (
            <View />
          )}
        </View>
      </View>
      <View style={{ flexDirection: 'row' }}>
        {stats.map((stat) => {
          const averageStatValue = seasonManager.getPlayerTeamAverageStat(stat)
          const statSelected = isStatSelected(stat)
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
                  if (statSelected) {
                    deselectStatToTrain(stat)
                  } else {
                    selectStatToTrain(stat)
                  }
                }}
              />
            </View>
          )
        })}
      </View>
    </View>
  )
}
