import { Record } from './model/Record'
import { Team } from './model/Team'
import { Schedule } from './model/Schedule'
import { TeamGenerator } from './TeamGenerator'
import { Hero } from './model/Hero'
import { shuffle } from 'lodash'
import { TEAM_NAMES } from './constants/fullTeamNames'
import { HeroStats } from './model/HeroStats'

export class SeasonManager {
  public numGamesInSeason: number = 21
  public teamRecords: any = {}
  public teams: Team[] = []
  public playerTeam: Team
  public playerSeasonSchedule: Schedule

  constructor(playerObj: any) {
    this.playerTeam = Team.deserializeObj(playerObj)
    this.teams = playerObj.league
      ? playerObj.league.map((t: Team) => Team.deserializeObj(t))
      : TeamGenerator.generateRandomTeams({
          numTeams: TEAM_NAMES.length - 1,
          playerTeam: this.playerTeam,
        })

    // Set the player team's matchup schedule
    this.playerSeasonSchedule = playerObj.schedule
      ? Schedule.deserializeObj(playerObj.schedule, this.teams)
      : new Schedule({ teams: this.teams })

    // Build the mapping between teamIds and records
    this.teams.concat(this.playerTeam).forEach((t) => {
      this.teamRecords[t.teamId] = new Record()
    })
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

  public applyStatIncreases(statIncreases: { [heroId: string]: any }): void {
    const playerRoster = this.playerTeam.roster
    playerRoster.forEach((hero: Hero) => {
      const increasePayload = statIncreases[hero.heroId]
      if (increasePayload) {
        const { statToIncrease, amountToIncrease } = increasePayload
        hero.improveStats(statToIncrease, amountToIncrease)
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

      let team1WinPercentage: number = 50
      if (team1 && team2) {
        // win percentage will differ by OVR difference * 2
        const team1AvgOvr = this.getAverageTeamOverall(team1)
        const team2AvgOvr = this.getAverageTeamOverall(team2)
        const ovrDiff = team1AvgOvr - team2AvgOvr
        team1WinPercentage + ovrDiff * 2

        // Generate a random number between 1 and 100. If the number is <= team1's win percentage, then team1 has won.
        const outcomeNum = Math.floor(Math.random() * 100) + 1
        const team1Record = this.getTeamRecord(team1.teamId)
        const team2Record = this.getTeamRecord(team2.teamId)
        if (outcomeNum <= team1WinPercentage) {
          team1Record.addWin()
          team2Record.addLoss()
        } else {
          team2Record.addWin()
          team1Record.addLoss()
        }
      }
    })
  }

  private getAverageTeamOverall(team: Team): number {
    const teamRoster = team.roster
    const avgOverall = Math.round(
      teamRoster.reduce((acc: number, curr: Hero) => {
        acc += curr.getOverall()
        return acc
      }, 0) / team.roster.length
    )
    return avgOverall
  }

  public getPlayer(): Team {
    return this.playerTeam
  }

  public getTeam(teamId: string): Team | null {
    const team = this.teams.find((t) => t.teamId === teamId)
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

  public serialize() {
    const serializedTeamRecords: any = {}
    Object.keys(this.teamRecords).forEach((key: string) => {
      const record: Record = this.teamRecords[key]
      serializedTeamRecords[key] = record.serialize()
    })
    return {
      teams: this.teams.map((t) => t.serialize()),
      schedule: this.playerSeasonSchedule.serialize(),
      teamRecords: serializedTeamRecords,
      playerTeam: this.playerTeam.serialize(),
    }
  }

  // Reconstruct the season manager state from a serialized object
  public deserialize(serializedSeasonObj: any) {
    const { teams, schedule, teamRecords, playerTeam } = serializedSeasonObj
    this.teams = teams.map((t: any) => Team.deserializeObj(t))
    this.playerSeasonSchedule = Schedule.deserializeObj(schedule, this.teams)
    this.teamRecords = {}
    Object.keys(teamRecords).forEach((key: string) => {
      this.teamRecords[key] = Record.deserializeObj(teamRecords[key])
    })
    this.playerTeam = Team.deserializeObj(serializedSeasonObj.playerTeam)
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
}
