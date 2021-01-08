import { DEBUG_CONFIG } from './constants/debugConfig'
import { HeroStats } from './model/HeroStats'
import { EnemyAIManager } from './EnemyAIManager'
import { Arena } from './model/Arena'
import { Hero } from './model/Hero'
import { HeroInMatch } from './model/HeroInMatch'
import { MatchEvent } from './model/MatchEvent'
import { Team } from './model/Team'
import { StatGainManager } from './StatGainManager'
import { PowerUp } from './powerup/Powerup'
import { PowerUpFactory } from './powerup/PowerUpFactory'

interface TeamInfo {
  name: string
  abbrev: string
  teamId: string
  color: string
}

export interface MatchManagerConfig {
  playerTeam: Team
  enemyTeam: Team
}

export class MatchManager {
  public static MATCH_DURATION = DEBUG_CONFIG.numTurnsInMatch || 10
  public static NUM_POWERUPS = DEBUG_CONFIG.numPowerups || 3

  private playerHeroes: HeroInMatch[] = []
  private enemyHeroes: HeroInMatch[] = []

  private playerTeamInfo: TeamInfo
  private enemyTeamInfo: TeamInfo
  private fullPlayerTeam: Team
  private fullEnemyTeam: Team

  private arena: Arena
  private eventLog: MatchEvent[]
  private score: any = {}

  private playerSpawnLocations: number[][] = []
  private enemySpawnLocations: number[][] = []

  private matchTimer: number
  private enemyAIManager: any
  private statGainManager: any
  private isOvertime: boolean

  private powerUpFactory: PowerUpFactory
  private powerUps: {
    [coord: string]: PowerUp
  } = {}

  constructor(config: MatchManagerConfig) {
    this.eventLog = []
    this.playerTeamInfo = {
      teamId: config.playerTeam.teamId,
      name: config.playerTeam.name,
      abbrev: config.playerTeam.getNameAbbrev(),
      color: config.playerTeam.color,
    }
    this.enemyTeamInfo = {
      teamId: config.enemyTeam.teamId,
      name: config.enemyTeam.name,
      abbrev: config.enemyTeam.getNameAbbrev(),
      color: config.enemyTeam.color,
    }
    this.fullPlayerTeam = config.playerTeam
    this.fullEnemyTeam = config.enemyTeam
    this.matchTimer = 0
    this.isOvertime = false
    this.arena = new Arena(this.playerHeroes, this.enemyHeroes)
    this.enemyAIManager = null
    this.statGainManager = null
    this.powerUps = {}
    this.powerUpFactory = new PowerUpFactory()
  }

  // Do all initialization logic here
  public startMatch(): void {
    const playerHeroes = this.fullPlayerTeam
      .getStarters()
      .map((h: Hero) => new HeroInMatch(h))
    const enemyHeroes = this.fullEnemyTeam
      .getStarters()
      .map((h: Hero) => new HeroInMatch(h))

    this.playerHeroes = playerHeroes
    this.enemyHeroes = enemyHeroes
    this.arena = new Arena(playerHeroes, enemyHeroes)
    this.isOvertime = false

    this.arena.initializeArena()
    this.playerSpawnLocations = this.arena.getPlayerHeroPositions()
    this.enemySpawnLocations = this.arena.getEnemyHeroPositions()
    this.score = {
      [this.playerTeamInfo.abbrev]: 0,
      [this.enemyTeamInfo.abbrev]: 0,
    }
    this.matchTimer = MatchManager.MATCH_DURATION
    this.enemyAIManager = new EnemyAIManager({
      playerSpawnLocations: this.playerSpawnLocations,
      playerHeroes: this.playerHeroes,
      enemyHeroes: this.enemyHeroes,
      arena: this.arena,
    })
    this.statGainManager = new StatGainManager({
      playerHeroTeam: this.playerHeroes,
    })

    this.distributePowerUps()
  }

  public distributePowerUps(): void {
    const emptyLocations = this.arena.getRandomEmptyLocations(
      MatchManager.NUM_POWERUPS
    )
    emptyLocations.forEach((location) => {
      const coordKey = `${location[0]},${location[1]}`
      const powerUp = this.powerUpFactory.generateRandomPowerup()
      this.powerUps[coordKey] = powerUp
    })
  }

  public spawnNewPowerUp() {
    const emptyLocations = this.arena
      .getRandomEmptyLocations(1)
      .filter((location) => {
        const coordKey = `${location[0]},${location[1]}`
        return !this.powerUps[coordKey]
      })
    const location = emptyLocations[0]
    const newPowerUp = this.powerUpFactory.generateRandomPowerup()
    const coordKey = `${location[0]},${location[1]}`
    this.powerUps[coordKey] = newPowerUp
  }

  public getPowerUps() {
    return this.powerUps
  }

  public getAllHeroLocations(): number[][] {
    const allPositions = this.arena
      .getPlayerHeroPositions()
      .concat(this.arena.getEnemyHeroPositions())
    return allPositions
  }

