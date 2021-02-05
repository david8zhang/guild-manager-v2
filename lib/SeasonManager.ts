import { Record } from './model/Record'
import { Team } from './model/Team'
import { Schedule } from './model/Schedule'
import { TeamGenerator } from './TeamGenerator'
import { Hero } from './model/Hero'
import { shuffle } from 'lodash'
import { TEAM_NAMES } from './constants/fullTeamNames'
import { HeroStats } from './model/HeroStats'
import { PlayoffBracket } from './model/PlayoffBracket'
import { MatchSimulator } from './simulation/MatchSimulator'
import { StatGainManager } from './StatGainManager'
import { DEBUG_CONFIG } from './constants/debugConfig'

export class SeasonManager {
  private static NUM_PLAYOFF_TEAMS = 4

  public seasonNumber: number = 1
  public numGamesInSeason: number = DEBUG_CONFIG.numGamesInSeason || 14
  public teamRecords: any = {}
  public teams: Team[] = []
  public playerTeam: Team
  public playerSeasonSchedule: Schedule
  public playoffBracket: any
  public isOffseason: boolean
  public matchResults: any[]

  constructor(playerObj: any, leagueObj: any) {
    this.playerTeam = Team.deserializeObj(playerObj)
    this.configureOtherTeams(leagueObj)

    // Set the player team's matchup schedule
    this.playerSeasonSchedule = playerObj.schedule
      ? Schedule.deserializeObj(playerObj.schedule, this.teams)
      : new Schedule({ teams: this.teams })

    // Build the mapping between teamIds and records
    this.teams.concat(this.playerTeam).forEach((t) => {
      this.teamRecords[t.teamId] = new Record()
    })
    this.playoffBracket = null
    this.isOffseason = false
    this.matchResults = []
  }

  public setPlayerTeam(playerTeam: Team) {
    this.playerTeam = playerTeam
  }

  public getPlayerSchedule(): Schedule {
    return this.playerSeasonSchedule
  }

  public getTeamRecord(teamId: string) {
    return this.teamRecords[teamId]
  }

  public getMatchResults() {
    return this.matchResults
  }

  public getMatchResultAtIndex(index: number) {
    if (index >= this.matchResults.length) {
      return null
    }
    return this.matchResults[index]
  }

  public addMatchResult(matchResult: {
    playerScore: number
    enemyScore: number
    enemyTeamId: string
    isHome: boolean
  }): void {
    this.matchResults.push(matchResult)
  }

  public applyStatIncreases(
    teamId: string,
    statIncreases: { [heroId: string]: any }
  ): void {
    const team: Team = this.getTeam(teamId) as Team

    const roster = team.roster
    roster.forEach((hero: Hero) => {
      const increasePayload = statIncreases[hero.heroId]
      if (increasePayload) {
        const { statToIncrease, amountToIncrease } = increasePayload
        hero.improveStats(statToIncrease, amountToIncrease)
      }

      // If the hero had gains in multiple different stats
      if (Array.isArray(increasePayload)) {
        increasePayload.forEach((payload) => {
          const { statToIncrease, amountToIncrease } = payload
          hero.improveStats(statToIncrease, amountToIncrease)
        })
      }
    })
  }

  public updateTeamRecord(teamId: string, didWin: boolean) {
    const record: Record = this.teamRecords[teamId]
    if (didWin) {
      record.addWin()
    } else {
      record.addLoss()
    }
  }

