import * as React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Button } from '../../../components'
import { HeroInMatch } from '../../../lib/model/HeroInMatch'
import { FontAwesome } from '@expo/vector-icons'
import { HeroStats } from '../../../lib/model/HeroStats'
import { SeasonManager } from '../../../lib/SeasonManager'
import { Team } from '../../../lib/model/Team'

interface Props {
  matchStats: {
    [heroId: string]: HeroStats
  }
  playerTeam: Team
  enemyTeam: Team
  seasonManager: SeasonManager
  onContinue: Function
}

export const MatchStats: React.FC<Props> = ({
  matchStats,
  onContinue,
  playerTeam,
  enemyTeam,
}) => {
  const [teamToShowStats, setTeamToShowStats] = React.useState('player')

  const renderRow = (heroId: string, team: Team) => {
    const heroRef = team.getHero(heroId)
    const heroStats = matchStats[heroId]
    if (heroRef) {
      return (
        <View key={heroId} style={{ flexDirection: 'row' }}>
          <Text style={styles.nameColumn}>{heroRef.name}</Text>
          <Text style={styles.textRow}>{heroStats.numPoints}</Text>
          <Text style={styles.textRow}>{heroStats.numKills}</Text>
          <Text style={styles.textRow}>{heroStats.numDeaths}</Text>
        </View>
      )
    }
    return <View key={heroId} />
  }

  const team = teamToShowStats === 'player' ? playerTeam : enemyTeam

  return (
    <View style={{ flexDirection: 'column', flex: 1 }}>
      <Text style={{ fontSize: 20, textAlign: 'center', marginTop: 20 }}>
        Post Match Stats
      </Text>
      <View
        style={{
          marginBottom: 40,
          marginTop: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {teamToShowStats === 'enemy' && (
          <Pressable
            style={{ padding: 20 }}
            onPress={() => {
              setTeamToShowStats('player')
            }}
          >
            <FontAwesome
              name='chevron-left'
              size={20}
              style={{ marginLeft: 10 }}
            />
          </Pressable>
        )}
        <Text
          style={{
            flex: 1,
            marginLeft: teamToShowStats === 'player' ? 70 : 0,
            marginRight: teamToShowStats === 'enemy' ? 70 : 0,
            fontSize: 24,
            textAlign: 'center',
          }}
        >
          {team.name}
        </Text>
        {teamToShowStats === 'player' && (
          <Pressable
            style={{ padding: 20 }}
            onPress={() => {
              setTeamToShowStats('enemy')
            }}
          >
            <FontAwesome
              name='chevron-right'
              size={20}
              style={{ marginRight: 10 }}
            />
          </Pressable>
        )}
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.nameColumn}></Text>
        <Text style={styles.textRow}>Points</Text>
        <Text style={styles.textRow}>Kills</Text>
        <Text style={styles.textRow}>Deaths</Text>
      </View>
      {Object.keys(matchStats).map((heroId: string) => {
        return renderRow(heroId, team)
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
    flex: 1,
    textAlign: 'left',
    paddingLeft: 10,
    fontSize: 18,
  },
  headerRow: {
    marginBottom: 20,
    marginTop: 20,
  },
})
