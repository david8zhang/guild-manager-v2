import * as React from 'react'
import { Pressable, View } from 'react-native'
import { Portal } from 'react-native-paper'
import { Button } from '../../../components'
import { MatchManager } from '../../../lib/MatchManager'
import { HeroInMatch } from '../../../lib/model/HeroInMatch'
import { AttackCutsceneModal } from './AttackCutsceneModal'
import { AttackMatchupModal } from './AttackMatchupModal'

interface Props {
  rows: number
  cols: number
  attackableHeroes: any
  onConfirmAttack: Function
  playerHero: HeroInMatch
  matchManager: MatchManager
  cancelAttackMenuCoords?: { row: number; col: number }
  onCancel?: Function
}

export const TargetSelectionOverlay: React.FC<Props> = ({
  rows,
  cols,
  attackableHeroes,
  playerHero,
  onConfirmAttack,
  matchManager,
  cancelAttackMenuCoords,
  onCancel,
}) => {
  const [targetToAttack, setTargetToAttack] = React.useState<any>(null)
  const [isAttacking, setIsAttacking] = React.useState(false)
  const renderGrid = () => {
    const grid = []
    const totalNumCells = rows * cols

    for (let i = 0; i < totalNumCells; i++) {
      const coordinates = `${Math.floor(i / cols)},${i % cols}`

      const selectableHero: HeroInMatch = attackableHeroes[coordinates]
      const shouldShowMenu =
        cancelAttackMenuCoords &&
        coordinates ===
          `${cancelAttackMenuCoords.row},${cancelAttackMenuCoords.col}`
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
            if (selectableHero) {
              setTargetToAttack(selectableHero)
            }
          }}
        >
          {shouldShowMenu && (
            <Button
              style={{ width: 80, marginBottom: 5, padding: 2 }}
              textStyle={{ fontSize: 10 }}
              text='Cancel Attack'
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
        <AttackMatchupModal
          isOpen={targetToAttack !== null}
          onClose={() => setTargetToAttack(null)}
          targetToAttack={targetToAttack}
          playerHero={playerHero}
          onAttack={() => {
            setIsAttacking(true)
          }}
        />
        <AttackCutsceneModal
          matchManager={matchManager}
          isOpen={isAttacking}
          onClose={() => {
            setIsAttacking(false)
            setTargetToAttack(null)
            onConfirmAttack()
          }}
          targetHero={targetToAttack}
          playerHero={playerHero}
        />
      </Portal>
      {renderGrid()}
    </View>
  )
}