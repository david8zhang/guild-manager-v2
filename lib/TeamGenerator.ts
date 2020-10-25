import { Team } from './model/Team'
import { shuffle } from 'lodash'
import { RandomHeroGenerator } from './RandomHeroGenerator'

export class TeamGenerator {
  public static generateRandomTeams(config: {
    numTeams: number
    namePool: string[]
    homeCityPool: string[]
    playerHomeCity: string
  }): Team[] {
    const { numTeams, namePool, homeCityPool, playerHomeCity } = config
    const eligibleShuffledHomeCities = shuffle(
      homeCityPool.filter((c: string) => c !== playerHomeCity)
    )
    const uniqShuffledNames = Array.from(new Set(shuffle(namePool)))
    const teams = []
    for (let i = 0; i < numTeams; i++) {
      const starters = RandomHeroGenerator.generateStarterHeroes(3)
      const reserves = RandomHeroGenerator.generateReserveHeroes(3)
      const roster = starters.concat(reserves)
      const starterIds = starters.map((h) => h.heroId)
      teams.push(
        new Team({
          roster,
          starterIds,
          name: `${eligibleShuffledHomeCities[i]} ${uniqShuffledNames[i]}`,
        })
      )
    }
    return teams
  }
}
