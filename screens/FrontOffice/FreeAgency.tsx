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
import { FrontOfficeManager, FreeAgent } from '../../lib/FrontOfficeManager'
import { Hero } from '../../lib/model/Hero'
import { FontAwesome } from '@expo/vector-icons'
import ContractDrilldown from './ContractDrilldown'
import { Portal } from 'react-native-paper'

import * as guildActions from '../../redux/guildWidget'
import * as frontOfficeActions from '../../redux/frontOfficeWidget'
import * as leagueActions from '../../redux/leagueWidget'
import { connect } from 'react-redux'

interface Props {
  frontOfficeManager: FrontOfficeManager
  saveFrontOffice: Function
  saveGuild: Function
  saveLeague: Function
  navigation: any
  onBack: Function
}

const FreeAgency: React.FC<Props> = ({
  frontOfficeManager,
  saveFrontOffice,
  saveGuild,
  saveLeague,
  navigation,
  onBack,
}) => {
  const [selectedHero, setSelectedHero] = React.useState<any>(null)

  const freeAgents = frontOfficeManager.getFreeAgents()
  const signFreeAgent = (newContract: any) => {
    frontOfficeManager.signFreeAgent(selectedHero, newContract)
    const serializedTeam = frontOfficeManager.getPlayer().serialize()
    saveGuild(serializedTeam)

    const serializedFrontOffice = frontOfficeManager.serialize()
    saveFrontOffice(serializedFrontOffice)

    const serializedLeagueObj = frontOfficeManager.getSerializedNonPlayerTeams()
    saveLeague(serializedLeagueObj)
  }

  const renderRow = (hero: Hero) => {
    const stars = []
    for (let i = 0; i < hero.potential; i++) {
      stars.push(<FontAwesome key={`star-${i}`} name='star' size={15} />)
    }
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
        <View style={{ flex: 1.5 }}>
          <Button
            onPress={() => {
              setSelectedHero(hero)
            }}
            style={{ padding: 5, width: '80%' }}
            textStyle={{ fontSize: 10 }}
            text='Sign'
          />
        </View>
      </View>
    )
  }

  const renderContent = () => {
    if (!selectedHero) {
      if (freeAgents.length == 0) {
        return (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 50,
            }}
          >
            <Text style={{ fontSize: 30, fontStyle: 'italic', color: '#ddd' }}>
              No Free Agents yet!
            </Text>
          </View>
        )
      }
      return (
        <View style={{ flexDirection: 'row', marginTop: 20 }}>
          <View style={{ flexDirection: 'column', flex: 1 }}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.nameColumn}></Text>
              <Text style={styles.headerText}>OVR</Text>
              <Text style={styles.headerText}>ATK</Text>
              <Text style={styles.headerText}>DEF</Text>
              <Text style={styles.headerText}>SPD</Text>
              <Text style={styles.headerText}>MGK</Text>
              <Text style={styles.headerText}>HP</Text>
              <Text style={styles.headerText}>Pot.</Text>
              <Text style={styles.headerText}>Type</Text>
              <Text style={{ flex: 1.5 }} />
            </View>
            <ScrollView alwaysBounceVertical style={{ paddingBottom: 20 }}>
              {freeAgents.map((freeAgent: FreeAgent) => {
                return renderRow(freeAgent.hero)
              })}
            </ScrollView>
          </View>
        </View>
      )
    } else {
      return (
        <ContractDrilldown
          isFreeAgent={true}
          frontOfficeManager={frontOfficeManager}
          hero={selectedHero}
          onBack={() => {
            setSelectedHero(null)
          }}
          onSign={(newContract: any) => {
            signFreeAgent(newContract)
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
      <Navbar title='Free Agents' navigation={navigation} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
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

export default connect(null, {
  ...frontOfficeActions,
  ...guildActions,
  ...leagueActions,
})(FreeAgency)

const styles = StyleSheet.create({
  textRow: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
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
