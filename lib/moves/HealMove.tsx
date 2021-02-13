import { Hero } from '../model/Hero'
import { HeroInMatch } from '../model/HeroInMatch'
import { Move } from './Move'
import * as React from 'react'
import { MatchManager } from '../MatchManager'
import { View } from 'react-native'

export class HealMove implements Move {
  public name: string
  public description: string
  public range: number
  public rangeHighlightColor: string

  constructor() {
    this.name = 'Heal'
    this.description =
      'Heal an allied hero for a fixed amount. Heal amount scales with the MGK attribute'
    this.range = 6
    this.rangeHighlightColor = 'green'
  }
  processMove(user: HeroInMatch, target: HeroInMatch) {
    const userHeroRef: Hero = user.getHeroRef()
    const healAmount = Math.floor(userHeroRef.magic * 0.75)
    target.addHealth(healAmount)
  }

  getAnimation(
    user: HeroInMatch,
    target: HeroInMatch,
    userColor: string,
    targetColor: string,
    userSide: string,
    onFinished: Function
  ): any {
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
