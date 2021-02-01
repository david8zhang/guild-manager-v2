import * as React from 'react'
import { Text, View } from 'react-native'
import { Button } from '../../../components'
import { StarterHero, HeroDrilldownModal } from '../../StarterHeroes/components'
import { Hero } from '../../../lib/model/Hero'
import { Team } from '../../../lib/model/Team'
import { Portal } from 'react-native-paper'
import { SubstitutionScreen } from './SubstitutionScreen'

interface Props {
  playerTeam: Team
  enemyTeam: Team
  onConfirm: Function
  onBack: Function
}

export const LineupConfirm: React.FC<Props> = ({
  playerTeam,
  onConfirm,
  enemyTeam,
  onBack,
}) => {
  const [heroToDrilldown, setHeroToDrilldown] = React.useState<any>(null)
  const [teamColorToDrilldown, setTeamColorToDrilldown] = React.useState('')
  const [playerHeroes, setPlayerHeroes] = React.useState<any[]>([])
  const [heroToSwap, setHeroToSwap] = React.useState<any>(null)

  React.useEffect(() => {
    const starterHeroes = playerTeam.getStarters()
    setPlayerHeroes(starterHeroes)
  }, [])

  const enemyHeroes = enemyTeam.roster.filter((h) =>
    enemyTeam.starterIds.includes(h.heroId)
  )

  if (heroToSwap) {
    return (
      <Portal.Host>
        <SubstitutionScreen
          heroToSwap={heroToSwap}
          onSwap={(replacementId: string) => {
            playerTeam.swapOutStarter(heroToSwap.heroId, replacementId)
            const starterHeroes = playerTeam.getStarters()
            setPlayerHeroes(starterHeroes)
            setHeroToSwap(null)
          }}
          onBack={() => {
            setHeroToSwap(null)
          }}
          playerTeam={playerTeam}
        />
      </Portal.Host>
    )
  }

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
          teamColor={teamColorToDrilldown}
        />
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {enemyHeroes.map((hero: Hero) => {
            return (
              <StarterHero
                teamColor={enemyTeam.color}
                hero={hero}
                key={`starter-${hero.heroId}`}
                name={hero.name}
                attack={hero.attack}
                defense={hero.defense}
                health={hero.health}
                speed={hero.speed}
                onShowDetails={() => {
                  setTeamColorToDrilldown(enemyTeam.color)
                  setHeroToDrilldown(hero)
                }}
                potential={hero.potential}
                button={<View />}
              />
            )
          })}
        </View>
        <Text style={{ marginBottom: 20, fontSize: 18, fontWeight: 'bold' }}>
          vs
        </Text>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {playerHeroes.map((hero: Hero) => {
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
                  setTeamColorToDrilldown(playerTeam.color)
                  setHeroToDrilldown(hero)
                }}
                potential={hero.potential}
                button={
                  <Button
                    style={{ width: '100%', padding: 5, marginTop: 10 }}
                    textStyle={{ color: 'black' }}
                    onPress={() => {
                      setHeroToSwap(hero)
                    }}
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
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            marginBottom: 10,
            flex: 0.5,
          }}
        >
          <Button
            style={{ width: 200, padding: 5, marginRight: 10 }}
            onPress={() => {
              onBack()
            }}
            text='Back'
          />
          <Button
            style={{ width: 200, padding: 5 }}
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
