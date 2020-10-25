import { Hero } from './Hero'
import { v4 as uuidv4 } from 'uuid'

export class Team {
  public name: string
  public roster: Hero[]
  public starterIds: string[]
  public teamId: string

  constructor(roster: any[], starterIds: string[], name: string) {
    this.teamId = uuidv4()
    this.starterIds = starterIds
    this.roster = roster.map((h) => Hero.deserializeHeroObj(h))
    this.name = name
  }

  public getHero(heroId: string): Hero | undefined {
    return this.roster.find((h) => h.heroId === heroId)
  }

  public getStarters(): Hero[] {
    const starterHeroes: Hero[] = []
    this.roster.forEach((hero: Hero) => {
      if (this.starterIds.includes(hero.heroId)) {
        starterHeroes.push(hero)
      }
    })
    return starterHeroes
  }

  public serialize(): any {
    return {
      teamId: this.teamId,
      roster: this.roster.map((h: Hero) => h.serialize()),
      starters: this.starterIds,
      name: this.name,
    }
  }

  public static deserializeObj(guildObj: any): Team {
    const { roster, name } = guildObj
    const starterIds: string[] = []
    roster.forEach((h: any) => {
      if (h.isStarter) {
        starterIds.push(h.heroId)
      }
    })
    return new Team(roster, starterIds, name)
  }
}
