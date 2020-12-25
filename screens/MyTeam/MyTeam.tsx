import * as React from 'react'
import { Text, View } from 'react-native'
import { Button, Navbar } from '../../components'

// Game state
import { Team } from '../../lib/model/Team'
import { Hero } from '../../lib/model/Hero'

// Redux
import * as seasonActions from '../../redux/seasonWidget'
import * as guildActions from '../../redux/guildWidget'
import { connect } from 'react-redux'
import { HeroDrilldownModal, StarterHero } from '../StarterHeroes/components'
import { Portal } from 'react-native-paper'
import { SubstitutionScreen } from '../Season/Match/SubstitutionScreen'
import { DetailedRoster } from './DetailedRoster'

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
  saveGuild,
}) => {
  const [team, setTeam] = React.useState<any>(null)
  const [starters, setStarters] = React.useState([])
  const [heroToDrilldown, setHeroToDrilldown] = React.useState<Hero | null>(
    null
  )
  const [heroToSwap, setHeroToSwap] = React.useState<Hero | null>(null)
  const [showDetailedRoster, setShowDetailedRoster] = React.useState(false)

  React.useEffect(() => {
    const team: any = Team.deserializeObj(savedPlayerGuild)
    setTeam(team)
    setStarters(team.getStarters())
  }, [])

  const saveAdjustment = () => {
    saveGuild((team as Team).serialize())
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

  const renderRoster = () => {
    const allHeroes = starters.concat(team.getReserves())
    if (showDetailedRoster) {
      return (
        <DetailedRoster
          heroes={allHeroes}
          onBack={() => setShowDetailedRoster(false)}
        />
      )
    }
    return (
      <View
        style={{
          paddingTop: 15,
          paddingBottom: 15,
          flexDirection: 'column',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
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
            flexDirection: 'row',
            alignItems: 'center',
            padding: 15,
          }}
        >
          <View style={{ flexDirection: 'column', flex: 1 }}>
            <Text style={{ fontSize: 22 }}>
              {showDetailedRoster ? 'Detailed Roster' : 'Starting Lineup'}
            </Text>
          </View>
          <View>
            <Button
              text={
                showDetailedRoster ? 'View Starters' : 'View Detailed Roster'
              }
              onPress={() => {
                setShowDetailedRoster(!showDetailedRoster)
              }}
              style={{ width: 200, padding: 10 }}
              textStyle={{ fontSize: 11 }}
            />
          </View>
        </View>
        {renderRoster()}
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
