import {
  MALE_FIRST_NAMES,
  LAST_NAMES,
  FEMALE_FIRST_NAMES,
} from './constants/names'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

export class RandomHeroGenerator {
  static generateStarterHeroes(numHeroes: number) {
    return this._generateHeroes({
      numHeroes,
      maxHealth: 200,
      minHealth: 150,
      maxStat: 80,
      minStat: 65,
      contract: {
        duration: 5,
        amount: 200,
      },
    })
  }

  static generateReserveHeroes(numHeroes: number) {
    return this._generateHeroes({
      numHeroes,
      maxHealth: 150,
      minHealth: 100,
      maxStat: 70,
      minStat: 55,
      contract: {
        duration: 5,
        amount: 50,
      },
    })
  }

  private static _generateHeroes(config: {
    numHeroes: number
    maxHealth: number
    minHealth: number
    maxStat: number
    minStat: number
    contract: any
  }) {
    const {
      numHeroes,
      maxHealth,
      minHealth,
      maxStat,
      minStat,
      contract,
    } = config
    const heroes = []
    for (let i = 0; i < numHeroes; i++) {
      const gender =
        RandomHeroGenerator._generateNumberWithinRange(0, 1) === 1
          ? 'male'
          : 'female'
      let firstName = RandomHeroGenerator._generateRandomFirstName(gender)
      let lastName =
        LAST_NAMES[
          RandomHeroGenerator._generateNumberWithinRange(0, LAST_NAMES.length)
        ]
      heroes.push({
        heroId: uuidv4(),
        name: `${
          firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()
        } ${lastName}`,
        gender: gender,
        attack: RandomHeroGenerator._generateNumberWithinRange(
          minStat,
          maxStat
        ),
        defense: RandomHeroGenerator._generateNumberWithinRange(
          minStat,
          maxStat
        ),
        speed: RandomHeroGenerator._generateNumberWithinRange(minStat, maxStat),
        health: RandomHeroGenerator._generateNumberWithinRange(
          minHealth,
          maxHealth
        ),
        potential: RandomHeroGenerator._generateNumberWithinRange(1, 3),
        contract,
      })
    }
    return heroes
  }

  private static _generateRandomFirstName(gender: string) {
    let firstName
    if (gender == 'male') {
      firstName =
        MALE_FIRST_NAMES[
          RandomHeroGenerator._generateNumberWithinRange(
            0,
            MALE_FIRST_NAMES.length - 1
          )
        ]
    } else {
      firstName =
        FEMALE_FIRST_NAMES[
          RandomHeroGenerator._generateNumberWithinRange(
            0,
            FEMALE_FIRST_NAMES.length - 1
          )
        ]
    }
    return firstName
  }

  private static _generateNumberWithinRange(min: number, max: number) {
    return Math.floor(Math.random() * (max + 1 - min) + min)
  }
}
