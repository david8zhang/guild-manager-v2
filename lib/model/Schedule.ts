import { Team } from './Team'
import { shuffle } from 'lodash'
import { DEBUG_CONFIG } from '../constants/debugConfig'

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

  public isHome: boolean

  constructor(teamInfo: any) {
    this.teamInfo = teamInfo
    this.isHome = Math.floor(Math.random() * 2) == 1
  }

  public static deserializeObj(obj: any): Matchup {
    const matchup: Matchup = new Matchup(obj.teamInfo)
    matchup.matchResult = obj.matchResult === null ? null : obj.matchResult
    matchup.score = obj.score
    matchup.isHome = obj.isHome
    return matchup
  }

  public serialize() {
    return {
      teamInfo: this.teamInfo,
      matchResult: this.matchResult !== null ? this.matchResult : null,
      score: this.score,
      isHome: this.isHome,
    }
  }
}

export class Schedule {
  private teamInfoList: {
    name: string
    teamId: string
  }[]

  private matchList: Matchup[]
  private static NUM_MATCHUPS_IN_SCHEDULE: number =
    DEBUG_CONFIG.numGamesInSeason || 21
  private currentMatchupIndex: number

  private isRegularSeason: boolean

  constructor(config: {
    teams: Team[]
    currentMatchupIndex?: number
    matchList?: Matchup[]
    isRegularSeason?: boolean
  }) {
    const { teams, currentMatchupIndex, matchList, isRegularSeason } = config
    this.teamInfoList = teams.map((t: Team) => ({
      name: t.name,
      teamId: t.teamId,
    }))
    this.currentMatchupIndex = currentMatchupIndex || 0
    this.matchList = matchList || this.generateSchedule()
    this.isRegularSeason = isRegularSeason || true
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

  public resetSeason(): void {
    this.matchList = this.generateSchedule()
    this.currentMatchupIndex = 0
    this.isRegularSeason = true
  }

  public advanceToNextMatch(): void {
    if (this.currentMatchupIndex < this.matchList.length - 1) {
      this.currentMatchupIndex++
    } else {
      this.isRegularSeason = false
    }
  }

  public getCurrentMatchupIndex(): number {
    return this.currentMatchupIndex
  }

  static deserializeObj(scheduleObj: any, teams: Team[]): Schedule {
    const { matchList, currentMatchupIndex, isRegularSeason } = scheduleObj
    const dsMatchList = matchList.map((m: any) => {
      return Matchup.deserializeObj(m)
    })
    return new Schedule({
      teams,
      matchList: dsMatchList,
      currentMatchupIndex,
      isRegularSeason,
    })
  }

  public serialize() {
    return {
      matchList: this.matchList.map((m) => m.serialize()),
      currentMatchupIndex: this.currentMatchupIndex,
      isRegularSeason: this.isRegularSeason,
    }
  }

  public getIsRegularSeason(): boolean {
    return this.isRegularSeason
  }
}
