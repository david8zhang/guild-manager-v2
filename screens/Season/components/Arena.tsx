import * as React from 'react'
import { Dimensions, Text, View } from 'react-native'
import { HeroInMatch } from '../../../lib/model/HeroInMatch'

interface Props {
  map: {
    [key: string]: HeroInMatch
  }
  rows: number
  cols: number
}

export const Arena: React.FC<Props> = ({ map, rows, cols }) => {
  const totalNumCells = rows * cols

  const renderGrid = () => {
    const grid = []
    for (let i = 0; i < totalNumCells; i++) {
      const coordinates = `${Math.floor(i / cols)},${i % cols}`
      const hero: HeroInMatch = map[coordinates]
      grid.push(
        <View
          key={`hero-${coordinates}`}
          style={{
            width: `${100 / cols}%`,
            borderColor: 'gray',
            borderLeftWidth: 1,
            borderBottomWidth: 1,
            height: 60,
            backgroundColor: 'white',
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
        </View>
      )
    }
    return grid
  }

  return (
    <View
      style={{
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
