import * as React from 'react'
import { Text, View } from 'react-native'
import { Arena } from '../../../lib/model/Arena'
import { PowerUp } from '../../../lib/powerup/Powerup'
import { Tile } from './Tile'

interface Props {
  rows: number
  cols: number
  arena: Arena
  allHeroPositions: number[][]
  powerUps: {
    [key: string]: PowerUp
  }
}

export const PowerUpUnderlay: React.FC<Props> = ({
  rows,
  cols,
  powerUps,
  arena,
  allHeroPositions,
}) => {
  React.useEffect(() => {
    if (arena) {
      allHeroPositions.forEach((position: number[]) => {
        const coordKey = `${position[0]},${position[1]}`
        if (powerUps[coordKey]) {
          console.log(arena.getHeroAtLocation)
          const powerUpAtPosition = powerUps[coordKey]
          const heroAtPosition = arena.getHeroAtLocation(
            position[0],
            position[1]
          )
          console.log(
            heroAtPosition.getHeroRef().name,
            'got',
            powerUpAtPosition.name
          )
        }
      })
    }
  }, [allHeroPositions])

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
          {powerUp ? <View>{powerUp.getPowerUpSprite()}</View> : <View />}
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
