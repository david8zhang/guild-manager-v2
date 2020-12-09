import { Team } from './model/Team'
import { RandomHeroGenerator } from './heroGenerator/RandomHeroGenerator'
import { TEAM_NAMES } from './constants/fullTeamNames'
import { TEAM_COLOR } from './constants/fullTeamColors'
import { Hero } from './model/Hero'
import { EnemyHeroGenerator } from './heroGenerator/EnemyHeroGenerator'

export class TeamGenerator {
  static HERO_GENERATOR: RandomHeroGenerator = new EnemyHeroGenerator()

  public static generateRandomTeams(config: {
    numTeams: number
    playerTeam: Team
  }): Team[] {
    const { numTeams, playerTeam } = config
    const eligibleTeamNames = TEAM_NAMES.filter(
      (name: string) => name !== playerTeam.name
    )
    const teams = []
    for (let i = 0; i < numTeams; i++) {
      const teamName = eligibleTeamNames[i]
      const starters = this.HERO_GENERATOR.generateStarterHeroes(3)
      const reserves = this.HERO_GENERATOR.generateReserveHeroes(3)
      const roster = starters.concat(reserves)
      const starterIds = starters.map((h: Hero) => h.heroId)
      teams.push(
        new Team({
          roster,
          starterIds,
          name: teamName,
          teamColor: TEAM_COLOR[teamName],
        })
      )
    }
    return teams
  }

  public static getRandomColor() {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }
}
