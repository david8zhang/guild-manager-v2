export class Hero {
  public heroId: string
  public name: string
  public potential: number
  public attack: number
  public defense: number
  public health: number
  public speed: number
  public magic: number
  public contract: any
  public moveSet: string[]

  constructor(config: any) {
    this.heroId = config.heroId
    this.name = config.name
    this.potential = config.potential
    this.attack = config.attack
    this.defense = config.defense
    this.health = config.health
    this.speed = config.speed
    this.magic = config.magic
    this.contract = config.contract
    this.moveSet = config.moveSet
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
      magic: this.magic,
      moveSet: this.moveSet,
    }
  }

  public static deserializeHeroObj(heroObj: any): Hero {
    return new Hero(heroObj)
  }

  public getOverall(): number {
    return Math.round((this.attack + this.defense + this.speed) / 3)
  }
}
