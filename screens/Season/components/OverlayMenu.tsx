import * as React from 'react'
import { Text, View } from 'react-native'
import { Button } from '../../../components'

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
}

export const OverlayMenu: React.FC<Props> = ({
  rows,
  cols,
  menuToShowCoords,
  onAttack,
  onWait,
  onCancel,
}) => {
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
              <Button
                style={{ width: 90, marginBottom: 5, padding: 2 }}
                textStyle={{ fontSize: 10 }}
                text='Attack'
                onPress={() => {
                  onAttack()
                }}
              />
              <Button
                style={{ width: 90, marginBottom: 5, padding: 2 }}
                textStyle={{ fontSize: 10 }}
                text='Wait'
                onPress={() => {
                  onWait()
                }}
              />
              <Button
                style={{ width: 90, marginBottom: 5, padding: 2 }}
                textStyle={{ fontSize: 10 }}
                text='Cancel Move'
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
