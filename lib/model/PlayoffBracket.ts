import { Record } from './Record'
import { Team } from './Team'
import { chunk } from 'lodash'
import { MatchSimulator } from '../simulation/MatchSimulator'
import { SeasonManager } from '../SeasonManager'

export interface PlayoffMatchup {
  teamIds: string[]
  score: {
    [teamId: string]: number
  }
  winnerId?: string
  gameNumber: number
}

export class PlayoffBracket {
  public static WIN_THRESHOLD = 3 // first team to WIN_THRESHOLD moves to the next round
  private matchupList: PlayoffMatchup[]
  private playerTeamId: string
  private roundResults: any
  private currentRound: number
  private numTotalRounds: number
  private championId: string | null

  constructor(
    playoffTeams: Team[],
    teamRecords: { [teamId: string]: Record },
    playerTeam: Team
  ) {
    // There must always be an even number of playoff teams
    if (playoffTeams.length % 2 !== 0) {
      console.warn(
        'Warning! there must be an even number of playoff teams. Num playoff teams configured: ',
        playoffTeams.length
      )
    }

    this.playerTeamId = playerTeam.teamId
    const sortedTeams = playoffTeams.sort((a, b) => {
      return (
        teamRecords[b.teamId].getWinLossRatio() -
        teamRecords[a.teamId].getWinLossRatio()
      )
    })
    this.matchupList = this.generateMatchups(sortedTeams)
    const numRounds = Math.log2(sortedTeams.length)
    this.roundResults = {}
    for (let i = 0; i < numRounds; i++) {
      let matchups: PlayoffMatchup[] = []
      if (i == 0) matchups = this.matchupList
      this.roundResults[`round-${i + 1}`] = {
        matchups,
        roundNumber: i + 1,
      }
    }
    this.currentRound = 1
    this.numTotalRounds = numRounds
    this.championId = null
  }

  generateMatchups(playoffTeams: Team[]): PlayoffMatchup[] {
    const numPlayoffTeams = playoffTeams.length

    // The top seeds will match against the bottom seeds in reverse order (i.e. 1-8, 2-7, 3-6, ...)
    const topSeeds = playoffTeams.slice(0, numPlayoffTeams / 2)
    const bottomSeeds = playoffTeams.slice(numPlayoffTeams / 2).reverse()

    const matchupList: PlayoffMatchup[] = []
    topSeeds.forEach((team: Team, index: number) => {
      const opponent = bottomSeeds[index]
      matchupList.push({
        teamIds: [team.teamId, opponent.teamId],
        score: {
          [team.teamId]: 0,
          [opponent.teamId]: 0,
        },
        gameNumber: 1,
      })
    })
    return matchupList
  }

  getPlayerMatchup(): PlayoffMatchup | null {
    const matchup =
      this.matchupList.find((matchup) => {
        return matchup.teamIds.includes(this.playerTeamId)
      }) || null
    return matchup
  }

  updateScore(winnerId: string) {
    const matchup = this.matchupList.find((matchup) => {
      return Object.keys(matchup.score).includes(winnerId)
    })

    if (matchup) {
      matchup.score[winnerId]++

      // If the winner has won the required number of games to progress to the next round, add them to qualifiers
      if (matchup.score[winnerId] === PlayoffBracket.WIN_THRESHOLD) {
        matchup.winnerId = winnerId
        if (this.currentRound === this.numTotalRounds) {
          this.championId = winnerId
        }
      } else {
        matchup.gameNumber++
      }
    }
    this.roundResults[`round-${this.currentRound}`].matchups = [
      ...this.matchupList,
    ]
  }

  hasRoundFinished(): boolean {
    const numFinished = this.matchupList.reduce((acc, curr) => {
      if (curr.winnerId) {
        acc += 1
      }
      return acc
    }, 0)
    return numFinished === this.matchupList.length
  }

  goToNextRound(): void {
    if (this.currentRound < this.numTotalRounds) {
      const groupings = chunk(this.matchupList, 2)
      const newMatchupList: PlayoffMatchup[] = []
      groupings.forEach((group: PlayoffMatchup[]) => {
        const groupWinner1: string = group[0].winnerId as string
        const groupWinner2: string = group[1].winnerId as string
        newMatchupList.push({
          teamIds: [groupWinner1, groupWinner2],
          score: {
            [groupWinner1]: 0,
            [groupWinner2]: 0,
          },
          gameNumber: 1,
        })
      })
      this.currentRound++
      this.roundResults[`round-${this.currentRound}`].matchups = [
        ...newMatchupList,
      ]
      this.matchupList = newMatchupList
    }
  }

  getChampionId(): string | null {
    return this.championId
  }

  getMatchupList(): PlayoffMatchup[] {
    return this.matchupList
  }

  getRoundResults(): any[] {
    return this.roundResults
  }

  getRoundResultForRoundNum(roundNum: number): any {
    return this.roundResults[`round-${roundNum}`]
  }

  getNumTotalRounds(): number {
    return this.numTotalRounds
  }

  // Simulate all the matchups that don't involve the player
  simulateGames(seasonManager: SeasonManager) {
    this.matchupList.forEach((matchup) => {
      if (!matchup.teamIds.includes(this.playerTeamId)) {
        const team1Id = matchup.teamIds[0]
        const team2Id = matchup.teamIds[1]
        const team1 = seasonManager.getTeam(team1Id) as Team
        const team2 = seasonManager.getTeam(team2Id) as Team
        const matchOutcome = MatchSimulator.simulateMatchup(team1, team2)
        this.updateScore(matchOutcome.winnerId)
      }
    })
  }

  public serialize(): any {
    return {
      matchupList: this.matchupList,
      playerTeamId: this.playerTeamId,
      currentRound: this.currentRound,
      roundResults: this.roundResults,
      numTotalRounds: this.numTotalRounds,
    }
  }

  public deserialize(obj: any): any {
    this.matchupList = obj.matchupList
    this.playerTeamId = obj.playerTeamId
    this.roundResults = obj.roundResults
    this.currentRound = obj.currentRound
    this.numTotalRounds = obj.numTotalRounds
  }
}