  public getHeroTeam(hero: HeroInMatch): Team {
    for (let i = 0; i < this.fullPlayerTeam.roster.length; i++) {
      if (this.fullPlayerTeam.roster[i].heroId === hero.getHeroRef().heroId) {
        return this.fullPlayerTeam
      }
    }
    return this.fullEnemyTeam
  }

  public getScore(): any {
    return this.score
  }

  public getArena(): any {
    return {
      map: this.arena.getMap(),
      rows: Arena.NUM_ROWS,
      cols: Arena.NUM_COLS,
      tileMap: this.arena.tileMap,
    }
  }

  public getFullArena(): Arena {
    return this.arena
  }

  public canTargetRetaliate(
    targetHero: HeroInMatch,
    attackerHero: HeroInMatch
  ): boolean {
    if (targetHero.isDead) {
      return false
    }

    // Check if the attacker is within the target's range. If not, then do nothing
    const targetHeroPosition = this.arena.getHeroLocation(
      targetHero.getHeroRef().heroId
    )
    const targetHeroRange = targetHero.getAttackRange()
    const attackableSquares = this.arena.getSquaresInRange(
      targetHeroRange,
      targetHeroPosition[0],
      targetHeroPosition[1]
    )
    for (let i = 0; i < attackableSquares.length; i++) {
      const pos = attackableSquares[i]
      const hero = this.arena.getHeroAtLocation(pos[0], pos[1])
      if (
        hero &&
        hero.getHeroRef().heroId === attackerHero.getHeroRef().heroId
      ) {
        return true
      }
    }
    return false
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

  public setNextEnemyHeroBehavior(): void {
    return (this.enemyAIManager as EnemyAIManager).setNextHeroBehavior()
  }

  public moveNextEnemyHero(): any {
    return (this.enemyAIManager as EnemyAIManager).moveNextEnemyHero()
  }

  public doEnemyActionAfterMove(): any {
    return (this.enemyAIManager as EnemyAIManager).doActionAfterMove()
  }

  public haveAllEnemyHeroesMoved(): boolean {
    return (this.enemyAIManager as EnemyAIManager).haveAllHeroesMoved
  }

  // Do any actions that trigger after the turn is finished
  public postTurnActions(side: string) {
    const heroes: HeroInMatch[] =
      side === 'enemy'
        ? this.getEnemyHeroesInMatch()
        : this.getPlayerHeroesInMatch()

    heroes.forEach((hero: HeroInMatch) => {
      if (!hero.isDead && hero.isUntargetable()) {
        hero.countdownUntargetTimer()
      } else if (hero.isDead) {
        hero.countdownRespawnTimer()
      }
      hero.tickBuffTimer()
    })
  }

  public postEnemyTurnActions() {
    ;(this.enemyAIManager as EnemyAIManager).resetEnemyMoves()
    this.postTurnActions('enemy')
  }

  public postPlayerTurnActions() {
    this.postTurnActions('player')
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

  public isPlayerSpawnLocation(coordinates: string): boolean {
    for (let i = 0; i < this.playerSpawnLocations.length; i++) {
      const coord = this.playerSpawnLocations[i]
      const stringified = `${coord[0]},${coord[1]}`
      if (stringified === coordinates) {
        return true
      }
    }
    return false
  }

  public isEnemySpawnLocation(coordinates: string): boolean {
    for (let i = 0; i < this.enemySpawnLocations.length; i++) {
      const coord = this.enemySpawnLocations[i]
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
    // check if there is a tie, if so, then add 5 turns to the match timer for "overtime"
    if (this.matchTimer === 0) {
      const keys = Object.keys(this.score)
      const teamAbbrev1 = keys[0]
      const teamAbbrev2 = keys[1]
      const isTie = this.score[teamAbbrev1] === this.score[teamAbbrev2]
      if (isTie && !DEBUG_CONFIG.disableOvertime) {
        this.matchTimer += 5
        this.isOvertime = true
        return false
      } else {
        return true
      }
    } else {
      return false
    }
  }

  public getIsOvertime() {
    return this.isOvertime
  }

  public decrementMatchTimer() {
    this.matchTimer--
  }

  public getTurnsRemaining(): number {
    return this.matchTimer
  }

  public getStatIncreases(
    heroes: HeroInMatch[],
    mvpId: string
  ): {
    [heroId: string]: any
  } {
    return (this.statGainManager as StatGainManager).getStatGains(mvpId, heroes)
  }

  public getHeroMatchStats() {
    const heroMatchStats: any = {}
    this.enemyHeroes.forEach((hero: HeroInMatch) => {
      heroMatchStats[hero.getHeroRef().heroId] = hero.getHeroStats()
    })
    this.playerHeroes.forEach((hero: HeroInMatch) => {
      heroMatchStats[hero.getHeroRef().heroId] = hero.getHeroStats()
    })
    return heroMatchStats
  }
}
