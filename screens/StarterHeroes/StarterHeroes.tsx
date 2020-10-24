import * as React from 'react'
import { connect } from 'react-redux'
import { Pressable, Text, View } from 'react-native'
import { RandomHeroGenerator } from '../../lib/randomHeroGenerator'
import * as guildActions from '../../redux/guildWidget'
import { HeroDrilldownModal, StarterHero } from './components'
import { FontAwesome } from '@expo/vector-icons'

interface Props {
  guild: any
  addStarterHeroes: Function
}

const StarterHeroes: React.FC<Props> = ({ guild, addStarterHeroes }) => {
  const [starterHeroes, setStarterHeroes] = React.useState([])
  React.useEffect(() => {
    const heroes: any = RandomHeroGenerator.generateStarterHeroes(5)
    setStarterHeroes(heroes)
  }, [])

  const [heroToDrilldown, setHeroToDrilldown] = React.useState<any>(null)
  const [pickedHeroes, setPickedHeroes] = React.useState<string[]>([])

  return (
    <View style={{ padding: 15 }}>
      <HeroDrilldownModal
        isOpen={heroToDrilldown !== null}
        onClose={() => setHeroToDrilldown(null)}
        hero={heroToDrilldown}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flexDirection: 'column', flex: 1 }}>
          <Text style={{ fontSize: 24, textAlign: 'center' }}>
            Pick 3 starter heroes!
          </Text>
          <Text style={{ fontSize: 12, textAlign: 'center', marginBottom: 5 }}>
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
          >
            <FontAwesome name='chevron-right' size={20} />
            <Text style={{ fontSize: 10, textAlign: 'center' }}>Continue</Text>
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
        {starterHeroes.map((h: any) => (
          <StarterHero
            {...h}
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
  )
}

const mapStateToProps = (state: any) => ({
  guild: state.guild,
})

export default connect(mapStateToProps, { ...guildActions })(StarterHeroes)
