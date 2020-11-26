import 'react-native-get-random-values'
import {
  FEMALE_FIRST_NAMES,
  LAST_NAMES,
  MALE_FIRST_NAMES,
} from '../constants/names'
import {
  FEMALE_HAIR,
  MALE_EYES,
  MALE_HAIR,
  FEMALE_EYES,
  BODY,
  FACES,
  MOUTH,
  EYEBROW,
} from '../constants/imageMap'
import { Hero, HeroImageData } from '../model/Hero'
import { v4 as uuidv4 } from 'uuid'
import { shuffle } from 'lodash'

export class HeroFactory {
  public minStat: number
  public maxStat: number
  public minHealth: number
  public maxHealth: number
  public contract: {
    duration: number
    amount: number
  }

  constructor(
    minHealth: number,
    maxHealth: number,
    minStat: number,
    maxStat: number,
    contract: any
  ) {
    this.minHealth = minHealth
    this.maxHealth = maxHealth
    this.minStat = minStat
    this.maxStat = maxStat
    this.contract = contract
  }

  getHeroes(numHeroes: number): Hero[] {
    return []
  }

  generateRandomGender(): string {
    return this.generateNumberWithinRange(0, 1) === 1 ? 'male' : 'female'
  }

  generateRandomHeroId(): string {
    return uuidv4()
  }

  generateRandomName(gender: string) {
    let firstName
    if (gender == 'male') {
      firstName =
        MALE_FIRST_NAMES[
          this.generateNumberWithinRange(0, MALE_FIRST_NAMES.length - 1)
        ]
    } else {
      firstName =
        FEMALE_FIRST_NAMES[
          this.generateNumberWithinRange(0, FEMALE_FIRST_NAMES.length - 1)
        ]
    }
    const lastName =
      LAST_NAMES[this.generateNumberWithinRange(0, LAST_NAMES.length - 1)]
    return `${firstName.slice(0, 1)}${firstName
      .slice(1)
      .toLowerCase()} ${lastName}`
  }

  generateNumberWithinRange(min: number, max: number) {
    return Math.floor(Math.random() * (max + 1 - min) + min)
  }

  getRandomMovePool(moves: string[]) {
    const shuffledMoves = shuffle(moves)
    return shuffledMoves.slice(
      0,
      this.generateNumberWithinRange(1, shuffledMoves.length)
    )
  }

  generateRandomHeroImage(gender: string): string {
    const eyesPool =
      gender === 'male' ? Object.keys(MALE_EYES) : Object.keys(FEMALE_EYES)
    const hairPool =
      gender === 'male' ? Object.keys(MALE_HAIR) : Object.keys(FEMALE_HAIR)
    const bodyPool = Object.keys(BODY)
    const facePool = Object.keys(FACES)
    const eyebrowPool = Object.keys(EYEBROW)
    const mouthPool = Object.keys(MOUTH)

    const randomEyes: string =
      eyesPool[Math.floor(Math.random() * eyesPool.length)]
    const randomHair: string =
      hairPool[Math.floor(Math.random() * hairPool.length)]
    const randomBody = bodyPool[Math.floor(Math.random() * bodyPool.length)]
    const randomFace = facePool[Math.floor(Math.random() * facePool.length)]
    const randomEyebrows =
      eyebrowPool[Math.floor(Math.random() * eyebrowPool.length)]
    const randomMouth = mouthPool[Math.floor(Math.random() * mouthPool.length)]
    return JSON.stringify({
      eyes: randomEyes,
      hair: randomHair,
      body: randomBody,
      face: randomFace,
      eyebrow: randomEyebrows,
      mouth: randomMouth,
    })
  }
}
