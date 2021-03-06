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

  public getReserves(): Hero[] {
    const reserveHeroes: Hero[] = []
    this.roster.forEach((hero: Hero) => {
      if (!this.starterIds.includes(hero.heroId)) {
        reserveHeroes.push(hero)
      }
    })
    return reserveHeroes
  }

  public releaseHero(heroId: string): void {
    this.roster = this.roster.filter((h: Hero) => h.heroId !== heroId)
    this.starterIds = this.starterIds.filter(
      (starterId: string) => starterId !== heroId
    )
    this.autofillStarter()
  }

  public autofillStarter(): void {
    if (this.starterIds.length < 3) {
      const sortedByOVR = this.getReserves().sort(
        (a, b) => b.getOverall() - a.getOverall()
      )
      if (sortedByOVR.length > 0) {
        this.starterIds.push(sortedByOVR[0].heroId)
      }
    }
  }

  public addHero(hero: Hero) {
    this.roster.push(hero)
    this.autofillStarter()
  }

  public swapOutStarter(toSwapId: string, replacementId: string) {
    this.starterIds = this.starterIds.filter((id: string) => id !== toSwapId)
    this.starterIds = this.starterIds.concat(replacementId)
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
