import * as React from 'react'
import { Pressable, View } from 'react-native'
import { Portal } from 'react-native-paper'
import { MatchManager } from '../../../lib/MatchManager'
import { HeroInMatch } from '../../../lib/model/HeroInMatch'
import { EnemyAttackCutsceneModal } from './EnemyAttackCutsceneModal'
import { HeroInArena } from './HeroInArena'
import { MoveSetOverlayMenu } from './MoveSetOverlayMenu'
import { OverlayMenu } from './OverlayMenu'
import { SkipTurnModal } from './SkipTurnModal'
import { TargetSelectionOverlay } from './TargetSelectionOverlay'
import { TurnDisplayModal } from './TurnDisplayModal'

interface Props {
  matchManager: MatchManager
  refreshScore: Function
  refreshTimer: Function
}

export const Arena: React.FC<Props> = ({
  matchManager,
  refreshScore,
  refreshTimer,
}) => {
  const { map, rows, cols } = matchManager?.getArena()
  const highlightedSquares = matchManager.getHighlightedSquares()

  // Where to show the overlay menu with 'wait', 'cancel move', and 'attack'
  const [menuToShowCoords, setMenuToShowCoords] = React.useState<any>(null)
  const [moveSetMenuCoords, setMoveSetMenuCoords] = React.useState<any>(null) // coordinates for showing the move set menu
  const [pendingMove, setPendingMove] = React.useState<any>(null) // store a reference to move so that it can be reversed

  // Check if it's the player's turn, also show a turn display modal
  const [isPlayerTurn, setIsPlayerTurn] = React.useState(true)
  const [turnDisplaySide, setTurnDisplaySide] = React.useState('') // Show a modal to player saying whether it's their turn or enemy turn

  // Manage attack actions for player
  const [showAttackButton, setShowAttackButton] = React.useState(false)
  const [targetableHeroesMap, setTargetHeroesMap] = React.useState(null)
  const [attackerHero, setAttackerHero] = React.useState<any>(null)
  const [cancelAttackMenuCoords, setCancelAttackMenuCoords] = React.useState<
    any
  >(null)

  // Enemy Attack cutscenes
  const [enemyAttackActions, setEnemyAttackActions] = React.useState<any[]>([])
  const [enemyAttackActionIndex, setEnemyAttackActionIndex] = React.useState(0)

  // general purpose counter to force a component rerender
  const [updateCounter, setUpdateCounter] = React.useState(0)

  const totalNumCells = rows * cols
  const [
    selectedHeroAndCoordinates,
    setSelectedHeroAndCoordinates,
  ] = React.useState<any>(null)

  const moveHero = (
    selectedHeroCoordinates: string,
    coordinates: string,
    selectedHeroId: string
  ) => {
    const hero: HeroInMatch | undefined = matchManager.getHeroByHeroId(
      selectedHeroId
    )
    if (hero) {
      hero.hasMoved = true
    }
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
    setPendingMove({
      origin: [startRow, startCol],
      dest: [targetRow, targetCol],
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
      const hero: HeroInMatch | undefined = matchManager.getHeroByHeroId(
        selectedHeroId
      )
      if (hero) {
        hero.hasMoved = true
      }
      showHeroActionMenu(coordinates)
    }
  }

  const onSquarePress = (hero: HeroInMatch, coordinates: string) => {
    if (!isPlayerTurn) {
      return
    }
    if (hero) {
      if (hero.isDead || hero.hasMoved) {
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
        moveHero(selectedHeroCoordinates, coordinates, selectedHeroId)
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
    if (hero && hero.isUntargetable()) {
      return '#DAA520'
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
          <HeroInArena hero={hero} />
        </Pressable>
      )
    }
    return grid
  }

  const finishHeroAction = () => {
    // If all the heroes in the player's team have been moved, do the enemy's turn
    if (matchManager.haveAllPlayerHeroesMoved()) {
      finishPlayerTurn()
    }
    // Refresh the score after each turn so that the UI updates the score if any points were scored
    refreshScore()
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

  // Manage turn transitions
  const finishPlayerTurn = () => {
    matchManager.tickUntargetTimer('player')
    matchManager.tickRespawnTimer('player')
    setIsPlayerTurn(false)
    setTurnDisplaySide('Enemy')
    setTimeout(() => {
      doEnemyTurn()
      setTurnDisplaySide('')
    }, 1000)
  }

  const finishEnemyTurn = () => {
    matchManager.tickUntargetTimer('enemy')
    matchManager.tickRespawnTimer('enemy')
    matchManager.resetPlayerMoves()
    setIsPlayerTurn(true)
    matchManager.decrementMatchTimer()

    // If the game is over, don't show a 'Player Turn' info modal
    if (!matchManager.isGameOver()) {
      setTurnDisplaySide('Player')
      setTimeout(() => {
        refreshTimer()
        setTurnDisplaySide('')
      }, 1000)
    } else {
      setTimeout(() => {
        refreshTimer()
      }, 1000)
    }
  }

  // Manage attack logic
  const onChooseAttackTarget = () => {
    const { row, col } = menuToShowCoords
    const { selectedHeroId } = selectedHeroAndCoordinates
    matchManager.highlightAttackableSquares(row, col)
    const attackerHero: HeroInMatch | undefined = matchManager.getHeroByHeroId(
      selectedHeroId
    )
    if (attackerHero) {
      setAttackerHero(attackerHero)
      setMenuToShowCoords(null)
      setCancelAttackMenuCoords(menuToShowCoords)
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
  }

  const onCancelAttack = () => {
    matchManager.resetHighlightedSquares()
    setMenuToShowCoords(cancelAttackMenuCoords)
    setCancelAttackMenuCoords(null)
  }

  const onFinishedAttacking = () => {
    matchManager.resetHighlightedSquares()
    setAttackerHero(null)
    finishHeroAction()
    onPostActionCleanup()
  }

  const onPostActionCleanup = () => {
    setMenuToShowCoords(null)
    setSelectedHeroAndCoordinates(null)
    setShowAttackButton(false)
    setPendingMove(null)
    setTargetHeroesMap(null)
  }

  const onUndoMove = () => {
    const { selectedHeroId } = selectedHeroAndCoordinates
    const hero: HeroInMatch | undefined = matchManager.getHeroByHeroId(
      selectedHeroId
    )
    if (hero) {
      hero.hasMoved = false
      if (pendingMove) {
        const { origin, dest } = pendingMove
        matchManager.moveHero({
          start: {
            row: dest[0],
            col: dest[1],
          },
          target: {
            row: origin[0],
            col: origin[1],
          },
        })
      }
      onPostActionCleanup()
    }
  }

  const checkAllPlayerHeroesDead = (): boolean => {
    const deadHeroCount = matchManager
      .getPlayerHeroesInMatch()
      .reduce((acc, curr) => {
        if (curr.isDead) {
          acc++
        }
        return acc
      }, 0)
    if (deadHeroCount === matchManager.getPlayerHeroesInMatch().length) {
      return true
    }
    return false
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

        {/* If all player heroes are dead, show a popup and let them skip their turn */}
        <Portal>
          <SkipTurnModal
            isOpen={isPlayerTurn && checkAllPlayerHeroesDead()}
            onContinue={() => {
              finishPlayerTurn()
            }}
          />
        </Portal>

        <Portal>
          <TurnDisplayModal
            currTurn={turnDisplaySide}
            isOpen={turnDisplaySide !== ''}
            onClose={() => setTurnDisplaySide('')}
          />
        </Portal>

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
            cancelAttackMenuCoords={cancelAttackMenuCoords}
            onCancel={() => onCancelAttack()}
            attackableTargetCoords={targetableHeroesMap}
            rows={rows}
            cols={cols}
            playerHero={attackerHero}
            onConfirmAttack={() => {
              onFinishedAttacking()
            }}
          />
        )}
        {moveSetMenuCoords && (
          <MoveSetOverlayMenu
            rows={rows}
            cols={cols}
            selectedHeroId={selectedHeroAndCoordinates.selectedHeroId}
            matchManager={matchManager}
            menuToShowCoords={moveSetMenuCoords}
            onCancel={() => {
              setMenuToShowCoords(moveSetMenuCoords)
              setMoveSetMenuCoords(null)
            }}
            onUseMove={(move: string) => {
              console.log('Move:', move)
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
            onUseSkill={() => {
              setMenuToShowCoords(null)
              setMoveSetMenuCoords(menuToShowCoords)
            }}
            onCancel={() => {
              onUndoMove()
            }}
            onWait={() => {
              onPostActionCleanup()
              finishHeroAction()
            }}
          />
        )}
      </View>
    </View>
  )
}
