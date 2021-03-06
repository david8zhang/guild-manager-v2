import * as React from 'react'
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { Button, Navbar } from '../../components'
import { HeroFactory } from '../../lib/factory/HeroFactory'
import { FrontOfficeManager } from '../../lib/FrontOfficeManager'
import { Hero } from '../../lib/model/Hero'
import { FontAwesome } from '@expo/vector-icons'
import { default as ContractDrilldown } from './ContractDrilldown'
import { Portal } from 'react-native-paper'

interface Props {
  frontOfficeManager: FrontOfficeManager
  onBack: Function
  navigation: any
}

export const Contracts: React.FC<Props> = ({
  frontOfficeManager,
  navigation,
  onBack,
}) => {
  const [selectedHero, setSelectedHero] = React.useState<any>(null)
  const playerHeroes: Hero[] = frontOfficeManager.getPlayerHeroes()

  const renderRow = (hero: Hero) => {
    const stars = []
    for (let i = 0; i < hero.potential; i++) {
      stars.push(<FontAwesome key={`star-${i}`} name='star' size={15} />)
    }
    const contract = hero.getContract()
    const overall = hero.getOverall()
    return (
      <View
        key={hero.heroId}
        style={{ flexDirection: 'row', height: 34, alignItems: 'center' }}
      >
        <Text style={{ ...styles.nameColumn, fontSize: 14 }}>{hero.name}</Text>
        <Text style={styles.textRow}>{overall}</Text>
        <Text style={styles.textRow}>{hero.attack}</Text>
        <Text style={styles.textRow}>{hero.defense}</Text>
        <Text style={styles.textRow}>{hero.speed}</Text>
        <Text style={styles.textRow}>{hero.magic}</Text>
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
        <Text style={styles.textRow}>
          {contract.duration === 0 ? 'Expiring' : `${contract.duration} Yrs.`}
        </Text>
        <Text style={styles.textRow}>{contract.amount}G</Text>
        <View style={{ flex: 1.5 }}>
          <Button
            onPress={() => {
              setSelectedHero(hero)
            }}
            style={{ padding: 5, width: '80%' }}
            textStyle={{ fontSize: 10 }}
            text='Manage'
          />
        </View>
      </View>
    )
  }

  const renderContent = () => {
    if (!selectedHero) {
      return (
        <View style={{ flexDirection: 'row', marginTop: 20, flex: 1 }}>
          <View style={{ flexDirection: 'column', flex: 1 }}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.nameColumn}></Text>
              <Text style={styles.headerText}>OVR</Text>
              <Text style={styles.headerText}>ATK</Text>
              <Text style={styles.headerText}>DEF</Text>
              <Text style={styles.headerText}>SPD</Text>
              <Text style={styles.headerText}>MGK</Text>
              <Text style={styles.headerText}>HP</Text>
              <Text style={styles.headerText}>Age</Text>
              <Text style={styles.headerText}>Pot.</Text>
              <Text style={styles.headerText}>Type</Text>
              <Text style={styles.headerText}>Contract</Text>
              <Text style={styles.headerText}>Salary</Text>
              <Text style={{ flex: 1.5 }} />
            </View>
            <ScrollView
              showsVerticalScrollIndicator
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {playerHeroes.map((hero: Hero) => {
                return renderRow(hero)
              })}
            </ScrollView>
          </View>
        </View>
      )
    } else {
      return (
        <ContractDrilldown
          frontOfficeManager={frontOfficeManager}
          hero={selectedHero}
          onBack={() => {
            setSelectedHero(null)
          }}
        />
      )
    }
  }

  const totalSalary = frontOfficeManager.getTotalSalary()
  const salaryCapSpace = FrontOfficeManager.MAX_SALARY_CAP - totalSalary

  return (
    <Portal.Host>
      <Navbar title='Contracts' navigation={navigation} />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 10,
        }}
      >
        {!selectedHero && (
          <Pressable
            onPress={() => {
              onBack()
            }}
            style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}
          >
            <FontAwesome name='chevron-left' size={20} />
            <Text style={{ fontSize: 20, marginLeft: 10 }}>Back</Text>
          </Pressable>
        )}
        <Text style={{ fontSize: 20, marginRight: 20 }}>
          Salary Cap:{' '}
          <Text style={{ color: salaryCapSpace >= 0 ? 'green' : 'red' }}>
            {salaryCapSpace}G
          </Text>
        </Text>
        <Text style={{ fontSize: 20 }}>Total Salary: {totalSalary}G</Text>
      </View>
      {renderContent()}
    </Portal.Host>
  )
}
const styles = StyleSheet.create({
  textRow: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
  },
  nameColumn: {
    flex: 2.5,
    textAlign: 'left',
    paddingLeft: 10,
  },
  headerRow: {
    marginBottom: 20,
    marginTop: 20,
  },
})
