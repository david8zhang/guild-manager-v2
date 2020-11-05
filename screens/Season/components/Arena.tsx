import * as React from 'react'
import { Dimensions, Pressable, Text, View } from 'react-native'
import { Portal } from 'react-native-paper'
import { Button, CustomModal } from '../../../components'
import { MatchManager } from '../../../lib/MatchManager'
import { HeroInMatch } from '../../../lib/model/HeroInMatch'
import { OverlayMenu } from './OverlayMenu'

interface Props {
  matchManager: MatchManager
}

export const Arena: React.FC<Props> = ({ matchManager }) => {
  const refs: any = []
  const { map, rows, cols } = matchManager?.getArena()
  const highlightedSquares = matchManager.getHighlightedSquares()
  const [menuToShowCoords, setMenuToShowCoords] = React.useState<any>(null)

  const totalNumCells = rows * cols
  const [
    selectedHeroAndCoordinates,
    setSelectedHeroAndCoordinates,
  ] = React.useState<any>(null)

  const onSquarePress = (hero: any, coordinates: string) => {
    if (hero) {
      onSelectHero(hero, coordinates)
    } else {
      if (selectedHeroAndCoordinates && highlightedSquares[coordinates]) {
        const {
          selectedHeroId,
          selectedHeroCoordinates,
        } = selectedHeroAndCoordinates
        const [startRow, startCol] = selectedHeroCoordinates.split(',')
        const [targetRow, targetCol] = coordinates.split(',')
        matchManager.resetHighlightedSquares()
        matchManager.moveHero({
          start: {
            row: parseInt(startRow, 10),
            col: parseInt(startCol, 10),
          },
          target: {
            row: parseInt(targetRow, 10),
            col: parseInt(targetCol, 10),
          },
        })
        setMenuToShowCoords({
          row: targetRow,
          col: targetCol,
        })
      }
    }
  }

  const onSelectHero = (hero: HeroInMatch, coordinates: string) => {
    matchManager.resetHighlightedSquares()
    if (hero) {
      setSelectedHeroAndCoordinates({
        selectedHeroId: hero.getHeroRef().heroId,
        selectedHeroCoordinates: coordinates,
      })
    }
    const [row, col] = coordinates.split(',')
    matchManager.highlightMoveableSquares(parseInt(row), parseInt(col))
  }

  const getSquareColor = (coordinates: string) => {
    const selectedHeroId = selectedHeroAndCoordinates
      ? selectedHeroAndCoordinates.selectedHeroId
      : ''
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
            onSquarePress(hero, coordinates)
          }}
          style={{
            overflow: 'visible',
            width: `${100 / cols}%`,
            borderColor: 'gray',
            borderLeftWidth: 1,
            borderBottomWidth: 1,
            height: 50,
            backgroundColor: getSquareColor(coordinates),
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 1,
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
  const row = 7
  const col = 5
  return (
    <View style={{ width: '100%' }}>
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
        {menuToShowCoords && (
          <OverlayMenu
            rows={rows}
            cols={cols}
            menuToShowCoords={menuToShowCoords}
            onAttack={() => {
              setMenuToShowCoords(null)
            }}
            onCancel={() => {
              setMenuToShowCoords(null)
            }}
            onWait={() => {
              setMenuToShowCoords(null)
            }}
          />
        )}
      </View>
    </View>
  )
}
