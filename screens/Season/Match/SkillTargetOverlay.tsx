import * as React from 'react'
import { Pressable, View } from 'react-native'
import { Button } from '../../../components'
import { MatchManager } from '../../../lib/MatchManager'
import { HeroInMatch } from '../../../lib/model/HeroInMatch'
import { Move } from '../../../lib/moves/Move'

interface Props {
  rows: number
  cols: number
  cancelMoveMenuCoords: {
    row: number
    col: number
  }
  targetableHeroes: any
  onCancel: Function
  onConfirmMove: Function
}

export const SkillTargetOverlay: React.FC<Props> = ({
  rows,
  cols,
  cancelMoveMenuCoords,
  targetableHeroes,
  onCancel,
}) => {
  const renderGrid = () => {
    const grid = []
    const totalNumCells = rows * cols

    for (let i = 0; i < totalNumCells; i++) {
      const coordinates = `${Math.floor(i / cols)},${i % cols}`
      const selectableHero: HeroInMatch = targetableHeroes[coordinates]

      // Determine when to show a cancel button
      const shouldShowMenu =
        cancelMoveMenuCoords &&
        coordinates ===
          `${cancelMoveMenuCoords.row},${cancelMoveMenuCoords.col}`

      grid.push(
        <Pressable
          key={`menu-${coordinates}`}
          style={{
            width: `${100 / cols}%`,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            padding: 5,
          }}
          onPress={() => {
            console.log('Hero to target: ', selectableHero)
            // if (selectableHero) {
            //   setTarget(selectableHero)
            // }
          }}
        >
          {shouldShowMenu && (
            <Button
              style={{ width: 80, marginBottom: 5, padding: 2 }}
              textStyle={{ fontSize: 10 }}
              text='Cancel'
              onPress={() => {
                if (onCancel) {
                  onCancel()
                }
              }}
            />
          )}
        </Pressable>
      )
    }
    return grid
  }
  return (
    <View
      style={{
        left: 0,
        right: 0,
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
