import * as React from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { SeasonManager } from '../../../lib/SeasonManager'
import { FontAwesome } from '@expo/vector-icons'
import { HeroFactory } from '../../../lib/factory/HeroFactory'
import { Hero } from '../../../lib/model/Hero'

interface Props {
  statsToTrain: string[]
  seasonManager: SeasonManager
  onFinishTrainingCamp: Function
  heroesToTrain: Hero[]
}

export const TrainingCamp: React.FC<Props> = ({
  statsToTrain,
  seasonManager,
  onFinishTrainingCamp,
  heroesToTrain,
}) => {
  const [trainingResult, setTrainingResult] = React.useState<any>(null)
  const [trainedStatIndex, setTrainedStatIndex] = React.useState<number>(0)
  React.useEffect(() => {
    const result = seasonManager.trainStats(statsToTrain, heroesToTrain)
    const { trainingResult, statIncreases } = result
    const playerTeamId = seasonManager.getPlayer().teamId
    seasonManager.applyStatIncreases(playerTeamId, statIncreases)
    setTrainingResult(trainingResult)
  }, [])

  const trainedStat = statsToTrain[trainedStatIndex]

  const formatStatIncreaseText = (
    stat: string,
    heroId: string,
    value: number
  ) => {
    let statNumber = `${value}`
    if (trainingResult && trainedStat.toLowerCase() === stat.toLowerCase()) {
      const heroStatIncrease = trainingResult[stat].find(
        (payload: any) => payload.heroId === heroId
      )
      statNumber = `${value} (+${heroStatIncrease.amountToIncrease})`
    }
    return statNumber
  }

  const renderRow = (heroId: string) => {
    const heroRef: Hero = seasonManager.getPlayer().getHero(heroId) as Hero
    if (!heroRef) {
      return <View />
    }
    const stars = []
    for (let i = 0; i < heroRef.potential; i++) {
      stars.push(<FontAwesome key={`star-${i}`} name='star' size={15} />)
    }
    return (
      <View
        key={heroRef.heroId}
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          height: 35,
        }}
      >
        <Text style={{ ...styles.nameColumn, fontSize: 16 }}>
          {heroRef.name}
        </Text>
        <Text style={styles.textRow}>
          {formatStatIncreaseText('attack', heroId, heroRef.attack)}
        </Text>
        <Text style={styles.textRow}>
          {formatStatIncreaseText('defense', heroId, heroRef.defense)}
        </Text>
        <Text style={styles.textRow}>
          {formatStatIncreaseText('speed', heroId, heroRef.speed)}
        </Text>
        <Text style={styles.textRow}>
          {formatStatIncreaseText('magic', heroId, heroRef.magic)}
        </Text>
        <Text style={styles.textRow}>
          {formatStatIncreaseText('health', heroId, heroRef.health)}
        </Text>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {stars}
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image
            style={{ width: 15, height: 15 }}
            source={HeroFactory.getIcon(heroRef.heroType)}
          ></Image>
        </View>
      </View>
    )
  }

  return (
    <View
      style={{ flexDirection: 'column', flex: 1, backgroundColor: 'white' }}
    >
      <View
        style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}
      >
        <Pressable
          style={{ padding: 20 }}
          onPress={() => {
            if (trainedStatIndex > 0) {
              setTrainedStatIndex(trainedStatIndex - 1)
            }
          }}
        >
          <FontAwesome
            name='chevron-left'
            size={20}
            color={trainedStatIndex == 0 ? 'white' : 'black'}
            style={{
              marginRight: 10,
            }}
          />
        </Pressable>
        <Text
          style={{
            flex: 1,
            fontSize: 20,
            textAlign: 'center',
          }}
        >
          {`${trainedStat.slice(0, 1).toUpperCase()}${trainedStat.slice(
            1
          )} training results`}
        </Text>

        <Pressable
          style={{ padding: 20 }}
          onPress={() => {
            if (trainedStatIndex < statsToTrain.length - 1) {
              setTrainedStatIndex(trainedStatIndex + 1)
            } else {
              onFinishTrainingCamp()
            }
          }}
        >
          <FontAwesome
            name='chevron-right'
            size={20}
            color='black'
            style={{ marginRight: 10 }}
          />
        </Pressable>
      </View>
      <View
        style={{
          flexDirection: 'row',
        }}
      >
        <Text style={styles.nameColumn}></Text>
        <Text style={styles.textRow}>Attack</Text>
        <Text style={styles.textRow}>Defense</Text>
        <Text style={styles.textRow}>Speed</Text>
        <Text style={styles.textRow}>Magic</Text>
        <Text style={styles.textRow}>Health</Text>
        <Text style={styles.textRow}>Potential</Text>
        <Text style={styles.textRow}>Type</Text>
      </View>
      {heroesToTrain.map((hero: Hero) => {
        return renderRow(hero.heroId)
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  textRow: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
  },
  nameColumn: {
    flex: 2,
    textAlign: 'left',
    paddingLeft: 10,
  },
  headerRow: {
    marginBottom: 20,
    marginTop: 20,
  },
})
