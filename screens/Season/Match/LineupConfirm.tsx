import * as React from 'react'
import { View } from 'react-native'
import { Button } from '../../../components'
import { StarterHero, HeroDrilldownModal } from '../../StarterHeroes/components'
import { Hero } from '../../../lib/model/Hero'
import { Team } from '../../../lib/model/Team'
import { Portal } from 'react-native-paper'

interface Props {
  playerTeam: Team
  onConfirm: Function
}

export const LineupConfirm: React.FC<Props> = ({ playerTeam, onConfirm }) => {
  const [heroToDrilldown, setHeroToDrilldown] = React.useState<any>(null)

  const { starterIds, roster } = playerTeam
  const starterHeroes = roster.filter((h) => starterIds.includes(h.heroId))

  return (
    <Portal.Host>
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        <HeroDrilldownModal
          isOpen={heroToDrilldown !== null}
          onClose={() => setHeroToDrilldown(null)}
          hero={heroToDrilldown}
        />
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {starterHeroes.map((hero: Hero) => {
            return (
              <StarterHero
                teamColor={playerTeam.color}
                hero={hero}
                key={`starter-${hero.heroId}`}
                name={hero.name}
                attack={hero.attack}
                defense={hero.defense}
                health={hero.health}
                speed={hero.speed}
                onShowDetails={() => {
                  setHeroToDrilldown(hero)
                }}
                potential={hero.potential}
                button={
                  <Button
                    style={{ width: '100%', padding: 5, marginTop: 10 }}
                    textStyle={{ color: 'black' }}
                    onPress={() => {}}
                    text='Switch'
                  />
                }
              />
            )
          })}
        </View>
        <View
          style={{
            width: '100%',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            marginBottom: 10,
          }}
        >
          <Button
            style={{ width: 200 }}
            onPress={() => {
              onConfirm()
            }}
            text='Start Game'
          />
        </View>
      </View>
    </Portal.Host>
  )
}
