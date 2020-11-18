import { Team } from './Team'
import { shuffle } from 'lodash'

enum MatchResult {
  win = 'WIN',
  loss = 'LOSS',
}

class Matchup {
  public teamInfo: {
    name: string
    teamId: string
  }
  public matchResult: MatchResult | null = null
  public score: {
    playerPoints: number
    opponentPoints: number
  } | null = null

  constructor(teamInfo: any) {
    this.teamInfo = teamInfo
  }

  public static deserializeObj(obj: any): Matchup {
    const matchup: Matchup = new Matchup(obj.teamInfo)
    matchup.matchResult = obj.matchResult === null ? null : obj.matchResult
    matchup.score = obj.score
    return matchup
  }

  public serialize() {
    return {
      teamInfo: this.teamInfo,
      matchResult: this.matchResult !== null ? this.matchResult : null,
      score: this.score,
    }
  }
}

export class Schedule {
  private teamInfoList: {
    name: string
    teamId: string
  }[]

  private matchList: Matchup[]
  private static NUM_MATCHUPS_IN_SCHEDULE: number = 21
  private currentMatchupIndex: number

  constructor(config: {
    teams: Team[]
    currentMatchupIndex?: number
    matchList?: Matchup[]
  }) {
    const { teams, currentMatchupIndex, matchList } = config
    this.teamInfoList = teams.map((t: Team) => ({
      name: t.name,
      teamId: t.teamId,
    }))
    this.currentMatchupIndex = currentMatchupIndex || 0
    this.matchList = matchList || this.generateSchedule()
  }

  public getMatchupList(): Matchup[] {
    return this.matchList
  }

  public getCurrentMatch(): Matchup {
    return this.matchList[this.currentMatchupIndex]
  }

  public getCurrentMatchIndex(): number {
    return this.currentMatchupIndex
  }

  private generateSchedule(): Matchup[] {
    const numCycles = Math.ceil(
      Schedule.NUM_MATCHUPS_IN_SCHEDULE / this.teamInfoList.length
    )
    let allMatches: any[] = []
    const matchupOrder = shuffle(this.teamInfoList)
    for (let i = 0; i < numCycles; i++) {
      allMatches = allMatches.concat(matchupOrder)
    }
    const shuffledMatchups = allMatches.splice(
      0,
      Schedule.NUM_MATCHUPS_IN_SCHEDULE
    )
    return shuffledMatchups.map((m) => {
      return new Matchup(m)
    })
  }

  public advanceToNextMatch(): void {
    console.log(this.currentMatchupIndex)
    this.currentMatchupIndex++
  }

  static deserializeObj(scheduleObj: any, teams: Team[]): Schedule {
    const { matchList, currentMatchupIndex } = scheduleObj
    const dsMatchList = matchList.map((m: any) => {
      return Matchup.deserializeObj(m)
    })
    return new Schedule({ teams, matchList: dsMatchList, currentMatchupIndex })
  }

  public serialize() {
    return {
      matchList: this.matchList.map((m) => m.serialize()),
      currentMatchupIndex: this.currentMatchupIndex,
    }
  }
}
