import { Hero, HeroType } from './model/Hero'
import { HeroInMatch } from './model/HeroInMatch'

export class StatGainManager {
  public static PRIME_AGE_THRESHOLD = 30
  constructor() {}

  public getStatGains(mvpId: string, heroes: HeroInMatch[]) {
    const statGains: any = {}
    heroes.forEach((hero: HeroInMatch) => {
      const heroRef = hero.getHeroRef()
      const potential = heroRef.potential
      const age = heroRef.age
      if (
        StatGainManager.didStatIncrease(potential, age) ||
        heroRef.heroId === mvpId
      ) {
        // If the hero is the MVP, they should guarantee a stat increase
        const stat = StatGainManager.getStatsToIncrease(heroRef.heroType)
        let amountToIncrease = StatGainManager.statIncreaseAmount(
          potential,
          stat
        )

        // Don't increase a stat above 99
        if (
          hero.getHeroRef().getStat(stat) + amountToIncrease >
          Hero.getMaxStatAmount(stat)
        ) {
          amountToIncrease =
            Hero.getMaxStatAmount(stat) - hero.getHeroRef().getStat(stat)
        }

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

  public static getStatsToIncrease(heroType: HeroType): string {
    let increasableStats = []
    switch (heroType) {
      case HeroType.RANGER: {
        increasableStats = ['speed']
        break
      }
      case HeroType.SUPPORT: {
        increasableStats = ['magic']
        break
      }
      case HeroType.TANK: {
        increasableStats = ['defense']
        break
      }
    }
    return increasableStats[Math.floor(Math.random() * increasableStats.length)]
  }

  public static statIncreaseAmount(
    potential: number,
    stat: string,
    statIncreaseAmounts: number[] = [1, 2, 3]
  ) {
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
      statIncreaseAmount = statIncreaseAmounts[0]
    } else if (
      number >= increaseBy1Threshold &&
      number < increaseBy2Threshold
    ) {
      statIncreaseAmount = statIncreaseAmounts[1]
    } else if (number >= increaseBy2Threshold) {
      statIncreaseAmount = statIncreaseAmounts[2]
    }
    if (stat === 'health') {
      statIncreaseAmount *= 10
    }
    return statIncreaseAmount
  }

  public static didStatIncrease(potential: number, age: number): boolean {
    // If the hero is past their prime age, they no longer will gain stats
    if (age >= StatGainManager.PRIME_AGE_THRESHOLD) {
      return false
    }
    const potentialToPercentArr = [0.05, 0.15, 0.25]
    const percent = potentialToPercentArr[potential - 1]
    return Math.floor(Math.random() * 100) + 1 >= percent * 100
  }
}
