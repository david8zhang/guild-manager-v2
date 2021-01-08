import * as React from 'react'
import { View } from 'react-native'
import { MatchManager } from '../../../lib/MatchManager'
import { Tile } from './Tile'

interface Props {
  rows: number
  cols: number
  matchManager: MatchManager
  hasConfirmedMove: boolean
}

export const PowerUpUnderlay: React.FC<Props> = ({
  rows,
  cols,
  matchManager,
  hasConfirmedMove,
}) => {
  const allHeroPositions = matchManager.getAllHeroLocations()
  const powerUps = matchManager.getPowerUps()

  const renderGrid = () => {
    const totalNumCells = rows * cols
    const grid = []
    for (let i = 0; i < totalNumCells; i++) {
      const row = Math.floor(i / cols)
      const col = i % cols
      const coordinates = `${row},${col}`
      const powerUp = powerUps[coordinates]
      grid.push(
        <Tile
          key={`tileimage-${coordinates}-${i}`}
          style={{
            position: 'relative',
            overflow: 'visible',
            backgroundColor: 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          pointerEvents={powerUp ? 'none' : null}
          cols={cols}
        >
          {powerUp ? (
            <View>
              {powerUp.getPowerUpSprite(
                hasConfirmedMove,
                allHeroPositions,
                matchManager
              )}
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
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        zIndex: 0,
      }}
    >
      {renderGrid()}
    </View>
  )
}
