import { HeroStats } from './HeroStats'

export enum HeroType {
  SUPPORT = 'support',
  RANGER = 'ranger',
  TANK = 'tank',
}

export interface Contract {
  amount: number
  duration: number
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

export interface SavedHeroStats {
  totalDeaths: number
  totalKills: number
  totalPoints: number
  averagePointsPerGame: number
  averageKillsPerGame: number
  averageDeathsPerGame: number
  totalMatchesPlayed: number
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
  public attackRange: number
  public matchStats: SavedHeroStats
  public isRookie: boolean
  public age: number
  public numRings: number

  constructor(config: any) {
    this.heroId = config.heroId
    this.name = config.name
    this.potential = config.potential
    this.attack = config.attack
    this.defense = config.defense
    this.health = config.health
    this.speed = config.speed
    this.magic = config.magic
    this.moveSet = config.moveSet
    this.heroType = config.heroType
    this.attackRange = config.attackRange || 2
    this.contract = config.contract
    this.isRookie = config.isRookie || false
    this.heroImageData =
      typeof config.heroImageData === 'string'
        ? JSON.parse(config.heroImageData)
        : config.heroImageData
    this.matchStats =
      config.matchStats && typeof config.matchStats === 'string'
        ? JSON.parse(config.matchStats)
        : {
            totalDeaths: 0,
            totalKills: 0,
            totalPoints: 0,
            averagePointsPerGame: 0,
            averageKillsPerGame: 0,
            averageDeathsPerGame: 0,
            totalMatchesPlayed: 0,
          }
    this.age = config.age
    this.numRings = config.numRings || 0
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
      attackRange: this.attackRange,
      heroImageData: JSON.stringify(this.heroImageData),
      matchStats: JSON.stringify(this.matchStats),
      isRookie: this.isRookie,
      contract: this.contract,
      age: this.age || 25,
      numRings: this.numRings,
    }
  }

  public decayStats(age: number): void {
    const stats = ['attack', 'defense', 'health', 'speed', 'magic']
    stats.forEach((stat: string) => {
      const decayAmount =
        this.getStat(stat) -
        Math.round(this.getStat(stat) * this.getDecayPercentage(age))
      this.setStat(stat, decayAmount)
    })
  }

  public getDecayPercentage(age: number) {
    if (age >= 40) {
      return 0.25
    } else if (age >= 35) {
      return 0.1
    } else if (age >= 30) {
      return 0.05
    } else {
      return 0
    }
  }

  public setIsRookie(isRookie: boolean) {
    this.isRookie = isRookie
  }

  public static deserializeHeroObj(heroObj: any): Hero {
    return new Hero(heroObj)
  }

  public getOverall(): number {
    return Math.round(
      (this.attack + this.defense + this.speed + this.magic) / 4
    )
  }

  public getStat(stat: string): number {
    switch (stat) {
      case 'attack':
        return this.attack
      case 'defense':
        return this.defense
      case 'speed':
        return this.speed
      case 'health':
        return this.health
      case 'magic':
        return this.magic
      default:
        return 0
    }
  }

  public setStat(stat: string, value: number) {
    switch (stat) {
      case 'attack':
        this.attack = value
        break
      case 'defense':
        this.defense = value
        break
      case 'speed':
        this.speed = value
        break
      case 'health':
        this.health = value
        break
      case 'magic':
        this.magic = value
        break
      default:
        break
    }
  }

  public static getMaxStatAmount(stat: string) {
    if (stat === 'health') {
      return 400
    }
    return 99
  }

  public savePostMatchStats(heroStats: HeroStats): void {
    this.matchStats.totalDeaths += heroStats.numDeaths
    this.matchStats.totalKills += heroStats.numKills
    this.matchStats.totalPoints += heroStats.numPoints
    this.matchStats.totalMatchesPlayed++

    const totalMatchesPlayed = this.matchStats.totalMatchesPlayed

    this.matchStats.averageDeathsPerGame =
      this.matchStats.totalDeaths / totalMatchesPlayed
    this.matchStats.averageKillsPerGame =
      this.matchStats.totalKills / totalMatchesPlayed
    this.matchStats.averagePointsPerGame =
      this.matchStats.totalPoints / totalMatchesPlayed
  }

  public improveStats(stat: string, value: number) {
    switch (stat) {
      case 'attack':
        this.attack = Math.min(100, this.attack + value)
        break
      case 'defense':
        this.defense = Math.min(100, this.defense + value)
        break
      case 'speed':
        this.speed = Math.min(100, this.speed + value)
        break
      case 'health':
        this.health = Math.min(800, this.health + value)
        break
      case 'magic':
        this.magic = Math.min(100, this.magic + value)
        break
      default:
        break
    }
  }

  public getContract(): Contract {
    return {
      amount: this.contract.amount,
      duration: this.contract.duration,
    }
  }

  public setContract(contract: Contract) {
    this.contract = contract
  }
}
