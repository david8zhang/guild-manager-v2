import * as React from 'react'
import { Pressable, StyleSheet, Text, View, Image } from 'react-native'
import { Button } from '../../../components'
import { MatchManager } from '../../../lib/MatchManager'
import { HeroInMatch } from '../../../lib/model/HeroInMatch'
import { FontAwesome } from '@expo/vector-icons'
import { HeroFactory } from '../../../lib/factory/HeroFactory'
import { Hero } from '../../../lib/model/Hero'
import { SeasonManager } from '../../../lib/SeasonManager'

interface Props {
  onContinue: Function
  onBack: Function
  statIncreases: {
    [heroId: string]: any
  }
  seasonManager: SeasonManager
}

export const PostMatchStatGains: React.FC<Props> = ({
  seasonManager,
  onContinue,
  onBack,
  statIncreases,
}) => {
  const team = seasonManager.getPlayer()
  const playerHeroes = team.getStarters()

  const formatStatIncreaseText = (
    stat: string,
    value: number,
    increasePayload: any
  ) => {
    let statNumber = `${value}`
    if (increasePayload && increasePayload.statToIncrease === stat) {
      statNumber = `${value + increasePayload.amountToIncrease} (+${
        increasePayload.amountToIncrease
      })`
    }
    return statNumber
  }

  console.log(statIncreases)

  const renderRow = (hero: Hero) => {
    const stars = []
    for (let i = 0; i < hero.potential; i++) {
      stars.push(<FontAwesome key={`star-${i}`} name='star' size={15} />)
    }
    const increasePayload = statIncreases[hero.heroId]
    return (
      <View
        key={hero.heroId}
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          height: 35,
        }}
      >
        <Text style={{ ...styles.nameColumn, fontSize: 16 }}>{hero.name}</Text>
        <Text style={styles.textRow}>
          {formatStatIncreaseText('attack', hero.attack, increasePayload)}
        </Text>
        <Text style={styles.textRow}>
          {formatStatIncreaseText('defense', hero.defense, increasePayload)}
        </Text>
        <Text style={styles.textRow}>
          {formatStatIncreaseText('speed', hero.speed, increasePayload)}
        </Text>
        <Text style={styles.textRow}>
          {formatStatIncreaseText('magic', hero.magic, increasePayload)}
        </Text>
        <Text style={styles.textRow}>
          {formatStatIncreaseText('health', hero.health, increasePayload)}
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
            source={HeroFactory.getIcon(hero.heroType)}
          ></Image>
        </View>
      </View>
    )
  }

  return (
    <View style={{ flexDirection: 'column', flex: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Pressable
          style={{ padding: 20 }}
          onPress={() => {
            onBack()
          }}
        >
          <FontAwesome
            name='chevron-left'
            size={20}
            style={{ marginLeft: 10 }}
          />
        </Pressable>
        <Text
          style={{
            flex: 1,
            fontSize: 20,
            textAlign: 'center',
            marginTop: 20,
            marginRight: 50,
          }}
        >
          Post Match Stat Improvements
        </Text>
      </View>
      <View
        style={{
          marginBottom: 40,
          marginTop: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            fontSize: 24,
            textAlign: 'center',
          }}
        >
          {team.name}
        </Text>
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
      {playerHeroes.map((hero: Hero) => {
        return renderRow(hero)
      })}
      <View
        style={{
          alignItems: 'center',
          marginTop: 20,
          marginRight: 10,
        }}
      >
        <Button
          text='Continue'
          onPress={() => {
            onContinue()
          }}
        />
      </View>
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
