import { Hero } from './Hero'
import { v4 as uuidv4 } from 'uuid'

export class Team {
  public name: string
  public roster: Hero[]
  public starterIds: string[]
  public color: string
  public teamId: string

  constructor(config: {
    roster: any[]
    teamId?: string
    name: string
    teamColor: string
    starterIds: string[]
  }) {
    const { roster, teamId, name, starterIds, teamColor } = config
    this.teamId = teamId || uuidv4()
    this.starterIds = starterIds
    this.color = teamColor
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

  public getNameAbbrev(): string {
    const nameTokens = this.name.split(' ')
    const cityNameAbb = nameTokens[0].slice(0, 2)
    const teamNameAbb = nameTokens[1].slice(0, 1)
    return `${cityNameAbb}${teamNameAbb}`.toUpperCase()
  }

  public static getNameAbbrevForName(name: string) {
    const nameTokens = name.split(' ')
    const cityNameAbb = nameTokens[0].slice(0, 2)
    const teamNameAbb = nameTokens[1].slice(0, 1)
    return `${cityNameAbb}${teamNameAbb}`.toUpperCase()
  }

  public serialize(): any {
    return {
      teamId: this.teamId,
      roster: this.roster.map((h: Hero) => h.serialize()),
      starterIds: this.starterIds,
      name: this.name,
      teamColor: this.color,
    }
  }

  public static deserializeObj(guildObj: any): Team {
    const { roster, name, teamId, starterIds, teamColor } = guildObj
    return new Team({ roster, starterIds, name, teamId, teamColor })
  }
}