  // provide the enemy team id that player just fought so that it can be excluded from simulation
  public simulateMatchesAndUpdateRecords(enemyTeamId: string): void {
    const allTeams = this.getAllTeams()
    const teamToSimulateIds: string[] = []
    allTeams.forEach((team: Team) => {
      if (
        team.teamId !== enemyTeamId &&
        team.teamId !== this.playerTeam.teamId
      ) {
        teamToSimulateIds.push(team.teamId)
      }
    })

    // create randomized matchups between all other teams
    const shuffledTeamIds = shuffle(teamToSimulateIds)
    const partition = (arr: any[], size: number) => {
      const result: any[] = []
      while (arr.length > 0) {
        result.push(arr.splice(0, size))
      }
      return result
    }
    const matchups = partition(shuffledTeamIds, 2)

    // Simulate matchups
    matchups.forEach((matchup: string[]) => {
      const team1: Team | null = this.getTeam(matchup[0])
      const team2: Team | null = this.getTeam(matchup[1])

      if (team1 && team2) {
        const matchOutcome = MatchSimulator.simulateMatchup(team1, team2)
        const team1Record = this.getTeamRecord(team1.teamId)
        const team2Record = this.getTeamRecord(team2.teamId)
        if (matchOutcome.winnerId === team1.teamId) {
          team1Record.addWin()
          team2Record.addLoss()
        } else {
          team2Record.addWin()
          team1Record.addLoss()
        }

        const { statIncreases } = matchOutcome
        this.applyStatIncreases(team1.teamId, statIncreases[team1.teamId])
        this.applyStatIncreases(team2.teamId, statIncreases[team2.teamId])
      }
    })
  }

  public getPlayer(): Team {
    return this.playerTeam
  }

  public getTeam(teamId: string): Team | null {
    const team = this.teams
      .concat(this.playerTeam)
      .find((t) => t.teamId === teamId)
    if (!team) {
      return null
    }
    return team
  }

  public getHeroRosters(
    enemyTeamId: string
  ): { playerHeroes: Hero[]; enemyHeroes: Hero[] } {
    return {
      playerHeroes: this.playerTeam.roster,
      enemyHeroes: (this.getTeam(enemyTeamId) as Team).roster,
    }
  }

  public getStarters(enemyTeamId: string) {
    const enemyTeam = this.getTeam(enemyTeamId) as Team
    const playerStarterIds = this.playerTeam.starterIds
    const enemyStarterIds = enemyTeam.starterIds

    return {
      playerHeroes: this.playerTeam.roster.filter((h: Hero) =>
        playerStarterIds.includes(h.heroId)
      ),
      enemyHeroes: enemyTeam.roster.filter((h: Hero) =>
        enemyStarterIds.includes(h.heroId)
      ),
    }
  }

  public getAllTeams(): Team[] {
    const allTeams = [...this.teams, this.playerTeam]
    return allTeams.sort((a, b) => {
      return (
        this.teamRecords[b.teamId].getWinLossRatio() -
        this.teamRecords[a.teamId].getWinLossRatio()
      )
    })
  }

  public didPlayerMakePlayoffs(): boolean {
    const playoffTeams = this.getAllTeams().slice(0, 4)
    return (
      playoffTeams.find((a) => a.teamId === this.playerTeam.teamId) !==
      undefined
    )
  }

  public serialize() {
    const serializedTeamRecords: any = {}
    Object.keys(this.teamRecords).forEach((key: string) => {
      const record: Record = this.teamRecords[key]
      serializedTeamRecords[key] = record.serialize()
    })
    return {
      seasonNumber: this.seasonNumber,
      schedule: this.playerSeasonSchedule.serialize(),
      teamRecords: serializedTeamRecords,
      playoffBracket: this.playoffBracket
        ? this.playoffBracket.serialize()
        : null,
      isOffseason: this.isOffseason,
      matchResults: this.matchResults,
    }
  }

  public createPlayoffBracket(): PlayoffBracket {
    const playoffTeams = this.getAllTeams().slice(
      0,
      SeasonManager.NUM_PLAYOFF_TEAMS
    )
    this.playoffBracket = new PlayoffBracket(
      playoffTeams,
      this.teamRecords,
      this.playerTeam
    )
    return this.playoffBracket
  }

  public getPlayoffBracket(): PlayoffBracket {
    return this.playoffBracket
  }

