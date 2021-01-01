import { Arena } from '../model/Arena'
import { Hero, HeroType } from '../model/Hero'
import { HeroInMatch } from '../model/HeroInMatch'
import { BehaviorSelector } from './BehaviorSelector'

export class CPUHero {
  public behaviorSelector: BehaviorSelector
  public heroType: HeroType
  public behavior: any

  constructor(hero: HeroInMatch, behaviorSelector: BehaviorSelector) {
    this.behaviorSelector = behaviorSelector
    this.heroType = hero.getHeroRef().heroType
  }

  public selectBehavior() {
    this.behavior = this.behaviorSelector.getBehavior()
  }

  public getMovementAction() {
    return this.behavior.getMovementAction()
  }
  public getPostMoveAction() {
    return this.behavior.getPostMovementAction()
  }
}
