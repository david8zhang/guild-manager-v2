import * as React from 'react'
import { Pressable, Text, View } from 'react-native'
import { Button } from '../../components'
import { Hero } from '../../lib/model/Hero'
import { Team } from '../../lib/model/Team'
import { HeroDrilldownModal, StarterHero } from '../StarterHeroes/components'
import { FontAwesome } from '@expo/vector-icons'
import { Portal } from 'react-native-paper'
import { TradeOffer } from './TradeOffer'
import { FrontOfficeManager } from '../../lib/FrontOfficeManager'

interface Props {
  team: Team
  onBack: Function
  frontOfficeManager: FrontOfficeManager
}

export const TeamRosterDrilldown: React.FC<Props> = ({
  team,
  onBack,
  frontOfficeManager,
}) => {
  const [heroToDrilldown, setHeroToDrilldown] = React.useState<any>(null)
  const [showTradeOffer, setShowTradeOffer] = React.useState(false)
  const starters = team.getStarters()

  if (showTradeOffer) {
    return <TradeOffer team={team} frontOfficeManager={frontOfficeManager} />
  }

  return (
    <View
      style={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Portal>
        <HeroDrilldownModal
          isOpen={heroToDrilldown !== null}
          onClose={() => setHeroToDrilldown(null)}
          hero={heroToDrilldown}
          teamColor={team.color}
        />
      </Portal>
      <View
        style={{
          flexDirection: 'row',
          marginLeft: 30,
          marginRight: 30,
          marginTop: 20,
          alignItems: 'center',
          marginBottom: 10,
        }}
      >
        <Pressable
          onPress={() => {
            onBack()
          }}
          style={{ marginRight: 10 }}
        >
          <FontAwesome name='chevron-left' size={20} />
        </Pressable>
        <Text
          style={{
            textAlign: 'left',
            fontSize: 20,
            flex: 1,
          }}
        >
          {team.name}
        </Text>
        <Button
          text='Trade'
          onPress={() => {
            setShowTradeOffer(true)
          }}
        />
      </View>
      <View style={{ flexDirection: 'row' }}>
        {starters.map((h: Hero) => {
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
              onShowDetails={() => {
                setHeroToDrilldown(h)
              }}
              potential={h.potential}
              button={<View />}
            />
          )
        })}
      </View>
    </View>
  )
}
