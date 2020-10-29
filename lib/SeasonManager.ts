import { Record } from './model/Record'
import { Team } from './model/Team'
import { Schedule } from './model/Schedule'
import { shuffle } from 'lodash'
import { TeamGenerator } from './TeamGenerator'
import { NAME_POOL } from './constants/teamNames'
import { HOME_CITIES } from './constants/homeCities'
import { Hero } from './model/Hero'

export class SeasonManager {
  public numGamesInSeason: number = 21
  public teamRecords: any = {}
  public teams: Team[] = []
  public playerTeam: Team
  public playerSeasonSchedule: Schedule

  constructor(playerObj: any) {
    this.teams = playerObj.league
      ? playerObj.league.map((t: Team) => Team.deserializeObj(t))
      : TeamGenerator.generateRandomTeams({
          numTeams: 7,
          namePool: NAME_POOL,
          homeCityPool: HOME_CITIES,
          playerHomeCity: playerObj.homeCity,
        })
    this.playerTeam = Team.deserializeObj(playerObj)

    // Set the player team's matchup schedule
    this.playerSeasonSchedule = playerObj.schedule
      ? Schedule.deserializeObj(playerObj.schedule, this.teams)
      : new Schedule({ teams: this.teams })

    // Build the mapping between teamIds and records
    this.teams.concat(this.playerTeam).forEach((t) => {
      this.teamRecords[t.teamId] = new Record()
    })
  }

  public getPlayerSchedule(): Schedule {
    return this.playerSeasonSchedule
  }

  public getTeamRecord(teamId: string) {
    return this.teamRecords[teamId]
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
    return {
      teams: this.teams.map((t) => t.serialize()),
      schedule: this.playerSeasonSchedule.serialize(),
    }
  }
}
