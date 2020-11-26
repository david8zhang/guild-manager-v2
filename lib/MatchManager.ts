import { times } from 'lodash'
import { HeroStats } from './constants/HeroStats'
import { EnemyAIManager } from './EnemyAIManager'
import { Arena } from './model/Arena'
import { Hero } from './model/Hero'
import { HeroInMatch } from './model/HeroInMatch'
import { MatchEvent } from './model/MatchEvent'

interface TeamInfo {
  name: string
  abbrev: string
  teamId: string
}

export interface MatchManagerConfig {
  playerHeroes: Hero[]
  enemyHeroes: Hero[]
  playerTeamInfo: TeamInfo
  enemyTeamInfo: TeamInfo
}

export class MatchManager {
  private static MATCH_DURATION = 3

  private playerHeroes: HeroInMatch[]
  private enemyHeroes: HeroInMatch[]

  private playerTeamInfo: TeamInfo
  private enemyTeamInfo: TeamInfo

  private arena: Arena
  private eventLog: MatchEvent[]
  private score: any = {}

  private playerSpawnLocations: number[][] = []
  private enemySpawnLocations: number[][] = []

  private matchTimer: number

  constructor(config: MatchManagerConfig) {
    this.playerHeroes = config.playerHeroes.map((h) => new HeroInMatch(h))
    this.enemyHeroes = config.enemyHeroes.map((h) => new HeroInMatch(h))
    this.arena = new Arena(this.playerHeroes, this.enemyHeroes)
    this.eventLog = []
    this.playerTeamInfo = config.playerTeamInfo
    this.enemyTeamInfo = config.enemyTeamInfo
    this.matchTimer = 0
  }

  // Do all initialization logic here
  public startMatch(): void {
    this.arena.initializeArena()
    this.playerSpawnLocations = this.arena.getPlayerHeroPositions()
    this.enemySpawnLocations = this.arena.getEnemyHeroPositions()
    this.score = {
      [this.playerTeamInfo.abbrev]: 0,
      [this.enemyTeamInfo.abbrev]: 0,
    }
    this.matchTimer = MatchManager.MATCH_DURATION
  }

  public getScore(): any {
    return this.score
  }

  public getArena(): any {
    return {
      map: this.arena.getMap(),
      rows: Arena.NUM_ROWS,
      cols: Arena.NUM_COLS,
    }
  }

  public highlightMoveableSquares(rows: number, cols: number) {
    const hero: HeroInMatch = this.arena.getHeroAtLocation(rows, cols)
    const range = hero.getMoveRange()
    let squaresInRange: number[][] = this.arena.getSquaresInRange(
      range,
      rows,
      cols
    )

    // Filter out the enemy starting locations, enemy locations
    const enemySpawnLocations = this.enemySpawnLocations.map(
      (loc: number[]) => `${loc[0]},${loc[1]}`
    )
    squaresInRange = squaresInRange.filter((coord: number[]) => {
      return (
        !enemySpawnLocations.includes(`${coord[0]},${coord[1]}`) &&
        !this.arena.getHeroAtLocation(coord[0], coord[1])
      )
    })

    this.arena.highlightSquares(squaresInRange, 'blue')
  }

  public isHeroAttackable(hero: HeroInMatch): boolean {
    return hero && !hero.isDead && !hero.isUntargetable()
  }

  public getHeroesInRange(row: number, col: number, range: number): any[] {
    const heroesInRange: any[] = []
    const squaresInRange = this.getSquaresWithinRange(row, col, range)
    squaresInRange.forEach((coord: number[]) => {
      const h = this.arena.getHeroAtLocation(coord[0], coord[1])
      if (this.isHeroAttackable(h)) {
        heroesInRange.push({
          coordinates: coord,
          hero: h,
        })
      }
    })
    return heroesInRange
  }

  public getHeroesInAttackRange(rows: number, cols: number): any[] {
    const hero: HeroInMatch = this.arena.getHeroAtLocation(rows, cols)
    const range = hero.getAttackRange()
    return this.getHeroesInRange(rows, cols, range)
  }

  public getHeroByHeroId = (heroId: string) => {
    const allHeroes = this.playerHeroes.concat(this.enemyHeroes)
    return allHeroes.find((h: HeroInMatch) => h.getHeroRef().heroId == heroId)
  }

  public highlightAttackableSquares(rows: number, cols: number) {
    const hero: HeroInMatch = this.arena.getHeroAtLocation(rows, cols)
    const range = hero.getAttackRange()
    const squaresToHighlight = this.arena.getSquaresInRange(range, rows, cols)
    this.arena.highlightSquares(squaresToHighlight, 'red')
  }

  public highlightSquaresWithinRange(
    rows: number,
    cols: number,
    range: number,
    color: string
  ) {
    const squaresToHighlight = this.arena.getSquaresInRange(range, rows, cols)
    this.arena.highlightSquares(squaresToHighlight, color)
  }

  public getSquaresWithinRange(rows: number, cols: number, range: number) {
    return this.arena.getSquaresInRange(range, rows, cols)
  }

  public getHighlightedSquares() {
    return this.arena.getHighlightedSquares()
  }

  public resetHighlightedSquares() {
    this.arena.resetSquareHighlight()
  }

  public moveHero({
    start,
    target,
  }: {
    start: { row: number; col: number }
    target: { row: number; col: number }
  }) {
    this.arena.moveHero(start, target)
  }

  public getPlayerHeroesInMatch(): HeroInMatch[] {
    return this.playerHeroes
  }

  public getEnemyHeroesInMatch(): HeroInMatch[] {
    return this.enemyHeroes
  }

