import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'
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
  onUseSkill: Function
  onCancel: Function
}

export const SkillSetOverlayMenu: React.FC<Props> = ({
  rows,
  cols,
  menuToShowCoords,
  selectedHeroId,
  matchManager,
  onUseSkill,
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
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        zIndex: 1,
        left: 0,
        opacity: 0.7,
        backgroundColor: 'gray',
      }}
    >
      <View>
        {moveObjects.map((move: Move | null) => {
          if (!move) {
            return <View />
          }
          return (
            <Button
              key={move.name}
              style={styles.buttonStyle}
              textStyle={{ fontSize: 15 }}
              text={move.name}
              onPress={() => {
                onUseSkill(move)
              }}
            />
          )
        })}
        <Button
          key='cancel'
          style={styles.buttonStyle}
          textStyle={{ fontSize: 15 }}
          text='Cancel'
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
    backgroundColor: 'white',
  },
})
