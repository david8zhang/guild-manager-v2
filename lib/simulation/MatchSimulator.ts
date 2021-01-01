import { ActionTypes } from '../enemyAI/CPUBehavior'
import { CPUHero } from '../enemyAI/CPUHero'
import { EnemyAIManager } from '../EnemyAIManager'
import { MatchManager } from '../MatchManager'
import { Arena } from '../model/Arena'
import { Hero } from '../model/Hero'
import { HeroInMatch } from '../model/HeroInMatch'
import { Team } from '../model/Team'
import { Move } from '../moves/Move'

// Match outcome can be extended to also include things like hero stats, etc.
interface MatchOutcome {
  winnerId: string
}

export class MatchSimulator {
  static initializeAI(
    thisHeroes: HeroInMatch[],
    otherHeroes: HeroInMatch[],
    arena: Arena,
    enemySpawnLocations: number[][]
  ): EnemyAIManager {
    const team1AIConfig = {
      playerSpawnLocations: enemySpawnLocations,
      arena,
      enemyHeroes: thisHeroes,
      playerHeroes: otherHeroes,
    }
    return new EnemyAIManager(team1AIConfig)
  }

  // Simulate a matchup and return the outcome
  static simulateMatchup(team1: Team, team2: Team): MatchOutcome {
    const heroes1 = team1
      .getStarters()
      .map((hero: Hero) => new HeroInMatch(hero))
    const heroes2 = team2
      .getStarters()
      .map((hero: Hero) => new HeroInMatch(hero))
    const arena: Arena = new Arena(heroes1, heroes2)
    arena.initializeArena()

    const team1SpawnLocations = arena.getPlayerHeroPositions()
    const team2SpawnLocations = arena.getEnemyHeroPositions()
    const team1AI = this.initializeAI(
      heroes1,
      heroes2,
      arena,
      team2SpawnLocations
    )
    const team2AI = this.initializeAI(
      heroes2,
      heroes1,
      arena,
      team1SpawnLocations
    )

    const score = {
      [team1.name]: 0,
      [team2.name]: 0,
    }

    // Respawn function
    const respawnHero = (hero: HeroInMatch, side: number) => {
      hero.setRespawnTimer()
      const currHeroLocation = arena.getHeroLocation(hero.getHeroRef().heroId)
      const emptySpawnLocation =
        side === 1
          ? this.getEmptySpawnLocation(
              arena,
              team1SpawnLocations,
              currHeroLocation
            )
          : this.getEmptySpawnLocation(
              arena,
              team2SpawnLocations,
              currHeroLocation
            )
      const heroLocation: number[] = arena.getHeroLocation(
        hero.getHeroRef().heroId
      )
      arena.moveHero(
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

    // Process turn by turn
    let currTurn = 0
    while (currTurn < MatchManager.MATCH_DURATION) {
      currTurn++
      this.processTurn(
        heroes1,
        team1AI,
        respawnHero,
        score,
        team1.name,
        team2.name
      )
      this.processTurn(
        heroes2,
        team2AI,
        respawnHero,
        score,
        team2.name,
        team1.name
      )
    }

    if (score[team1.name] > score[team2.name]) {
      return {
        winnerId: team1.teamId,
      }
    } else {
      return {
        winnerId: team2.teamId,
      }
    }
  }

  static processTurn(
    currHeroes: HeroInMatch[],
    thisTeamAI: EnemyAIManager,
    respawnHero: Function,
    score: any,
    thisTeamName: string,
    otherTeamName: string
  ) {
    while (!thisTeamAI.haveAllHeroesMoved) {
      thisTeamAI.getNextHero().selectBehavior()
      thisTeamAI.moveNextEnemyHero()
      const actionResult = thisTeamAI.doActionAfterMove()
      if (actionResult) {
        // Process one hero attacking another
        if (actionResult.actionType == ActionTypes.ATTACK) {
          const target = actionResult.target as HeroInMatch
          const user = actionResult.user as HeroInMatch

          // User attacks
          user.attack(target)
          if (target.isDead) {
            user.addKillToRecord()
            target.addDeathToRecord()
            respawnHero(target, 2)
            score[thisTeamName] += 2
          } else {
            // Target retaliates if possible
            target.attack(user)
            if (user.isDead) {
              target.addKillToRecord()
              user.addDeathToRecord()
              respawnHero(user, 1)
              score[otherTeamName] += 2
            }
          }
        }

        // Process one hero using a skill on another
        if (actionResult.actionType == ActionTypes.SKILL) {
          const target = actionResult.target as HeroInMatch
          const user = actionResult.user as HeroInMatch
          if (actionResult.data) {
            const move = actionResult.data.move as Move
            move.processMove(user, target)
          }
        }
      }
    }

    // Do post turn actions here
    thisTeamAI.resetEnemyMoves()
    currHeroes.forEach((hero: HeroInMatch) => {
      if (!hero.isDead && hero.isUntargetable()) {
        hero.countdownUntargetTimer()
      } else if (hero.isDead) {
        hero.countdownRespawnTimer()
      }
      hero.tickBuffTimer()
    })
  }

  public static getEmptySpawnLocation(
    arena: Arena,
    spawnLocations: number[][],
    currLoc: number[]
  ): number[] {
    for (let i = 0; i < spawnLocations.length; i++) {
      const coord = spawnLocations[i]
      const hero: HeroInMatch | null = arena.getHeroAtLocation(
        coord[0],
        coord[1]
      )

      // If the hero was spawn killed, keep them at the current location
      if (!hero || (currLoc[0] === coord[0] && currLoc[1] === coord[1])) {
        return coord
      }
    }
    return [0, 0]
  }

  static simulateMatchupPercentages(team1: Team, team2: Team) {
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