  public playerScoreKill(killerId: string, targetId: string): void {
    this.score[this.playerTeamInfo.abbrev] += 2
    const killer: HeroInMatch | undefined = this.getHeroByHeroId(killerId)
    const target: HeroInMatch | undefined = this.getHeroByHeroId(targetId)
    if (killer && target) {
      killer.addKillToRecord()
      target.addDeathToRecord()
    }
  }

  public getPlayerScore() {
    return this.score[this.playerTeamInfo.abbrev]
  }

  public getPlayerTeamInfo(): TeamInfo {
    return this.playerTeamInfo
  }

  public enemyScoreKill(killerId: string, targetId: string): void {
    this.score[this.enemyTeamInfo.abbrev] += 2
    const killer: HeroInMatch | undefined = this.getHeroByHeroId(killerId)
    const target: HeroInMatch | undefined = this.getHeroByHeroId(targetId)
    if (killer && target) {
      killer.addKillToRecord()
      target.addDeathToRecord()
    }
  }

  public getEnemyScore() {
    return this.score[this.enemyTeamInfo.abbrev]
  }

  public getEnemyTeamInfo(): TeamInfo {
    return this.enemyTeamInfo
  }

  public getMVP(winnerTeamId: string): HeroInMatch {
    const winningHeroes =
      winnerTeamId === this.playerTeamInfo.teamId
        ? this.playerHeroes
        : this.enemyHeroes
    let heroWithBestStats = winningHeroes[0]

    const getTotalStats = (hero: HeroInMatch): number => {
      const heroStats: HeroStats = hero.getHeroStats()
      return heroStats.numKills + heroStats.numPoints - heroStats.numDeaths
    }

    winningHeroes.forEach((hero: HeroInMatch) => {
      const thisTotalStats = getTotalStats(hero)
      if (thisTotalStats > getTotalStats(heroWithBestStats)) {
        heroWithBestStats = hero
      }
    })
    return heroWithBestStats
  }

  public moveEnemyHeroes(): void {
    EnemyAIManager.moveEnemyHeroes(this.arena, this.playerSpawnLocations)
  }

  public doEnemyHeroAttacks(): any[] {
    return EnemyAIManager.doEnemyHeroAttacks(this.playerHeroes, this.arena)
  }

  public doEnemySkill(): any[] {
    return EnemyAIManager.doEnemySkills(
      this.playerHeroes,
      this.enemyHeroes,
      this.arena
    )
  }

  public tickRespawnTimer(side: string) {
    const heroes: HeroInMatch[] =
      side === 'enemy'
        ? this.getEnemyHeroesInMatch()
        : this.getPlayerHeroesInMatch()
    heroes.forEach((hero: HeroInMatch) => {
      if (hero.isDead) {
        hero.countdownRespawnTimer()
      }
    })
  }

  public tickUntargetTimer(side: string) {
    const heroes: HeroInMatch[] =
      side === 'enemy'
        ? this.getEnemyHeroesInMatch()
        : this.getPlayerHeroesInMatch()
    heroes.forEach((hero: HeroInMatch) => {
      if (!hero.isDead && hero.isUntargetable()) {
        hero.countdownUntargetTimer()
      }
    })
  }

  public isSpawnLocation(coordinates: string): boolean {
    const allSpawnLocations = this.playerSpawnLocations.concat(
      this.enemySpawnLocations
    )
    for (let i = 0; i < allSpawnLocations.length; i++) {
      const coord = allSpawnLocations[i]
      const stringified = `${coord[0]},${coord[1]}`
      if (stringified === coordinates) {
        return true
      }
    }
    return false
  }

  public getEmptySpawnLocation(
    spawnLocations: number[][],
    currLoc: number[]
  ): number[] {
    for (let i = 0; i < spawnLocations.length; i++) {
      const coord = spawnLocations[i]
      const hero: HeroInMatch | null = this.arena.getHeroAtLocation(
        coord[0],
        coord[1]
      )

      // If the hero was spawn killed, keep them at the current location
      if (!hero || (currLoc[0] === coord[0] && currLoc[1] === coord[1])) {
        return coord
      }
    }
    console.error('No empty spawn location found!')
    return [0, 0]
  }

  public haveAllPlayerHeroesMoved(): boolean {
    const playerHeroes: HeroInMatch[] = this.getPlayerHeroesInMatch()
    for (let i = 0; i < playerHeroes.length; i++) {
      const hero: HeroInMatch = playerHeroes[i]
      if (!hero.isDead && !hero.hasMoved) {
        return false
      }
    }
    return true
  }

  public resetPlayerMoves(): void {
    const playerHeroes: HeroInMatch[] = this.getPlayerHeroesInMatch()
    playerHeroes.forEach((h: HeroInMatch) => {
      h.hasMoved = false
    })
  }

  public respawnHero(hero: HeroInMatch, side: string) {
    // Set a respawn timer that ticks down every turn
    hero.setRespawnTimer()

    // Teleport the dead hero back to the starting squares
    const currHeroLocation = this.arena.getHeroLocation(
      hero.getHeroRef().heroId
    )
    const emptySpawnLocation =
      side === 'player'
        ? this.getEmptySpawnLocation(
            this.playerSpawnLocations,
            currHeroLocation
          )
        : this.getEmptySpawnLocation(this.enemySpawnLocations, currHeroLocation)
    const heroLocation: number[] = this.arena.getHeroLocation(
      hero.getHeroRef().heroId
    )
    this.arena.moveHero(
      {
        row: heroLocation[0],
        col: heroLocation[1],
      },
      {
        row: emptySpawnLocation[0],
        col: emptySpawnLocation[1],
      }
    )
  }

  public isGameOver(): boolean {
    return this.matchTimer === 0
  }

  public decrementMatchTimer() {
    this.matchTimer--
  }

  public getTurnsRemaining(): number {
    return this.matchTimer
  }
}
