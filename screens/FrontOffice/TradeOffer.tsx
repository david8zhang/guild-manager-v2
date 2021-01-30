import * as React from 'react'
import { Animated, ScrollView, Text, View } from 'react-native'
import { Button } from '../../components'
import { FrontOfficeManager } from '../../lib/FrontOfficeManager'
import { Hero } from '../../lib/model/Hero'
import { Team } from '../../lib/model/Team'
import { StarterHero } from '../StarterHeroes/components'
import { TradeAssetModal } from './TradeAssetModal'

interface Props {
  team: Team
  frontOfficeManager: FrontOfficeManager
}

export const TradeOffer: React.FC<Props> = ({ team, frontOfficeManager }) => {
  const playerTeam = frontOfficeManager.getPlayer()
  const [playerAssets, setPlayerAssets] = React.useState([])
  const [otherTeamAssets, setOtherTeamAssets] = React.useState([])
  const [teamToPickAssetsFrom, setTeamToPickAssetsFrom] = React.useState<any>(
    null
  )

  const renderTeamAssetList = (
    team: Team,
    assets: Hero[],
    menuSide: string
  ) => {
    return (
      <View style={{ flex: 1, padding: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 20, flex: 1 }}>{team.name}</Text>
          <Button
            onPress={() => {
              setTeamToPickAssetsFrom(team)
            }}
            text='Add asset'
          />
        </View>
        <ScrollView contentContainerStyle={{ flexDirection: 'column' }}>
          {assets.map((h: Hero) => {
            return (
              <StarterHero
                teamColor={team.color}
                hero={h}
                key={`starter-${h.heroId}`}
                name={h.name}
                attack={h.attack}
                defense={h.defense}
                health={h.health}
                speed={h.speed}
                onShowDetails={() => {}}
                potential={h.potential}
                button={<View />}
              />
            )
          })}
        </ScrollView>
      </View>
    )
  }

  return (
    <View style={{ flexDirection: 'column', height: '80%' }}>
      <TradeAssetModal
        addAssets={() => {}}
        isOpen={teamToPickAssetsFrom !== null}
        onClose={() => {
          setTeamToPickAssetsFrom(null)
        }}
        team={teamToPickAssetsFrom}
      />
      <View style={{ flexDirection: 'row', flex: 1 }}>
        {renderTeamAssetList(playerTeam, playerAssets, 'left')}
        {renderTeamAssetList(team, otherTeamAssets, 'right')}
      </View>
      <Button
        style={{ alignSelf: 'center', marginTop: 10, width: 150 }}
        onPress={() => {}}
        text='Propose Trade'
      />
    </View>
  )
}
