import * as React from 'react'
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { Portal } from 'react-native-paper'
import { Button, HeroImage, Navbar } from '../../components'

import { connect } from 'react-redux'
import * as guildActions from '../../redux/guildWidget'
import * as leagueActions from '../../redux/leagueWidget'
import * as frontOfficeActions from '../../redux/frontOfficeWidget'

import { SeasonManager } from '../../lib/SeasonManager'
import { FrontOfficeManager } from '../../lib/FrontOfficeManager'
import { Hero } from '../../lib/model/Hero'
import { HeroFactory } from '../../lib/factory/HeroFactory'

import { FontAwesome, MaterialIcons } from '@expo/vector-icons'
import { DraftOrderModal } from './DraftOrderModal'
import { Team } from '../../lib/model/Team'
import { HeroDrilldownModal } from '../StarterHeroes/components'

interface Props {
  navigation: any
  guild: any
  league: any
  season: any
  frontOffice: any
  saveGuild: Function
  saveLeague: Function
  saveFrontOffice: Function
}

const Draft: React.FC<Props> = ({
  navigation,
  guild,
  league,
  season,
  frontOffice,
  saveGuild,
  saveLeague,
  saveFrontOffice,
}) => {
  // Managers
  const [seasonManager, setSeasonManager] = React.useState<any>(null)
  const [frontOfficeManager, setFrontOfficeManager] = React.useState<any>(null)

  // Draft initialization
  const [showPickOrderModal, setShowPickOrderModal] = React.useState(true)
  const [pickOrder, setPickOrder] = React.useState<any>({
    draftOrder: [],
    playerDraftPick: 0,
  })

  // Current draft state
  const [currDraftIndex, setCurrDraftIndex] = React.useState(0)
  const [showAvailableRookies, setShowAvailableRookies] = React.useState(true)
  const [draftOutcomes, setDraftOutcomes] = React.useState<any[]>([])

  // Details
  const [heroToDrilldown, setHeroToDrilldown] = React.useState<any>(null)
  const [teamColorToDrilldown, setTeamColorToDrilldown] = React.useState('')

  const getSuffix = (number: number) => {
    if (number === 1) return 'st'
    if (number === 2) return 'nd'
    if (number === 3) return 'rd'
    return 'th'
  }

  React.useEffect(() => {
    if (guild && league) {
      const seasonManager = new SeasonManager(guild, league)
      seasonManager.deserialize(season)
      const frontOfficeManager = new FrontOfficeManager(guild, league)
      frontOfficeManager.deserializeObj(frontOffice)
      setPickOrder(frontOfficeManager.getDraftOrder(seasonManager.teamRecords))
      setSeasonManager(seasonManager)
      setFrontOfficeManager(frontOfficeManager)
    }
  }, [guild, league, frontOffice])

  if (!seasonManager || !frontOfficeManager) {
    return <View />
  }

  const startDraft = () => {
    setShowAvailableRookies(false)
    doNextPick(currDraftIndex)
  }

  const doNextPick = (draftIndex: number) => {
    if (draftIndex >= pickOrder.draftOrder.length) {
      return
    }

    if (draftIndex === pickOrder.playerDraftPick - 1) {
      setShowAvailableRookies(true)
    } else {
      frontOfficeManager.processNextCPUDraftPick(
        draftIndex,
        pickOrder.draftOrder
      )
      setDraftOutcomes(frontOfficeManager.getDraftOutcomes())
    }
  }

  const doPlayerPick = (hero: Hero) => {
    setShowAvailableRookies(false)

    frontOfficeManager.playerPickRookie(hero)
    setDraftOutcomes(frontOfficeManager.getDraftOutcomes())
    setCurrDraftIndex(currDraftIndex + 1)
    doNextPick(currDraftIndex + 1)
  }

  const finishDraft = () => {
    frontOfficeManager.finishDraft()
    saveGuild(frontOfficeManager.getPlayer().serialize())
    saveLeague(frontOfficeManager.getSerializedNonPlayerTeams())
    saveFrontOffice(frontOfficeManager.serialize())
    setDraftOutcomes([])
    setCurrDraftIndex(0)
    setShowAvailableRookies(true)
    navigation.navigate('FrontOffice')
  }

  const renderRow = (hero: Hero, isPlayerPick: boolean) => {
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
        {isPlayerPick && (
          <View style={{ flex: 1.5 }}>
            <Button
              onPress={() => {
                doPlayerPick(hero)
              }}
              style={{ padding: 5, width: '80%' }}
              textStyle={{ fontSize: 10 }}
              text='Select'
            />
          </View>
        )}
      </View>
    )
  }

  const renderAvailableRookies = () => {
    const isPlayerPick = currDraftIndex === pickOrder.playerDraftPick - 1
    const draftClass = frontOfficeManager.getDraftClass()
    const sortedDraftClass = draftClass.sort(
      (a: Hero, b: Hero) => b.getOverall() - a.getOverall()
    )
    return (
      <View style={{ flexDirection: 'column', flex: 1 }}>
        {!isPlayerPick && (
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Button
              style={{ marginTop: 10, width: '90%' }}
              text='Start Draft'
              onPress={() => {
                startDraft()
              }}
            />
          </View>
        )}
        <View style={{ flexDirection: 'column', flex: 1, marginTop: 10 }}>
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
            {isPlayerPick && <Text style={{ flex: 1.5 }} />}
          </View>
          <ScrollView showsVerticalScrollIndicator>
            {sortedDraftClass.map((hero: Hero) => {
              return renderRow(hero, isPlayerPick)
            })}
          </ScrollView>
        </View>
      </View>
    )
  }

  const renderDraftBoard = () => {
    const draftOutcome = draftOutcomes[currDraftIndex]
    return (
      <View style={{ flexDirection: 'row', height: '100%', flex: 1 }}>
        <View
          style={{
            flex: 1.5,
            height: '100%',
            borderRightColor: 'black',
            borderRightWidth: 1,
            flexDirection: 'column',
            paddingLeft: 10,
            paddingTop: 10,
          }}
        >
          {pickOrder.draftOrder.map((teamId: string, index: number) => {
            const draftOutcome = draftOutcomes[index]
            const team = (seasonManager as SeasonManager).getTeam(
              teamId
            ) as Team
            return (
              <View
                key={`draft-${teamId}`}
                style={{
                  flexDirection: 'row',
                  marginBottom: 10,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 18, flex: 1 }}>
                  {index + 1}. {team.name}
                </Text>
                {draftOutcome && (
                  <View
                    style={{
                      marginRight: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 18, marginRight: 10 }}>
                      {draftOutcome.pickedHero.name}
                    </Text>
                    <Pressable
                      onPress={() => {
                        setHeroToDrilldown(draftOutcome.pickedHero)
                        setTeamColorToDrilldown(draftOutcome.team.color)
                      }}
                    >
                      <MaterialIcons name='info' size={18} />
                    </Pressable>
                  </View>
                )}
              </View>
            )
          })}
        </View>
        {draftOutcome ? (
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                fontSize: 18,
                marginBottom: 20,
                marginTop: 20,
              }}
            >
              With the {currDraftIndex + 1}
              {getSuffix(currDraftIndex + 1)} pick, {draftOutcome.team.name}{' '}
              select
            </Text>
            <HeroImage
              height={120}
              width={120}
              hero={draftOutcome.pickedHero}
              style={{
                width: 120,
                height: 120,
              }}
              teamColor={draftOutcome.team.color}
            />
            <Text style={{ fontSize: 20, marginTop: 10 }}>
              {draftOutcome.pickedHero.name}
            </Text>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <Button
                style={{ marginRight: 10 }}
                text='More info'
                onPress={() => {
                  setHeroToDrilldown(draftOutcome.pickedHero)
                  setTeamColorToDrilldown(draftOutcome.team.color)
                }}
              />
              <Button
                text='Next pick'
                onPress={() => {
                  doNextPick(currDraftIndex + 1)
                  setCurrDraftIndex(currDraftIndex + 1)
                }}
              />
            </View>
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                fontSize: 18,
                marginBottom: 20,
                marginTop: 20,
              }}
            >
              The draft is complete!
            </Text>
            <Button
              text='Continue'
              onPress={() => {
                finishDraft()
              }}
            />
          </View>
        )}
      </View>
    )
  }

  const isPlayerPick = pickOrder.playerDraftPick - 1 === currDraftIndex

  return (
    <Portal.Host>
      <HeroDrilldownModal
        isOpen={heroToDrilldown !== null}
        onClose={() => setHeroToDrilldown(null)}
        hero={heroToDrilldown}
        teamColor={teamColorToDrilldown}
      />
      <Navbar title={isPlayerPick ? 'Select a rookie to draft' : 'The Draft'} />
      <DraftOrderModal
        isOpen={showPickOrderModal}
        onClose={() => {}}
        onContinue={() => {
          setShowPickOrderModal(false)
        }}
        pickNumber={pickOrder.playerDraftPick}
      />
      {showAvailableRookies ? renderAvailableRookies() : renderDraftBoard()}
    </Portal.Host>
  )
}

const mapStateToProps = (state: any) => ({
  guild: state.guild,
  league: state.league,
  season: state.season,
  frontOffice: state.frontOffice,
})

export default connect(mapStateToProps, {
  ...guildActions,
  ...leagueActions,
  ...frontOfficeActions,
})(Draft)

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
