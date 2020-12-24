import * as React from 'react'
import { Text, View } from 'react-native'
import { Button, Navbar } from '../../../components'
import { Hero } from '../../../lib/model/Hero'
import { SeasonManager } from '../../../lib/SeasonManager'
import { OffseasonTrainingRoster } from './OffseasonTrainingRoster'
import { OffseasonStatPicker } from './OffseasonStatPicker'
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
  const [heroesToTrain, setHeroesToTrain] = React.useState<any[]>([])
  const [campStarted, setCampStarted] = React.useState<boolean>(false)
  const [selectStage, setSelectStage] = React.useState<string>('hero')

  const selectStatToTrain = (stat: string) => {
    if (statsToTrain.length < 2) {
      setStatsToTrain(statsToTrain.concat(stat))
    }
  }

  const deselectStatToTrain = (stat: string) => {
    const newStatsToTrain = statsToTrain.filter((s) => s !== stat)
    setStatsToTrain(newStatsToTrain)
  }

  const startTrainingCamp = () => {
    setCampStarted(true)
  }

  const selectHeroToTrain = (hero: Hero) => {
    if (heroesToTrain.length < 3) {
      const newHeroesToTrain = heroesToTrain.concat(hero)
      setHeroesToTrain(newHeroesToTrain)
    }
  }

  const deselectHeroToTrain = (hero: Hero) => {
    const newHeroesToTrain = heroesToTrain.filter(
      (h) => h.heroId !== hero.heroId
    )
    setHeroesToTrain(newHeroesToTrain)
  }

  if (campStarted) {
    return (
      <TrainingCamp
        seasonManager={seasonManager}
        heroesToTrain={heroesToTrain}
        statsToTrain={statsToTrain}
        onFinishTrainingCamp={() => {
          setCampStarted(false)
          onRestartSeason()
        }}
      />
    )
  }

  const renderContent = () => {
    const stats = ['Attack', 'Defense', 'Speed', 'Magic', 'Health']

    if (selectStage === 'hero') {
      return (
        <OffseasonTrainingRoster
          heroes={seasonManager.getPlayer().roster}
          onHeroSelect={(hero: Hero, isHeroSelected: boolean) => {
            if (isHeroSelected) {
              deselectHeroToTrain(hero)
            } else {
              selectHeroToTrain(hero)
            }
          }}
          selectedHeroIds={heroesToTrain.map((h: Hero) => h.heroId)}
        />
      )
    } else {
      return (
        <OffseasonStatPicker
          statsToTrain={statsToTrain}
          stats={stats}
          getPlayerTeamAverageStat={(stat: string) =>
            SeasonManager.getPlayerTeamAverageStat(stat, heroesToTrain)
          }
          onSelectStat={(stat: string, isStatSelected: boolean) => {
            if (isStatSelected) {
              deselectStatToTrain(stat)
            } else {
              selectStatToTrain(stat)
            }
          }}
        />
      )
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Navbar title='Offseason' />
      <View
        style={{
          margin: 15,
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 22 }}>Offseason Training Camp</Text>
          <Text style={{ fontSize: 16 }}>
            {selectStage === 'hero'
              ? 'Select up to 3 heroes to train in camp'
              : 'Select up to 2 stats to focus on'}
          </Text>
        </View>
        <View style={{ alignSelf: 'center', flexDirection: 'row' }}>
          {selectStage === 'stat' && (
            <Button
              style={{ marginRight: 10 }}
              text='Back'
              onPress={() => {
                setSelectStage('hero')
              }}
            />
          )}
          {((selectStage === 'hero' && heroesToTrain.length >= 1) ||
            (selectStage === 'stat' && statsToTrain.length >= 1)) && (
            <Button
              text='Continue'
              onPress={() => {
                if (selectStage === 'stat') {
                  startTrainingCamp()
                } else {
                  setSelectStage('stat')
                }
              }}
            />
          )}
        </View>
      </View>
      {renderContent()}
    </View>
  )
}
