import * as React from 'react'
import { Image, View } from 'react-native'
import { TILES } from '../../../lib/constants/arenaTiles'
import { TEAM_COLOR } from '../../../lib/constants/fullTeamColors'
import { TEAM_IMAGES } from '../../../lib/constants/fullTeamImages'
import { Tile } from './Tile'

interface Props {
  rows: number
  cols: number
  tileMap: number[][]
  teamName: string
}

export const ArenaTileMapUnderlay: React.FC<Props> = ({
  rows,
  cols,
  tileMap,
  teamName,
}) => {
  const renderGrid = () => {
    const totalNumCells = rows * cols
    const grid = []
    for (let i = 0; i < totalNumCells; i++) {
      const row = Math.floor(i / cols)
      const col = i % cols
      const coordinates = `${row},${col}`
      const tileImageIndex = tileMap[row][col]
      grid.push(
        <Tile
          key={`tileimage-${coordinates}-${i}`}
          style={{
            position: 'relative',
            overflow: 'visible',
            backgroundColor: TEAM_COLOR[teamName],
          }}
          cols={cols}
        >
          <Image
            style={{ width: '100%', height: '100%' }}
            resizeMode='cover'
            source={TILES[tileImageIndex]}
          />
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
        zIndex: 0,
      }}
    >
      {renderGrid()}
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          position: 'absolute',
          zIndex: 1,
          opacity: 0.8,
        }}
      >
        <Image
          source={TEAM_IMAGES[teamName]}
          style={{ width: 125, height: 125 }}
          resizeMode='contain'
        />
      </View>
    </View>
  )
}
