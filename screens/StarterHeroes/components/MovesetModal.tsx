import * as React from 'react'
import { Text, View } from 'react-native'
import { CustomModal } from '../../../components'
import { Move } from '../../../lib/moves/Move'
import { MoveFactory } from '../../../lib/moves/MoveFactory'

interface Props {
  isOpen: boolean
  onClose: Function
  moveSet: string[]
  style?: any
}

export const MovesetModal: React.FC<Props> = ({
  isOpen,
  onClose,
  moveSet,
  style,
}) => {
  if (!moveSet) {
    return null
  }
  const moves: any[] =
    moveSet.length > 0
      ? moveSet.map((moveName: string) => MoveFactory.getMove(moveName))
      : []
  return (
    <CustomModal
      style={{ zIndex: 2, ...style }}
      isOpen={isOpen}
      onClose={() => {
        onClose()
      }}
      customHeight={230}
    >
      <View>
        <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 10 }}>
          Moveset
        </Text>
        <View style={{ flexDirection: 'row' }}>
          {moves.map((move: Move) => {
            return (
              <View
                style={{ flex: 1, flexDirection: 'column', paddingRight: 10 }}
                key={move.name}
              >
                <Text style={{ fontSize: 18, marginBottom: 5 }}>
                  {move.name}
                </Text>
                <Text style={{ fontSize: 13 }}>{move.description}</Text>
              </View>
            )
          })}
        </View>
      </View>
    </CustomModal>
  )
}