  public configureOtherTeams(serializedLeagueObj: any) {
    if (!serializedLeagueObj) {
      this.teams = TeamGenerator.generateRandomTeams({
        numTeams: TEAM_NAMES.length - 1,
        playerTeam: this.playerTeam,
      })
    } else {
      this.teams = serializedLeagueObj.map((team: any) =>
        Team.deserializeObj(team)
      )
    }
  }

  // Reconstruct the season manager state from a serialized object
  public deserialize(serializedSeasonObj: any) {
    const {
      schedule,
      teamRecords,
      playoffBracket,
      isOffseason,
      seasonNumber,
      matchResults,
    } = serializedSeasonObj
    this.seasonNumber = parseInt(seasonNumber)
    this.playerSeasonSchedule = Schedule.deserializeObj(schedule, this.teams)
    this.teamRecords = {}
    this.matchResults = matchResults
    Object.keys(teamRecords).forEach((key: string) => {
      this.teamRecords[key] = Record.deserializeObj(teamRecords[key])
    })
    this.isOffseason = isOffseason
    if (playoffBracket) {
      const playoffTeams = this.getAllTeams().slice(
        0,
        SeasonManager.NUM_PLAYOFF_TEAMS
      )
      this.playoffBracket = new PlayoffBracket(
        playoffTeams,
        this.teamRecords,
        this.playerTeam
      )
      ;(this.playoffBracket as PlayoffBracket).deserialize(playoffBracket)
    }
  }

  public getSerializedNonPlayerTeams(): any[] {
    return this.teams
      .filter((team: Team) => team.teamId !== this.playerTeam.teamId)
      .map((team: Team) => team.serialize())
  }

  public saveHeroMatchStats(heroMatchStats: {
    [heroId: string]: HeroStats
  }): void {
    const playerStarterHeroes = this.playerTeam.getStarters()
    playerStarterHeroes.forEach((hero: Hero) => {
      const heroStats = heroMatchStats[hero.heroId]
      hero.savePostMatchStats(heroStats)
    })
  }

  public restartSeason() {
    this.playoffBracket = null
    this.isOffseason = false
    this.playerSeasonSchedule.resetSeason()
    Object.keys(this.teamRecords).forEach((key: string) => {
      this.teamRecords[key] = new Record()
    })
  }

  // Officially end the season, all contract logic should also go through here
  public startOffseason() {
    this.seasonNumber += 1
    this.playoffBracket = null
    this.isOffseason = true
    this.matchResults = []
  }

  public getIsOffseason() {
    return this.isOffseason
  }

  // Maybe need to move this to its own manager (Offseason manager) at some point
  public static getPlayerTeamAverageStat(stat: string, heroes: Hero[]) {
    const statAvg =
      heroes.reduce((acc: number, curr: Hero) => {
        return acc + curr.getStat(stat.toLowerCase())
      }, 0) / heroes.length
    return Math.round(statAvg)
  }

  // Whenever the player heroes win a championship, increment their championship counter
  public addRingsToPlayerHeroes(): void {
    this.playerTeam.getStarters().forEach((h: Hero) => {
      h.numRings += 1
    })
  }

  // Train a set of specific stats
  public trainStats(
    statsToTrain: string[],
    heroesToTrain: Hero[]
  ): { trainingResult: any; statIncreases: any } {
    const statIncreases: any = {}
    const statTrainingResult: any = {}

    statsToTrain
      .map((s) => s.toLowerCase())
      .forEach((stat: string) => {
        if (!statTrainingResult[stat]) statTrainingResult[stat] = []
        heroesToTrain.forEach((hero: Hero) => {
          const amountToIncrease = StatGainManager.statIncreaseAmount(
            hero.potential,
            stat,
            [3, 5, 7]
          )
          if (!statIncreases[hero.heroId]) statIncreases[hero.heroId] = []
          statIncreases[hero.heroId].push({
            statToIncrease: stat,
            amountToIncrease,
          })
          statTrainingResult[stat].push({
            heroId: hero.heroId,
            amountToIncrease,
          })
        })
      })
    return {
      trainingResult: statTrainingResult,
      statIncreases,
    }
  }
}
