import * as React from 'react'
import { Pressable, Text, View } from 'react-native'
import { Portal } from 'react-native-paper'
import { MatchManager } from '../../../lib/MatchManager'
import { HeroInMatch } from '../../../lib/model/HeroInMatch'
import { EnemyAttackCutsceneModal } from './EnemyAttackCutsceneModal'
import { HeroInArena } from './HeroInArena'
import { OverlayMenu } from './OverlayMenu'
import { TargetSelectionOverlay } from './TargetSelectionOverlay'

interface Props {
  matchManager: MatchManager
  refreshScore: Function
}

export const Arena: React.FC<Props> = ({ matchManager, refreshScore }) => {
  const { map, rows, cols } = matchManager?.getArena()
  const highlightedSquares = matchManager.getHighlightedSquares()
  const [menuToShowCoords, setMenuToShowCoords] = React.useState<any>(null)
  const [movedHeroes, setMovedHeroes] = React.useState<string[]>([])
  const [showAttackButton, setShowAttackButton] = React.useState(false)
  const [targetableHeroesMap, setTargetHeroesMap] = React.useState(null)
  const [attackerHero, setAttackerHero] = React.useState<any>(null)

  // Enemy Attack cutscenes
  const [enemyAttackActions, setEnemyAttackActions] = React.useState<any[]>([])
  const [enemyAttackActionIndex, setEnemyAttackActionIndex] = React.useState<
    any
  >(0)

  // general purpose counter to force a component rerender
  const [updateCounter, setUpdateCounter] = React.useState(0)

  const totalNumCells = rows * cols
  const [
    selectedHeroAndCoordinates,
    setSelectedHeroAndCoordinates,
  ] = React.useState<any>(null)

  const finishEnemyTurn = () => {
    matchManager.tickRespawnTimer('enemy')
    setMovedHeroes([])
  }

  const doEnemyTurn = () => {
    setTimeout(() => {
      matchManager.moveEnemyHeroes()
      setUpdateCounter(updateCounter + 1) // Force an update so the enemies move, wait, then attack
      const attackActions = matchManager.doEnemyHeroAttacks()
      if (attackActions.length > 0) {
        setTimeout(() => {
          setEnemyAttackActions(attackActions)
        }, 1000)
      } else {
        finishEnemyTurn()
      }
    }, 1000)
  }

  const moveHero = (selectedHeroCoordinates: string, coordinates: string) => {
    const [startRow, startCol] = selectedHeroCoordinates.split(',')
    const [targetRow, targetCol] = coordinates.split(',')
    matchManager.resetHighlightedSquares()
    matchManager.moveHero({
      start: {
        row: parseInt(startRow, 10),
        col: parseInt(startCol, 10),
      },
      target: {
        row: parseInt(targetRow, 10),
        col: parseInt(targetCol, 10),
      },
    })
  }

  const getEnemiesInAttackRange = (row: number, col: number) => {
    return matchManager
      .getHeroesInAttackRange(row, col)
      .filter((item: { hero: HeroInMatch; coordinates: number[] }) => {
        const { hero } = item
        return !isHeroInPlayerTeam(hero.getHeroRef().heroId)
      })
  }

  const showHeroActionMenu = (coordinates: string): void => {
    const [targetRow, targetCol] = coordinates.split(',')
    const targetRowNum = parseInt(targetRow)
    const targetColNum = parseInt(targetCol)

    const enemiesInAttackRange = getEnemiesInAttackRange(
      targetRowNum,
      targetColNum
    )
    if (enemiesInAttackRange.length > 0) {
      setShowAttackButton(true)
    }
    setMenuToShowCoords({
      row: targetRowNum,
      col: targetColNum,
    })
  }

  const isHeroInPlayerTeam = (heroId: string) => {
    const playerHeroIds = matchManager
      .getPlayerHeroesInMatch()
      .map((hero: HeroInMatch) => hero.getHeroRef().heroId)
    return playerHeroIds.includes(heroId)
  }

  const canMoveHero = (coordinates: string): boolean => {
    return (
      selectedHeroAndCoordinates &&
      highlightedSquares[coordinates] !== undefined &&
      isHeroInPlayerTeam(selectedHeroAndCoordinates.selectedHeroId)
    )
  }

  const didDeselectHero = (hero: HeroInMatch) => {
    return (
      selectedHeroAndCoordinates &&
      selectedHeroAndCoordinates.selectedHeroId === hero.getHeroRef().heroId
    )
  }

  const onDeselectHero = (coordinates: string) => {
    if (selectedHeroAndCoordinates) {
      const { selectedHeroId } = selectedHeroAndCoordinates
      matchManager.resetHighlightedSquares()
      setMovedHeroes(movedHeroes.concat(selectedHeroId))
      showHeroActionMenu(coordinates)
    }
  }

  const onSquarePress = (hero: HeroInMatch, coordinates: string) => {
    if (hero) {
      if (hero.isDead || movedHeroes.includes(hero.getHeroRef().heroId)) {
        return
      }
      if (didDeselectHero(hero)) {
        onDeselectHero(coordinates)
      } else {
        onSelectHero(hero, coordinates)
      }
    } else {
      if (canMoveHero(coordinates)) {
        const {
          selectedHeroId,
          selectedHeroCoordinates,
        } = selectedHeroAndCoordinates
        if (movedHeroes.includes(selectedHeroId)) {
          return
        }
        moveHero(selectedHeroCoordinates, coordinates)
        setMovedHeroes(movedHeroes.concat(selectedHeroId))
        showHeroActionMenu(coordinates)
      }
    }
  }

  const onSelectHero = (hero: HeroInMatch, coordinates: string) => {
    matchManager.resetHighlightedSquares()
    if (hero && isHeroInPlayerTeam(hero.getHeroRef().heroId)) {
      setSelectedHeroAndCoordinates({
        selectedHeroId: hero.getHeroRef().heroId,
        selectedHeroCoordinates: coordinates,
      })
    }
    const [row, col] = coordinates.split(',')
    matchManager.highlightMoveableSquares(parseInt(row), parseInt(col))
  }

  const getSquareColor = (coordinates: string) => {
    const selectedHeroId = selectedHeroAndCoordinates
      ? selectedHeroAndCoordinates.selectedHeroId
      : ''
    const hero: HeroInMatch = map[coordinates]
    const isSelected = hero && selectedHeroId === hero.getHeroRef().heroId
    const highlightColor = highlightedSquares[coordinates]
    const isSpawnLocation = matchManager.isSpawnLocation(coordinates)

    if (isSelected) {
      return '#ffe599'
    }
    if (hero && isHeroInPlayerTeam(hero.getHeroRef().heroId)) {
      return '#b6d7a8'
    }
    if (highlightColor) {
      return highlightColor
    }
    if (isSpawnLocation) {
      return '#ddd'
    }
    if (hero) {
      return 'white'
    }
    return 'white'
  }

  const renderGrid = () => {
    const grid = []
    for (let i = 0; i < totalNumCells; i++) {
      const coordinates = `${Math.floor(i / cols)},${i % cols}`
      const hero: HeroInMatch = map[coordinates]
      grid.push(
        <Pressable
          key={`hero-${coordinates}`}
          onPress={() => {
            onSquarePress(hero, coordinates)
          }}
          style={{
            overflow: 'visible',
            width: `${100 / cols}%`,
            borderColor: 'gray',
            borderLeftWidth: 1,
            borderBottomWidth: 1,
            height: 50,
            backgroundColor: getSquareColor(coordinates),
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 1,
            padding: 5,
          }}
        >
          <HeroInArena hero={hero} movedHeroes={movedHeroes} />
        </Pressable>
      )
    }
    return grid
  }

  const onPostAction = () => {
    setMenuToShowCoords(null)
    setSelectedHeroAndCoordinates(null)
    setShowAttackButton(false)
    setTargetHeroesMap(null)
  }

  const finishHeroAction = () => {
    // If all the heroes in the player's team have been moved, do the enemy's turn
    const livingHeroes = matchManager
      .getPlayerHeroesInMatch()
      .filter((h: HeroInMatch) => !h.isDead)
    if (movedHeroes.length === livingHeroes.length) {
      doEnemyTurn()
      matchManager.tickRespawnTimer('player')
    }

    // Refresh the score after each turn so that the UI updates the score if any points were scored
    refreshScore()
  }

  const onChooseAttackTarget = () => {
    const { row, col } = menuToShowCoords
    matchManager.highlightAttackableSquares(row, col)
    setAttackerHero(
      matchManager.getHeroByHeroId(selectedHeroAndCoordinates.selectedHeroId)
    )
    onPostAction()
    const attackableEnemies = getEnemiesInAttackRange(row, col).reduce(
      (acc, curr) => {
        const { coordinates, hero } = curr
        const key = `${coordinates[0]},${coordinates[1]}`
        acc[key] = hero
        return acc
      },
      {}
    )
    setTargetHeroesMap(attackableEnemies)
  }

  const onFinishedAttacking = () => {
    matchManager.resetHighlightedSquares()
    setTargetHeroesMap(null)
    finishHeroAction()
  }

  const onUndoMove = () => {
    // TODO: Implement undo move logic
    onPostAction()
    finishHeroAction()
  }

  return (
    <View style={{ width: '100%' }}>
      <View
        style={{
          marginLeft: 15,
          marginRight: 15,
          borderTopWidth: 1,
          borderRightWidth: 1,
          borderColor: 'gray',
          flexDirection: 'row',
          flexWrap: 'wrap',
          backgroundColor: '#ddd',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {renderGrid()}

        {/* When enemy finds a player hero within range, attack it and play a series of little cutscenes */}
        <Portal>
          <EnemyAttackCutsceneModal
            matchManager={matchManager}
            isOpen={enemyAttackActions.length > 0}
            attackAction={
              enemyAttackActions && enemyAttackActions[enemyAttackActionIndex]
            }
            onContinue={() => {
              if (enemyAttackActionIndex === enemyAttackActions.length - 1) {
                setEnemyAttackActions([])
                setEnemyAttackActionIndex(0)
                finishEnemyTurn()
              } else {
                setEnemyAttackActionIndex(enemyAttackActionIndex + 1)
              }
              refreshScore()
            }}
          />
        </Portal>

        {targetableHeroesMap && (
          <TargetSelectionOverlay
            matchManager={matchManager}
            attackableTargetCoords={targetableHeroesMap}
            rows={rows}
            cols={cols}
            playerHero={attackerHero}
            onConfirmAttack={() => {
              onFinishedAttacking()
            }}
          />
        )}
        {menuToShowCoords && (
          <OverlayMenu
            rows={rows}
            cols={cols}
            menuToShowCoords={menuToShowCoords}
            canAttack={showAttackButton}
            onAttack={() => {
              onChooseAttackTarget()
            }}
            onCancel={() => {
              onUndoMove()
            }}
            onWait={() => {
              onPostAction()
              finishHeroAction()
            }}
          />
        )}
      </View>
    </View>
  )
}
