import * as React from 'react'
import { Pressable, View } from 'react-native'
import { Portal } from 'react-native-paper'
import { Button } from '../../../components'
import { MatchManager } from '../../../lib/MatchManager'
import { HeroInMatch } from '../../../lib/model/HeroInMatch'
import { Move } from '../../../lib/moves/Move'
import { SkillCutsceneModal } from './SkillCutsceneModal'

interface Props {
  rows: number
  cols: number
  cancelMoveMenuCoords: {
    row: number
    col: number
  }
  userHero: HeroInMatch
  skillToUse: Move
  targetableHeroes: any
  onCancel: Function
  onConfirmMove: Function
  matchManager: MatchManager
}

export const SkillTargetOverlay: React.FC<Props> = ({
  rows,
  cols,
  userHero,
  cancelMoveMenuCoords,
  targetableHeroes,
  onCancel,
  skillToUse,
  onConfirmMove,
  matchManager,
}) => {
  const [target, setTarget] = React.useState<any>(null)
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
            if (
              selectableHero &&
              skillToUse.isTargetValid(userHero, selectableHero, matchManager)
            ) {
              setTarget(selectableHero)
            }
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
      <Portal>
        <SkillCutsceneModal
          matchManager={matchManager}
          isOpen={target !== null}
          onClose={() => {
            setTarget(null)
            onConfirmMove()
          }}
          userHero={userHero}
          targetHero={target}
          skill={skillToUse}
          userSide='left'
        />
      </Portal>
      {renderGrid()}
    </View>
  )
}
