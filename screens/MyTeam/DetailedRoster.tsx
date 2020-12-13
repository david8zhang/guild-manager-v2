import * as React from 'react'
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { Hero } from '../../lib/model/Hero'
import { FontAwesome } from '@expo/vector-icons'
import { HeroFactory } from '../../lib/factory/HeroFactory'

interface Props {
  heroes: Hero[]
  onBack: Function
}

export const DetailedRoster: React.FC<Props> = ({ heroes, onBack }) => {
  const renderRow = (hero: Hero) => {
    const matchStats = hero.matchStats
    const stars = []
    for (let i = 0; i < hero.potential; i++) {
      stars.push(<FontAwesome key={`star-${i}`} name='star' size={15} />)
    }
    return (
      <View
        key={hero.heroId}
        style={{ flexDirection: 'row', height: 35, alignItems: 'center' }}
      >
        <Text style={{ ...styles.nameColumn, fontSize: 13 }}>{hero.name}</Text>
        <Text style={styles.textRow}>{hero.attack}</Text>
        <Text style={styles.textRow}>{hero.defense}</Text>
        <Text style={styles.textRow}>{hero.magic}</Text>
        <Text style={styles.textRow}>{hero.speed}</Text>
        <Text style={styles.textRow}>{hero.health}</Text>
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
        <Text style={styles.textRow}>{matchStats.averageKillsPerGame}</Text>
        <Text style={styles.textRow}>{matchStats.averageDeathsPerGame}</Text>
        <Text style={styles.textRow}>
          {matchStats.totalDeaths == 0
            ? matchStats.totalKills
            : matchStats.totalKills / matchStats.totalDeaths}
        </Text>
        <Text style={styles.textRow}>{matchStats.totalDeaths}</Text>
        <Text style={styles.textRow}>{matchStats.totalKills}</Text>
        <Text style={styles.textRow}>{matchStats.totalMatchesPlayed}</Text>
      </View>
    )
  }

  return (
    <View style={{ flexDirection: 'row' }}>
      <View style={{ flexDirection: 'column', flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}></View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.nameColumn}></Text>
          <Text style={styles.textRow}>ATK</Text>
          <Text style={styles.textRow}>DEF</Text>
          <Text style={styles.textRow}>SPD</Text>
          <Text style={styles.textRow}>MGK</Text>
          <Text style={styles.textRow}>HP</Text>
          <Text style={styles.textRow}>Pot.</Text>
          <Text style={styles.textRow}>Type</Text>
          <Text style={styles.textRow}>KPG</Text>
          <Text style={styles.textRow}>DPG</Text>
          <Text style={styles.textRow}>K/D</Text>
          <Text style={styles.textRow}>TD</Text>
          <Text style={styles.textRow}>TK</Text>
          <Text style={styles.textRow}>TM</Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {heroes.map((hero: Hero) => {
            return renderRow(hero)
          })}
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  textRow: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
  },
  nameColumn: {
    flex: 3,
    textAlign: 'left',
    paddingLeft: 10,
  },
  headerRow: {
    marginBottom: 20,
    marginTop: 20,
  },
})
