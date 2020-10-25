import { Record } from './model/Record'
import { Team } from './model/Team'

export class SeasonManager {
  public teamRecords: any = {}
  public teams: Team[] = []
  public playerTeam: Team

  constructor(teams: any[], playerTeamObj: any) {
    this.teams = teams.map((t: Team) => Team.deserializeObj(t))
    this.playerTeam = Team.deserializeObj(playerTeamObj)
  }

  public getTeamRecord(teamId: string): Record {
    return this.teamRecords[teamId]
  }

  public getAllTeams(): Team[] {
    return [...this.teams, this.playerTeam]
  }

  public getPlayerMatchupSchedule(): Team[] {
    return []
  }
}
