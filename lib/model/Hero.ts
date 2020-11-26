export enum HeroType {
  ATTACKER = 'attacker',
  SUPPORT = 'support',
}

// The hero image data encodes path to each image
// encoding will also include gender information, i.e. 'male/eyes16.png'
export interface HeroImageData {
  eyes: string
  body: string
  face: string
  mouth: string
  eyebrow: string
  hair: string
}

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
  public heroType: HeroType
  public heroImageData: HeroImageData

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
    this.heroType = config.heroType
    this.heroImageData =
      typeof config.heroImageData === 'string'
        ? JSON.parse(config.heroImageData)
        : config.heroImageData
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
      heroType: this.heroType,
      heroImageData: JSON.stringify(this.heroImageData),
    }
  }

  public static deserializeHeroObj(heroObj: any): Hero {
    return new Hero(heroObj)
  }

  public getOverall(): number {
    return Math.round((this.attack + this.defense + this.speed) / 3)
  }
}
