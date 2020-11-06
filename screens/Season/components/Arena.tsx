import * as React from 'react'
import { Pressable, Text, View } from 'react-native'
import { MatchManager } from '../../../lib/MatchManager'
import { HeroInMatch } from '../../../lib/model/HeroInMatch'
import { OverlayMenu } from './OverlayMenu'

interface Props {
  matchManager: MatchManager
}

export const Arena: React.FC<Props> = ({ matchManager }) => {
  const { map, rows, cols } = matchManager?.getArena()
  const highlightedSquares = matchManager.getHighlightedSquares()
  const [menuToShowCoords, setMenuToShowCoords] = React.useState<any>(null)
  const [movedHeroes, setMovedHeroes] = React.useState<string[]>([])

  const totalNumCells = rows * cols
  const [
    selectedHeroAndCoordinates,
    setSelectedHeroAndCoordinates,
  ] = React.useState<any>(null)

  const doEnemyTurn = () => {
    setTimeout(() => {
      matchManager.moveEnemyHeroes()
      setMovedHeroes([])
    }, 1000)
  }

  const moveHero = (selectedHeroCoordinates: string, coordinates: string) => {
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
  }

  const showHeroActionMenu = (coordinates: string): void => {
    const [targetRow, targetCol] = coordinates.split(',')
    setMenuToShowCoords({
      row: targetRow,
      col: targetCol,
    })
  }

  const isHeroInPlayerTeam = (heroId: string) => {
    const playerHeroIds = matchManager
      .getPlayerHeroesInMatch()
      .map((hero: HeroInMatch) => hero.getHeroRef().heroId)
    return playerHeroIds.includes(heroId)
  }

  const canMoveHero = (coordinates: string): boolean => {
    return (
      selectedHeroAndCoordinates &&
      highlightedSquares[coordinates] &&
      isHeroInPlayerTeam(selectedHeroAndCoordinates.selectedHeroId)
    )
  }

  const didDeselectHero = (hero: HeroInMatch) => {
    return (
      selectedHeroAndCoordinates &&
      selectedHeroAndCoordinates.selectedHeroId === hero.getHeroRef().heroId
    )
  }

  const onDeselectHero = (coordinates: string) => {
    if (selectedHeroAndCoordinates) {
      const { selectedHeroId } = selectedHeroAndCoordinates
      matchManager.resetHighlightedSquares()
      setMovedHeroes(movedHeroes.concat(selectedHeroId))
      showHeroActionMenu(coordinates)
    }
  }

  const onSquarePress = (hero: HeroInMatch, coordinates: string) => {
    if (hero) {
      if (didDeselectHero(hero)) {
        onDeselectHero(coordinates)
      } else {
        onSelectHero(hero, coordinates)
      }
    } else {
      if (canMoveHero(coordinates)) {
        const {
          selectedHeroId,
          selectedHeroCoordinates,
        } = selectedHeroAndCoordinates
        if (movedHeroes.includes(selectedHeroId)) {
          return
        }
        moveHero(selectedHeroCoordinates, coordinates)
        setMovedHeroes(movedHeroes.concat(selectedHeroId))
        showHeroActionMenu(coordinates)
      }
    }
  }

  const onSelectHero = (hero: HeroInMatch, coordinates: string) => {
    matchManager.resetHighlightedSquares()
    if (hero && isHeroInPlayerTeam(hero.getHeroRef().heroId)) {
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

    if (isSelected) {
      return '#ffe599'
    }
    if (hero && isHeroInPlayerTeam(hero.getHeroRef().heroId)) {
      return '#b6d7a8'
    }
    if (hero) {
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
            <Text
              style={{
                fontSize: 11,
                color: movedHeroes.includes(hero.getHeroRef().heroId)
                  ? 'gray'
                  : 'black',
              }}
            >
              {hero.getHeroRef().name}
            </Text>
          ) : (
            <Text></Text>
          )}
        </Pressable>
      )
    }
    return grid
  }

  const onPostAction = () => {
    setMenuToShowCoords(null)
    setSelectedHeroAndCoordinates(null)
    if (movedHeroes.length === matchManager.getPlayerHeroesInMatch().length) {
      doEnemyTurn()
    }
  }

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
              onPostAction()
            }}
            onCancel={() => {
              onPostAction()
            }}
            onWait={() => {
              onPostAction()
            }}
          />
        )}
      </View>
    </View>
  )
}
