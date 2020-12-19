import * as React from 'react'
import { StyleSheet, View } from 'react-native'
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
  cols,
  menuToShowCoords,
  onAttack,
  onWait,
  onCancel,
  onUseSkill,
  canAttack,
  canUseSkill,
}) => {
  const style: any = {
    position: 'absolute',
    top: 0,
    zIndex: 1,
    left: 0,
    opacity: 0.7,
    backgroundColor: 'gray',
  }
  return (
    <View style={style}>
      <View>
        {canAttack && (
          <Button
            style={styles.buttonStyle}
            textStyle={{ fontSize: 15 }}
            text='Attack'
            onPress={() => {
              onAttack()
            }}
          />
        )}
        {canUseSkill && (
          <Button
            style={styles.buttonStyle}
            textStyle={{ fontSize: 15 }}
            text='Use Skill'
            onPress={() => {
              onUseSkill()
            }}
          />
        )}
        <Button
          style={styles.buttonStyle}
          textStyle={{ fontSize: 15 }}
          text='Wait'
          onPress={() => {
            onWait()
          }}
        />
        <Button
          style={styles.buttonStyle}
          textStyle={{ fontSize: 15 }}
          text='Cancel Move'
          onPress={() => {
            onCancel()
          }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  buttonStyle: {
    width: 150,
    marginBottom: 1,
    padding: 5,
  },
})
