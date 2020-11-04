import * as React from 'react'
import { Pressable, Text, View } from 'react-native'
import { MatchManager } from '../../../lib/MatchManager'
import { HeroInMatch } from '../../../lib/model/HeroInMatch'

interface Props {
  matchManager: MatchManager
}

export const Arena: React.FC<Props> = ({ matchManager }) => {
  const { map, rows, cols } = matchManager?.getArena()
  const highlightedSquares = matchManager.getHighlightedSquares()

  const totalNumCells = rows * cols
  const [selectedHeroId, setSelectedHeroId] = React.useState<string>('')

  const onSelectHero = (hero: HeroInMatch, coordinates: string) => {
    matchManager.resetHighlightedSquares()
    if (hero) {
      setSelectedHeroId(hero.getHeroRef().heroId)
    }
    const [row, col] = coordinates.split(',')
    matchManager.highlightMoveableSquares(parseInt(row), parseInt(col))
  }

  const getSquareColor = (coordinates: string) => {
    const hero: HeroInMatch = map[coordinates]
    const isSelected = hero && selectedHeroId === hero.getHeroRef().heroId
    const isHighlighted = highlightedSquares[coordinates]
    const heroAtPosition = map[coordinates]
    if (isSelected) {
      return '#ffe599'
    }
    if (heroAtPosition) {
      return 'white'
    }
    if (isHighlighted) {
      return 'blue'
    }
    return 'white'
  }

  const renderGrid = () => {
    const grid = []
    for (let i = 0; i < totalNumCells; i++) {
      const coordinates = `${Math.floor(i / cols)},${i % cols}`
      const hero: HeroInMatch = map[coordinates]
      grid.push(
        <Pressable
          key={`hero-${coordinates}`}
          onPress={() => {
            onSelectHero(hero, coordinates)
          }}
          style={{
            width: `${100 / cols}%`,
            borderColor: 'gray',
            borderLeftWidth: 1,
            borderBottomWidth: 1,
            height: 50,
            backgroundColor: getSquareColor(coordinates),
            alignItems: 'center',
            justifyContent: 'center',
            padding: 5,
          }}
        >
          {hero ? (
            <Text style={{ fontSize: 11 }}>{hero.getHeroRef().name}</Text>
          ) : (
            <Text></Text>
          )}
        </Pressable>
      )
    }
    return grid
  }

  return (
    <View
      style={{
        marginLeft: 15,
        marginRight: 15,
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderColor: 'gray',
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: '#ddd',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {renderGrid()}
    </View>
  )
}
