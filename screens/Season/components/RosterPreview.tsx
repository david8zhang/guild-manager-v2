import * as React from 'react'
import { FontAwesome } from '@expo/vector-icons'
import { BackHandler, Pressable, Text, View } from 'react-native'
import { Hero } from '../../../lib/model/Hero'
import { Team } from '../../../lib/model/Team'
import { HeroDrilldownModal, StarterHero } from '../../StarterHeroes/components'
import { Portal } from 'react-native-paper'

interface Props {
  team: Team
  onBack: Function
}

export const RosterPreview: React.FC<Props> = ({ team, onBack }) => {
  const [heroToDrilldown, setHeroToDrilldown] = React.useState<any>(null)
  const heroes = team.getStarters()

  return (
    <Portal.Host>
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <HeroDrilldownModal
          isOpen={heroToDrilldown !== null}
          onClose={() => setHeroToDrilldown(null)}
          hero={heroToDrilldown}
          teamColor={team.color}
        />
        <View style={{ flexDirection: 'row', marginTop: 20, marginBottom: 20 }}>
          <Pressable
            style={{ paddingLeft: 20, paddingRight: 10 }}
            onPress={() => {
              onBack()
            }}
          >
            <FontAwesome name='chevron-left' size={20} />
          </Pressable>
          <Text
            style={{
              fontSize: 20,
              textAlign: 'center',
              marginBottom: 10,
              marginRight: 50,
              flex: 1,
            }}
          >
            {team.name}
          </Text>
        </View>

        <View style={{ flexDirection: 'row' }}>
          {heroes.map((h: Hero) => {
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
    </Portal.Host>
  )
}
