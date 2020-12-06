import { HeroType } from './model/Hero'
import { HeroInMatch } from './model/HeroInMatch'

export interface StatGainManagerConfig {
  playerHeroTeam: HeroInMatch[]
}

export class StatGainManager {
  private playerHeroTeam: HeroInMatch[]
  constructor(config: StatGainManagerConfig) {
    this.playerHeroTeam = config.playerHeroTeam
  }

  public getStatGains(mvpId: string) {
    const statGains: any = {}
    this.playerHeroTeam.forEach((hero: HeroInMatch) => {
      const heroRef = hero.getHeroRef()
      const potential = heroRef.potential
      if (this.didStatIncrease(potential) || heroRef.heroId === mvpId) {
        // If the hero is the MVP, they should guarantee a stat increase
        const stat = this.getStatsToIncrease(heroRef.heroType)
        const amountToIncrease = this.statIncreaseAmount(potential, stat)
        statGains[hero.getHeroRef().heroId] = {
          statToIncrease: stat,
          amountToIncrease,
        }
      } else {
        statGains[hero.getHeroRef().heroId] = null
      }
    })
    return statGains
  }

  public getStatsToIncrease(heroType: HeroType): string {
    let increasableStats = []
    switch (heroType) {
      case HeroType.RANGER: {
        increasableStats = ['attack', 'speed']
        break
      }
      case HeroType.SUPPORT: {
        increasableStats = ['magic']
        break
      }
      case HeroType.TANK: {
        increasableStats = ['health', 'defense']
        break
      }
    }
    return increasableStats[Math.floor(Math.random() * increasableStats.length)]
  }

  public statIncreaseAmount(potential: number, stat: string) {
    const statIncreaseAmountPercentages = [
      [0.8, 0.15, 0.05], // At potential = 1, probability to increase by 1 = 80%, increase by 2 = 15%, ...
      [0.6, 0.3, 0.1],
      [0.4, 0.35, 0.25],
    ]
    const percentageBreakdown = statIncreaseAmountPercentages[potential - 1]

    // Determine how much to increase stat by using different threshold based on probabilities
    const increaseBy1Threshold = percentageBreakdown[0] * 100
    const increaseBy2Threshold =
      increaseBy1Threshold + percentageBreakdown[1] * 100

    const number = Math.floor(Math.random() * 100) + 1
    let statIncreaseAmount = 0
    if (number >= 0 && number < increaseBy1Threshold) {
      statIncreaseAmount = 1
    } else if (
      number >= increaseBy1Threshold &&
      number < increaseBy2Threshold
    ) {
      statIncreaseAmount = 2
    } else if (number >= increaseBy2Threshold) {
      statIncreaseAmount = 3
    }
    if (stat === 'health') {
      statIncreaseAmount *= 10
    }
    return statIncreaseAmount
  }

  public didStatIncrease(potential: number) {
    const potentialToPercentArr = [0.05, 0.15, 0.25]
    const percent = potentialToPercentArr[potential - 1]
    return Math.floor(Math.random() * 100) + 1 >= percent * 100
  }
}
