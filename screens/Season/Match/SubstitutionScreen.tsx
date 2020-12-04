import * as React from 'react'
import { View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Portal } from 'react-native-paper'
import { Button } from '../../../components'
import { TextLink } from '../../../components/TextLink'
import { Hero } from '../../../lib/model/Hero'
import { Team } from '../../../lib/model/Team'
import { HeroDrilldownModal, StarterHero } from '../../StarterHeroes/components'

interface Props {
  heroToSwap: Hero
  onSwap: Function
  playerTeam: Team
  onBack: Function
}

export const SubstitutionScreen: React.FC<Props> = ({
  heroToSwap,
  onSwap,
  onBack,
  playerTeam,
}) => {
  const [heroToDrilldown, setHeroToDrilldown] = React.useState<any>(null)
  const reserveHeroes: Hero[] = playerTeam.getReserves()
  return (
    <View style={{ width: '100%', flexDirection: 'column' }}>
      <Portal>
        {heroToDrilldown && (
          <HeroDrilldownModal
            isOpen={heroToDrilldown !== null}
            onClose={() => setHeroToDrilldown(null)}
            hero={heroToDrilldown}
            teamColor={playerTeam.color}
          />
        )}
      </Portal>
      <TextLink
        onPress={() => {
          onBack()
        }}
        text='Back'
      />
      <View
        style={{
          paddingBottom: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <StarterHero
          hero={heroToSwap}
          {...heroToSwap}
          onShowDetails={() => {}}
          teamColor={playerTeam.color}
          button={<View />}
        />
      </View>
      <ScrollView horizontal contentContainerStyle={{ padding: 10 }}>
        {reserveHeroes.map((hero: Hero) => {
          return (
            <StarterHero
              key={hero.heroId}
              style={{ width: 220 }}
              hero={hero}
              {...hero}
              onShowDetails={() => {
                setHeroToDrilldown(hero)
              }}
              teamColor={playerTeam.color}
              button={
                <Button
                  text='Swap'
                  style={{ width: '100%' }}
                  onPress={() => {
                    onSwap(hero.heroId)
                  }}
                />
              }
            />
          )
        })}
      </ScrollView>
    </View>
  )
}
