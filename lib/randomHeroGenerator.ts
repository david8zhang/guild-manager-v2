import {
  MALE_FIRST_NAMES,
  LAST_NAMES,
  FEMALE_FIRST_NAMES,
} from './constants/names'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

export class RandomHeroGenerator {
  static generateStarterHeroes(numHeroes: number) {
    const heroes = []
    for (let i = 0; i < numHeroes; i++) {
      const gender =
        RandomHeroGenerator._generateNumberWithinRange(0, 1) === 1
          ? 'male'
          : 'female'
      let firstName
      let lastName =
        LAST_NAMES[
          RandomHeroGenerator._generateNumberWithinRange(0, LAST_NAMES.length)
        ]
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
      heroes.push({
        heroId: uuidv4(),
        name: `${
          firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()
        } ${lastName}`,
        gender: gender,
        attack: RandomHeroGenerator._generateNumberWithinRange(65, 80),
        defense: RandomHeroGenerator._generateNumberWithinRange(65, 80),
        speed: RandomHeroGenerator._generateNumberWithinRange(65, 80),
        health: RandomHeroGenerator._generateNumberWithinRange(150, 200),
        potential: RandomHeroGenerator._generateNumberWithinRange(1, 3),
        contract: {
          amount: 200,
          duration: 5,
        },
      })
    }
    return heroes
  }

  private static _generateNumberWithinRange(min: number, max: number) {
    return Math.floor(Math.random() * (max + 1 - min) + min)
  }
}
