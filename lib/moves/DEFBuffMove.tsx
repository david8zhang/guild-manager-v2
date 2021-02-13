import * as React from 'react'
import { View, Animated, Easing } from 'react-native'
import { HeroInMatch } from '../model/HeroInMatch'
import { Move } from './Move'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Hero } from '../model/Hero'
import { Button } from '../../components'
import { MatchManager } from '../MatchManager'

export class DEFBuffMove implements Move {
  public name: string
  public description: string
  public range: number
  public rangeHighlightColor: string

  constructor() {
    this.name = 'DEF Buff'
    this.description =
      'Apply DEF increase by some percentage for 2 turns. Percentage increase scales with MGK attribute. Can stack this effect up to 2 times.'
    this.range = 3
    this.rangeHighlightColor = 'green'
  }
  processMove(user: HeroInMatch, target: HeroInMatch) {
    const userHeroRef: Hero = user.getHeroRef()
    const { magic } = userHeroRef
    let buffPercentage = 1
    if (magic < 60) {
      buffPercentage = 1.05
    } else if (magic >= 60 && magic <= 70) {
      buffPercentage = 1.1
    } else if (magic > 70 && magic <= 80) {
      buffPercentage = 1.15
    } else if (magic > 80 && magic <= 90) {
      buffPercentage = 1.2
    } else if (magic > 90 && magic <= 99) {
      buffPercentage = 1.25
    }
    // check if the target already has 2 attack buff stacks
    let numAttackBuffs: number = target.getBuffs().reduce((acc, curr) => {
      if (curr.stat === 'defense') {
        acc++
      }
      return acc
    }, 0)
    if (numAttackBuffs < 2) {
      target.applyBuff({
        stat: 'defense',
        percentage: buffPercentage,
      })
    }
  }
  getAnimation(
    user: HeroInMatch,
    target: HeroInMatch,
    userColor: string,
    targetColor: string,
    userSide: string,
    onFinished: Function
  ) {
    return <View />
  }

  isTargetValid(
    user: HeroInMatch,
    target: HeroInMatch,
    matchManager: MatchManager
  ) {
    const userTeam = matchManager.getHeroTeam(user)
    const targetTeam = matchManager.getHeroTeam(target)
    if (
      userTeam.teamId === targetTeam.teamId &&
      user.getHeroRef().heroId !== target.getHeroRef().heroId
    ) {
      return true
    }
    return false
  }
}
