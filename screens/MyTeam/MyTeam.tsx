import * as React from 'react'
import { Text, View } from 'react-native'
import { Button, Navbar } from '../../components'

// Game state
import { Team } from '../../lib/model/Team'
import { SeasonManager } from '../../lib/SeasonManager'
import { Hero } from '../../lib/model/Hero'

// Redux
import * as seasonActions from '../../redux/seasonWidget'
import * as guildActions from '../../redux/guildWidget'
import { connect } from 'react-redux'
import { HeroDrilldownModal, StarterHero } from '../StarterHeroes/components'
import { Portal } from 'react-native-paper'
import { SubstitutionScreen } from '../Season/Match/SubstitutionScreen'

interface Props {
  savedPlayerGuild: any
  saveSeason: Function
  saveGuild: Function
  savedSeason: any
  navigation: any
}

const MyTeam: React.FC<Props> = ({
  navigation,
  savedPlayerGuild,
  savedSeason,
  saveSeason,
  saveGuild,
}) => {
  const [team, setTeam] = React.useState<any>(null)
  const [starters, setStarters] = React.useState([])
  const [heroToDrilldown, setHeroToDrilldown] = React.useState<Hero | null>(
    null
  )
  const [seasonManager, setSeasonManager] = React.useState<any>(null)
  const [heroToSwap, setHeroToSwap] = React.useState<Hero | null>(null)

  React.useEffect(() => {
    let team: any
    if (!savedSeason) {
      team = Team.deserializeObj(savedPlayerGuild)
    } else {
      const seasonManager: SeasonManager = new SeasonManager(savedPlayerGuild)
      seasonManager.deserialize(savedSeason)
      team = seasonManager.getPlayer()
      if (seasonManager) {
        setSeasonManager(seasonManager)
      }
    }
    setTeam(team)
    setStarters(team.getStarters())
  }, [])

  const saveAdjustment = () => {
    if (seasonManager) {
      ;(seasonManager as SeasonManager).setPlayerTeam(team)
      saveSeason((seasonManager as SeasonManager).serialize())
    } else {
      saveGuild((team as Team).serialize())
    }
  }

  if (!team) {
    return <View />
  }

  if (heroToSwap) {
    return (
      <Portal.Host>
        <SubstitutionScreen
          heroToSwap={heroToSwap}
          onSwap={(replacementId: string) => {
            team.swapOutStarter(heroToSwap.heroId, replacementId)
            const starterHeroes = team.getStarters()
            setStarters(starterHeroes)
            setHeroToSwap(null)
            saveAdjustment()
          }}
          onBack={() => {
            setHeroToSwap(null)
          }}
          playerTeam={team}
        />
      </Portal.Host>
    )
  }

  return (
    <Portal.Host>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <Navbar title='My Team' navigation={navigation} />
        {heroToDrilldown && (
          <HeroDrilldownModal
            isOpen={heroToDrilldown !== null}
            onClose={() => setHeroToDrilldown(null)}
            hero={heroToDrilldown}
            teamColor={team.color}
          />
        )}

        <View
          style={{
            paddingTop: 15,
            paddingBottom: 15,
            flexDirection: 'column',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flexDirection: 'column', flex: 1, paddingLeft: 30 }}>
              <Text style={{ fontSize: 25 }}>Starting Lineup</Text>
            </View>
            <View style={{ paddingRight: 30 }}>
              <Button
                text='View Detailed Roster'
                onPress={() => {}}
                style={{ width: 200, padding: 10 }}
                textStyle={{ fontSize: 11 }}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 30,
            }}
          >
            {starters.map((hero: Hero) => {
              return (
                <StarterHero
                  teamColor={team.color}
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
        </View>
      </View>
    </Portal.Host>
  )
}

export const mapStateToProps = (state: any) => ({
  savedSeason: state.season,
  savedPlayerGuild: state.guild,
})

export default connect(mapStateToProps, { ...seasonActions, ...guildActions })(
  MyTeam
)