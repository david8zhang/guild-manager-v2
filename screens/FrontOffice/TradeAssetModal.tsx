import * as React from 'react'
import { Animated, Dimensions, Pressable, Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Button, CustomModal } from '../../components'
import { Hero } from '../../lib/model/Hero'
import { Team } from '../../lib/model/Team'
import { StarterHero } from '../StarterHeroes/components'
import { FontAwesome } from '@expo/vector-icons'

interface Props {
  isOpen: boolean
  onClose: Function
  addAssets: Function
  currAssets: Hero[]
  team: Team
}

export const TradeAssetModal: React.FC<Props> = ({
  isOpen,
  onClose,
  team,
  addAssets,
  currAssets,
}) => {
  const [addedAssets, setAddedAssets] = React.useState<string[]>([])
  React.useEffect(() => {
    setAddedAssets(currAssets.map((h: Hero) => h.heroId))
  }, [currAssets])

  if (!team) {
    return <View />
  }
  const starters = team.getStarters()
  const reserves = team.getReserves()
  const roster = [...starters, ...reserves]
  return (
    <CustomModal
      customWidth={400}
      customHeight={320}
      isOpen={isOpen}
      onClose={() => {
        onClose()
      }}
    >
      <View style={{ flexDirection: 'column' }}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 20,
            marginBottom: 15,
            marginTop: -10,
          }}
        >
          Add asset
        </Text>
        <ScrollView style={{ height: 200 }}>
          {roster.map((h: Hero) => {
            const isAdded = addedAssets.includes(h.heroId)
            return (
              <View
                key={h.heroId}
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <StarterHero
                  style={{ flex: 1 }}
                  innerStyle={{ width: 240 }}
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
                {isAdded ? (
                  <Pressable
                    onPress={() => {
                      const newAddedAssets = addedAssets.filter(
                        (id: string) => id !== h.heroId
                      )
                      setAddedAssets(newAddedAssets)
                    }}
                  >
                    <FontAwesome name='trash-o' size={25} />
                  </Pressable>
                ) : (
                  <Button
                    text='Add'
                    onPress={() => {
                      const newAddedAssets: any[] = addedAssets.concat(h.heroId)
                      setAddedAssets(newAddedAssets)
                    }}
                  />
                )}
              </View>
            )
          })}
        </ScrollView>
        <Button
          style={{ alignSelf: 'center' }}
          onPress={() => {
            const heroes: any[] = []
            roster.forEach((h: Hero) => {
              if (addedAssets.includes(h.heroId)) {
                heroes.push(h)
              }
            })
            onClose()
            addAssets(heroes)
          }}
          text='Add assets'
        />
      </View>
    </CustomModal>
  )
}
