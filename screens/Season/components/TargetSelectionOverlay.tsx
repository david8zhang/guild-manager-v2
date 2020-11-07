import * as React from 'react'
import { Pressable, View } from 'react-native'
import { Portal } from 'react-native-paper'
import { HeroInMatch } from '../../../lib/model/HeroInMatch'
import { AttackMatchupModal } from './AttackMatchupModal'

interface Props {
  rows: number
  cols: number
  attackableTargetCoords: any
  onConfirmAttack: Function
  playerHero: HeroInMatch
}

export const TargetSelectionOverlay: React.FC<Props> = ({
  rows,
  cols,
  attackableTargetCoords,
  playerHero,
}) => {
  const [targetToAttack, setTargetToAttack] = React.useState<any>(null)
  const renderGrid = () => {
    const grid = []
    const totalNumCells = rows * cols
    for (let i = 0; i < totalNumCells; i++) {
      const coordinates = `${Math.floor(i / cols)},${i % cols}`
      const selectableHero: HeroInMatch = attackableTargetCoords[coordinates]
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
        ></Pressable>
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
        />
      </Portal>
      {renderGrid()}
    </View>
  )
}
