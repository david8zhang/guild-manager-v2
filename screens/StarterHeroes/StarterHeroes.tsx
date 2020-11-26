import * as React from 'react'
import { connect } from 'react-redux'
import { Pressable, Text, View } from 'react-native'
import { RandomHeroGenerator } from '../../lib/RandomHeroGenerator'
import * as guildActions from '../../redux/guildWidget'
import { FontAwesome } from '@expo/vector-icons'
import { HeroDrilldownModal, StarterHero } from './components'
import { Portal } from 'react-native-paper'

interface Props {
  navigation: any
  guild: any
  addStarterHeroes: Function
  addReserveHeroes: Function
}

const StarterHeroes: React.FC<Props> = ({
  navigation,
  guild,
  addStarterHeroes,
  addReserveHeroes,
}) => {
  const [isAddingReserves, setIsAddingReserves] = React.useState(false)
  const [starterHeroes, setStarterHeroes] = React.useState([])
  const [reserveHeroes, setReserveHeroes] = React.useState([])
  React.useEffect(() => {
    // Generate 3 attackers, 2 supports for starters and reserves
    const starters: any = RandomHeroGenerator.generateStarterHeroes(5)
    const reserves: any = RandomHeroGenerator.generateReserveHeroes(5)
    setStarterHeroes(starters)
    setReserveHeroes(reserves)
  }, [])

  const [heroToDrilldown, setHeroToDrilldown] = React.useState<any>(null)
  const [pickedHeroes, setPickedHeroes] = React.useState<string[]>([])

  const onContinue = () => {
    if (isAddingReserves) {
      const pickedReserves: any[] = []
      reserveHeroes.forEach((h: any) => {
        if (pickedHeroes.includes(h.heroId)) {
          pickedReserves.push(h)
        }
      })
      addReserveHeroes(reserveHeroes)
      setPickedHeroes([])
      navigation.navigate('Home')
    } else {
      const pickedStarters: any[] = []
      starterHeroes.forEach((h: any) => {
        if (pickedHeroes.includes(h.heroId)) {
          pickedStarters.push(h)
        }
      })
      addStarterHeroes(pickedStarters)
      setPickedHeroes([])
      setIsAddingReserves(true)
    }
  }

  const heroesToRender = isAddingReserves ? reserveHeroes : starterHeroes

  return (
    <Portal.Host>
      <View style={{ padding: 15 }}>
        <HeroDrilldownModal
          isOpen={heroToDrilldown !== null}
          onClose={() => setHeroToDrilldown(null)}
          hero={heroToDrilldown}
          teamColor={guild.teamColor}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flexDirection: 'column', flex: 1 }}>
            <Text style={{ fontSize: 24, textAlign: 'center' }}>
              Pick 3 {isAddingReserves ? 'reserve' : 'starter'} heroes!
            </Text>
            <Text
              style={{ fontSize: 12, textAlign: 'center', marginBottom: 5 }}
            >
              Tap 'More Info' on each hero to see more information
            </Text>
          </View>
          {pickedHeroes.length === 3 && (
            <Pressable
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                alignItems: 'center',
              }}
              onPress={() => {
                onContinue()
              }}
            >
              <FontAwesome name='chevron-right' size={20} />
              <Text style={{ fontSize: 10, textAlign: 'center' }}>
                Continue
              </Text>
            </Pressable>
          )}
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {heroesToRender.map((h: any) => (
            <StarterHero
              {...h}
              teamColor={guild.teamColor}
              hero={h}
              key={h.heroId}
              isPicked={pickedHeroes.includes(h.heroId)}
              onPick={() => {
                if (pickedHeroes.includes(h.heroId)) {
                  const newPickedHeroes = pickedHeroes.filter(
                    (heroId: string) => heroId !== h.heroId
                  )
                  setPickedHeroes(newPickedHeroes)
                } else {
                  if (pickedHeroes.length < 3) {
                    setPickedHeroes(pickedHeroes.concat(h.heroId))
                  }
                }
              }}
              onShowDetails={() => {
                setHeroToDrilldown(h)
              }}
            />
          ))}
        </View>
      </View>
    </Portal.Host>
  )
}

const mapStateToProps = (state: any) => ({
  guild: state.guild,
})

export default connect(mapStateToProps, { ...guildActions })(StarterHeroes)
