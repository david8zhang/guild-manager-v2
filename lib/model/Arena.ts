import { Hero } from './Hero'
import { HeroInMatch } from './HeroInMatch'

export class Arena {
  public static NUM_COLS = 13
  public static NUM_ROWS = 6
  public map: {
    [key: string]: HeroInMatch | null
  }
  private enemyHeroes: HeroInMatch[]
  private playerHeroes: HeroInMatch[]
  public highlightedSquares: {
    [key: string]: string
  }

  constructor(playerHeroes: HeroInMatch[], enemyHeroes: HeroInMatch[]) {
    this.playerHeroes = playerHeroes
    this.enemyHeroes = enemyHeroes
    this.map = {}
    this.highlightedSquares = {}
  }

  public getMap(): { [key: string]: HeroInMatch | null } {
    return this.map
  }

  public getHeroAtLocation(row: number, col: number): HeroInMatch {
    const key = this.getCoordinateKey(row, col)
    return this.map[key] as HeroInMatch
  }

  public highlightSquares(squares: number[][], color: string) {
    squares.forEach((coord) => {
      const [row, col] = coord
      const key = this.getCoordinateKey(row, col)
      this.highlightedSquares[key] = color
    })
  }

  public unhighlightSquares(squares: number[][]) {
    squares.forEach((coord) => {
      const [row, col] = coord
      const key = this.getCoordinateKey(row, col)
      delete this.highlightedSquares[key]
    })
  }

  public getHighlightedSquares() {
    return this.highlightedSquares
  }

  public resetSquareHighlight() {
    Object.keys(this.highlightedSquares).forEach((key) => {
      delete this.highlightedSquares[key]
    })
  }

  private getCoordinateKey(row: number, col: number) {
    return `${row},${col}`
  }

  public getSquaresInRange(range: number, rows: number, cols: number) {
    const seen = new Set<string>([])
    let currLevel = range
    const directions = [
      [0, 1],
      [0, -1],
      [-1, 0],
      [1, 0],
    ]
    const queue = [[rows, cols]]
    const squaresInRange: number[][] = []
    while (queue.length > 0) {
      const size = queue.length
      if (currLevel == 0) {
        return squaresInRange
      }
      for (let i = 0; i < size; i++) {
        const coord = queue.shift() as number[]
        squaresInRange.push(coord)
        directions.forEach((dir) => {
          const newCoords = [coord[0] + dir[0], coord[1] + dir[1]]
          if (
            this.isWithinRange(newCoords) &&
            !seen.has(`${newCoords[0]},${newCoords[1]}`)
          ) {
            seen.add(`${coord[0]},${coord[1]}`)
            queue.push(newCoords)
          }
        })
      }
      currLevel--
    }
    return squaresInRange
  }

  public isWithinRange(newCoords: number[]) {
    return (
      newCoords[0] >= 0 &&
      newCoords[0] < Arena.NUM_ROWS &&
      newCoords[1] >= 0 &&
      newCoords[1] < Arena.NUM_COLS
    )
  }

  public moveHero(
    start: { row: number; col: number },
    end: { row: number; col: number }
  ) {
    const startKey = this.getCoordinateKey(start.row, start.col)
    const endKey = this.getCoordinateKey(end.row, end.col)
    this.map[endKey] = this.map[startKey]
    this.map[startKey] = null
  }

  public initializeArena(): void {
    let playerHeroesIndex: number = 0
    let enemyHeroesIndex: number = 0

    // Initialize player heroes on the left side of the map
    for (let i = 1; i < Arena.NUM_ROWS; i++) {
      if (playerHeroesIndex < this.playerHeroes.length) {
        const key = this.getCoordinateKey(i, 0)
        this.map[key] = this.playerHeroes[playerHeroesIndex++]
      }
    }

    // Initialize enemy heroes on the right side of the map
    for (let i = 1; i < Arena.NUM_ROWS; i++) {
      if (enemyHeroesIndex < this.enemyHeroes.length) {
        const key = this.getCoordinateKey(i, Arena.NUM_COLS - 1)
        this.map[key] = this.enemyHeroes[enemyHeroesIndex++]
      }
    }
  }

  public getEnemyHeroPositions(): number[][] {
    const enemyHeroIds: string[] = this.enemyHeroes.map(
      (h: HeroInMatch) => h.getHeroRef().heroId
    )
    const coordinates: number[][] = []
    Object.keys(this.map).forEach((coordinate: string) => {
      const [row, col] = coordinate.split(',')
      if (
        this.map[coordinate] &&
        enemyHeroIds.includes(
          this.map[coordinate]?.getHeroRef().heroId as string
        )
      ) {
        coordinates.push([parseInt(row, 10), parseInt(col, 10)])
      }
    })
    return coordinates
  }

  public getPlayerHeroPositions(): number[][] {
    const playerHeroIds: string[] = this.playerHeroes.map(
      (h: HeroInMatch) => h.getHeroRef().heroId
    )
    const coordinates: number[][] = []
    Object.keys(this.map).forEach((coordinate: string) => {
      const [row, col] = coordinate.split(',')
      if (
        this.map[coordinate] &&
        playerHeroIds.includes(
          this.map[coordinate]?.getHeroRef().heroId as string
        )
      ) {
        coordinates.push([parseInt(row, 10), parseInt(col, 10)])
      }
    })
    return coordinates
  }

  public getManhattanDistance(start: number[], end: number[]): number {
    return Math.abs(start[0] - end[0]) + Math.abs(start[1] - end[1])
  }
}