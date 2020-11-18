export class Hero {
  public heroId: string
  public name: string
  public potential: number
  public attack: number
  public defense: number
  public health: number
  public speed: number
  public contract: any

  constructor(config: any) {
    this.heroId = config.heroId
    this.name = config.name
    this.potential = config.potential
    this.attack = config.attack
    this.defense = config.defense
    this.health = config.health
    this.speed = config.speed
    this.contract = config.contract
  }

  public serialize(): any {
    return {
      heroId: this.heroId,
      name: this.name,
      potential: this.potential,
      attack: this.attack,
      defense: this.defense,
      health: this.health,
      speed: this.speed,
    }
  }

  public static deserializeHeroObj(heroObj: any): Hero {
    return new Hero(heroObj)
  }

  public getOverall(): number {
    return Math.round((this.attack + this.defense + this.speed) / 3)
  }
}
