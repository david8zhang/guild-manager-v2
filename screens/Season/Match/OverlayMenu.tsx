import * as React from 'react'
import { View } from 'react-native'
import { Button } from '../../../components'
import { Tile } from './Tile'

interface Props {
  rows: number
  cols: number
  menuToShowCoords: {
    row: number
    col: number
  }
  onAttack: Function
  onWait: Function
  onCancel: Function
  onUseSkill: Function
  canAttack: boolean
  canUseSkill: boolean
}

export const OverlayMenu: React.FC<Props> = ({
  rows,
  cols,
  menuToShowCoords,
  onAttack,
  onWait,
  onCancel,
  onUseSkill,
  canAttack,
  canUseSkill,
}) => {
  const renderGrid = () => {
    const grid = []
    const totalNumCells = rows * cols
    const { row, col } = menuToShowCoords
    for (let i = 0; i < totalNumCells; i++) {
      const coordinates = `${Math.floor(i / cols)},${i % cols}`
      const shouldShowMenu = coordinates === `${row},${col}`
      grid.push(
        <Tile
          key={`menu-${coordinates}`}
          cols={cols}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            padding: 5,
            backgroundColor: 'transparent',
          }}
        >
          {shouldShowMenu ? (
            <View>
              {canAttack && (
                <Button
                  style={{ width: 90, marginBottom: 2, padding: 2 }}
                  textStyle={{ fontSize: 10 }}
                  text='Attack'
                  onPress={() => {
                    onAttack()
                  }}
                />
              )}
              {canUseSkill && (
                <Button
                  style={{ width: 90, marginBottom: 2, padding: 2 }}
                  textStyle={{ fontSize: 10 }}
                  text='Use Skill'
                  onPress={() => {
                    onUseSkill()
                  }}
                />
              )}
              <Button
                style={{ width: 90, marginBottom: 2, padding: 2 }}
                textStyle={{ fontSize: 10 }}
                text='Wait'
                onPress={() => {
                  onWait()
                }}
              />
              <Button
                style={{ width: 90, marginBottom: 2, padding: 2 }}
                textStyle={{ fontSize: 10 }}
                text='Cancel Move'
                onPress={() => {
                  onCancel()
                }}
              />
            </View>
          ) : (
            <View />
          )}
        </Tile>
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
