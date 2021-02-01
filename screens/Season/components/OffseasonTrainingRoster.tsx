import * as React from 'react'
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Hero } from '../../../lib/model/Hero'
import { FontAwesome } from '@expo/vector-icons'
import { HeroFactory } from '../../../lib/factory/HeroFactory'
import { Button } from '../../../components'

interface Props {
  heroes: Hero[]
  onHeroSelect?: Function
  selectedHeroIds?: string[]
}

export const OffseasonTrainingRoster: React.FC<Props> = ({
  heroes,
  onHeroSelect,
  selectedHeroIds,
}) => {
  const renderRow = (hero: Hero) => {
    const stars = []
    for (let i = 0; i < hero.potential; i++) {
      stars.push(<FontAwesome key={`star-${i}`} name='star' size={15} />)
    }
    const isHeroSelected = selectedHeroIds?.includes(hero.heroId)
    return (
      <View
        key={hero.heroId}
        style={{ flexDirection: 'row', height: 35, alignItems: 'center' }}
      >
        <Text style={{ ...styles.nameColumn, fontSize: 13 }}>{hero.name}</Text>
        <Text style={styles.textRow}>{hero.getOverall()}</Text>
        <Text style={styles.textRow}>{hero.attack}</Text>
        <Text style={styles.textRow}>{hero.defense}</Text>
        <Text style={styles.textRow}>{hero.magic}</Text>
        <Text style={styles.textRow}>{hero.speed}</Text>
        <Text style={styles.textRow}>{hero.health}</Text>
        <Text style={styles.textRow}>{hero.age}</Text>
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
        {onHeroSelect && (
          <View style={{ flex: 1.75 }}>
            <Button
              style={{
                backgroundColor: isHeroSelected ? '#444' : 'white',
                padding: 5,
              }}
              textStyle={{
                fontSize: 12,
                color: isHeroSelected ? 'white' : '#444',
              }}
              onPress={() => {
                onHeroSelect(hero, isHeroSelected)
              }}
              text={isHeroSelected ? 'Deselect' : 'Select'}
            />
          </View>
        )}
      </View>
    )
  }

  return (
    <View style={{ flexDirection: 'row', flex: 1 }}>
      <View style={{ flexDirection: 'column', flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}></View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.nameColumn}></Text>
          <Text style={styles.textRow}>OVR</Text>
          <Text style={styles.textRow}>ATK</Text>
          <Text style={styles.textRow}>DEF</Text>
          <Text style={styles.textRow}>SPD</Text>
          <Text style={styles.textRow}>MGK</Text>
          <Text style={styles.textRow}>HP</Text>
          <Text style={styles.textRow}>Age</Text>
          <Text style={styles.textRow}>Pot.</Text>
          <Text style={styles.textRow}>Type</Text>
          {onHeroSelect && <Text style={{ flex: 1.75 }} />}
        </View>
        <ScrollView
          showsVerticalScrollIndicator
          contentContainerStyle={{ paddingBottom: 30 }}
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
    flex: 2,
    textAlign: 'left',
    paddingLeft: 10,
  },
  headerRow: {
    marginBottom: 20,
    marginTop: 20,
  },
})
