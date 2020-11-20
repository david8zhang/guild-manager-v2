import * as React from 'react'
import { Text, View } from 'react-native'
import { Button } from '../../../components'
import { MatchManager } from '../../../lib/MatchManager'
import { HeroInMatch } from '../../../lib/model/HeroInMatch'
import { Move } from '../../../lib/moves/Move'
import { MoveFactory } from '../../../lib/moves/MoveFactory'

interface Props {
  rows: number
  cols: number
  menuToShowCoords: {
    row: number
    col: number
  }
  selectedHeroId: string
  matchManager: MatchManager
  onUseMove: Function
  onCancel: Function
}

export const MoveSetOverlayMenu: React.FC<Props> = ({
  rows,
  cols,
  menuToShowCoords,
  selectedHeroId,
  matchManager,
  onUseMove,
  onCancel,
}) => {
  const hero: HeroInMatch | undefined = matchManager.getHeroByHeroId(
    selectedHeroId
  )
  if (!hero) {
    return <View />
  }
  const moveSet = hero.getHeroRef().moveSet

  // Deserialize move object
  const moveObjects =
    moveSet.length > 0
      ? moveSet.map((move: string) => MoveFactory.getMove(move))
      : []

  const renderGrid = () => {
    const grid = []
    const totalNumCells = rows * cols
    const { row, col } = menuToShowCoords
    for (let i = 0; i < totalNumCells; i++) {
      const coordinates = `${Math.floor(i / cols)},${i % cols}`
      const shouldShowMenu = coordinates === `${row},${col}`
      grid.push(
        <View
          key={`menu-${coordinates}`}
          style={{
            width: `${100 / cols}%`,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            padding: 5,
          }}
        >
          {shouldShowMenu && (
            <View>
              {moveObjects.map((move: Move | null) => {
                if (!move) {
                  return <View />
                }
                return (
                  <Button
                    key={move.name}
                    style={{ width: 90, marginBottom: 5, padding: 2 }}
                    textStyle={{ fontSize: 10 }}
                    text={move.name}
                    onPress={() => {
                      onUseMove(move)
                    }}
                  />
                )
              })}
              <Button
                key='cancel'
                style={{ width: 90, marginBottom: 5, padding: 2 }}
                textStyle={{ fontSize: 10 }}
                text='Cancel'
                onPress={() => {
                  onCancel()
                }}
              />
            </View>
          )}
        </View>
      )
    }
    return grid
  }
  return (
    <View
      style={{
        left: 0,
        right: 0,
        borderColor: 'gray',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        zIndex: 1,
      }}
    >
      {renderGrid()}
    </View>
  )
}
