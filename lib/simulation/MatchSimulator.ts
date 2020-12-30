import { Hero } from '../model/Hero'
import { Team } from '../model/Team'

// Match outcome can be extended to also include things like hero stats, etc.
interface MatchOutcome {
  winnerId: string
}

export class MatchSimulator {
  // Simulate a matchup and return the outcome
  static simulateMatchup(team1: Team, team2: Team): MatchOutcome {
    let team1WinPercentage: number = 50

    // win percentage will differ by OVR difference * 3
    const team1AvgOvr = this.getAverageTeamOverall(team1)
    const team2AvgOvr = this.getAverageTeamOverall(team2)
    const ovrDiff = team1AvgOvr - team2AvgOvr
    team1WinPercentage + ovrDiff * 2.5

    // Generate a random number between 1 and 100. If the number is <= team1's win percentage, then team1 has won.
    const outcomeNum = Math.floor(Math.random() * 100) + 1
    if (outcomeNum <= team1WinPercentage) {
      return {
        winnerId: team1.teamId,
      }
    } else {
      return {
        winnerId: team2.teamId,
      }
    }
  }

  static getAverageTeamOverall(team: Team) {
    const teamRoster = team.getStarters()
    const avgOverall = Math.round(
      teamRoster.reduce((acc: number, curr: Hero) => {
        acc += curr.getOverall()
        return acc
      }, 0) / team.roster.length
    )
    return avgOverall
  }
}
