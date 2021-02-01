import * as React from 'react'
import { Alert, Pressable, ScrollView, Text, View } from 'react-native'
import { Button } from '../../components'
import { FrontOfficeManager } from '../../lib/FrontOfficeManager'
import { Hero } from '../../lib/model/Hero'
import { Team } from '../../lib/model/Team'
import { HeroDrilldownModal, StarterHero } from '../StarterHeroes/components'
import { TradeAssetModal } from './TradeAssetModal'
import { FontAwesome } from '@expo/vector-icons'
import { connect } from 'react-redux'

import * as guildActions from '../../redux/guildWidget'
import * as frontOfficeActions from '../../redux/frontOfficeWidget'
import * as leagueActions from '../../redux/leagueWidget'
import { Portal } from 'react-native-paper'

interface Props {
  team: Team
  frontOfficeManager: FrontOfficeManager
  onBack: Function
  saveGuild?: Function
  saveFrontOffice?: Function
  saveLeague?: Function
}

const TradeOffer: React.FC<Props> = ({
  team,
  frontOfficeManager,
  onBack,
  saveGuild,
  saveFrontOffice,
  saveLeague,
}) => {
  const playerTeam = frontOfficeManager.getPlayer()
  const [playerAssets, setPlayerAssets] = React.useState<any[]>([])
  const [otherTeamAssets, setOtherTeamAssets] = React.useState<any[]>([])
  const [teamToPickAssetsFrom, setTeamToPickAssetsFrom] = React.useState<any>(
    null
  )
  const [heroToDrilldown, setHeroToDrilldown] = React.useState<any>(null)

  const saveAllStates = () => {
    const serializedPlayerTeam = frontOfficeManager.getPlayer().serialize()
    saveGuild!(serializedPlayerTeam)
    const frontOfficeObj = (frontOfficeManager as FrontOfficeManager).serialize()
    saveFrontOffice!(frontOfficeObj)

    const serializedLeagueObj = frontOfficeManager.getSerializedNonPlayerTeams()
    saveLeague!(serializedLeagueObj)
  }

  const renderTeamAssetList = (teamToRender: Team, assets: Hero[]) => {
    return (
      <View style={{ flex: 1, padding: 10 }}>
        <Portal>
          <HeroDrilldownModal
            hero={heroToDrilldown}
            isOpen={heroToDrilldown !== null}
            onClose={() => setHeroToDrilldown(null)}
            teamColor={teamToRender.color}
          />
        </Portal>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 20, flex: 1 }}>{teamToRender.name}</Text>
          <Button
            onPress={() => {
              setTeamToPickAssetsFrom(teamToRender)
            }}
            text='Add asset'
          />
        </View>
        <ScrollView contentContainerStyle={{ flexDirection: 'column' }}>
          {assets.map((h: Hero) => {
            return (
              <View
                key={h.heroId}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: 'white',
                  marginTop: 10,
                  marginBottom: 10,
                }}
              >
                <StarterHero
                  style={{ flex: 1 }}
                  innerStyle={{ width: 250 }}
                  teamColor={teamToRender.color}
                  hero={h}
                  key={`starter-${h.heroId}`}
                  name={h.name}
                  attack={h.attack}
                  defense={h.defense}
                  health={h.health}
                  speed={h.speed}
                  onShowDetails={() => {
                    setHeroToDrilldown(h)
                  }}
                  potential={h.potential}
                  button={<View />}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginRight: 10,
                  }}
                >
                  <Text style={{ fontSize: 20, marginRight: 5 }}>
                    {frontOfficeManager.getHeroTradeValue(h)}
                  </Text>
                  <FontAwesome name='star' size={20} />
                </View>

                <Pressable
                  style={{
                    padding: 5,
                    position: 'absolute',
                    right: 0,
                    top: 0,
                  }}
                  onPress={() => {
                    if (teamToRender.teamId === team.teamId) {
                      const newAssets = otherTeamAssets.filter(
                        (oh: Hero) => oh.heroId !== h.heroId
                      )
                      setOtherTeamAssets(newAssets)
                    } else {
                      const newAssets = playerAssets.filter(
                        (ph: Hero) => ph.heroId !== h.heroId
                      )
                      setPlayerAssets(newAssets)
                    }
                  }}
                >
                  <FontAwesome name='times' size={25} color='red' />
                </Pressable>
              </View>
            )
          })}
        </ScrollView>
      </View>
    )
  }

  const salaryAfterTrade = frontOfficeManager.getSalaryAfterTrade(
    playerAssets,
    otherTeamAssets
  )

  return (
    <View style={{ flexDirection: 'column', height: '80%' }}>
      <TradeAssetModal
        currAssets={
          teamToPickAssetsFrom && teamToPickAssetsFrom.teamId === team.teamId
            ? otherTeamAssets
            : playerAssets
        }
        addAssets={(assets: Hero[]) => {
          if (teamToPickAssetsFrom.teamId === team.teamId) {
            setOtherTeamAssets(assets)
          } else {
            setPlayerAssets(assets)
          }
        }}
        isOpen={teamToPickAssetsFrom !== null}
        onClose={() => {
          setTeamToPickAssetsFrom(null)
        }}
        team={teamToPickAssetsFrom}
      />
      <View style={{ flexDirection: 'row', flex: 1 }}>
        {renderTeamAssetList(playerTeam, playerAssets)}
        {renderTeamAssetList(team, otherTeamAssets)}
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ flex: 1, fontSize: 20, marginLeft: 10 }}>
          Salary After Trade:{' '}
          <Text
            style={{
              color:
                salaryAfterTrade > FrontOfficeManager.MAX_SALARY_CAP
                  ? 'red'
                  : 'green',
            }}
          >
            {salaryAfterTrade}G
          </Text>
        </Text>
        <Button
          style={{ marginTop: 10, width: 150 }}
          onPress={() => {
            if (
              frontOfficeManager.proposeTrade(
                playerAssets,
                otherTeamAssets,
                team
              ) &&
              salaryAfterTrade <= FrontOfficeManager.MAX_SALARY_CAP
            ) {
              Alert.alert('Trade successful!', '', [
                {
                  text: 'Ok',
                  onPress: () => {
                    frontOfficeManager.executeTrade(
                      playerAssets,
                      otherTeamAssets,
                      team
                    )
                    saveAllStates()
                    onBack()
                  },
                },
              ])
            } else {
              let reason =
                'You need to provide more value to make this trade work'
              if (salaryAfterTrade > FrontOfficeManager.MAX_SALARY_CAP) {
                reason = "You don't have enough salary cap space for this trade"
              }
              Alert.alert('Trade denied!', reason)
            }
          }}
          text='Propose Trade'
        />
      </View>
    </View>
  )
}

export default connect(null, {
  ...guildActions,
  ...frontOfficeActions,
  ...leagueActions,
})(TradeOffer)
