export class MatchEvent {
  public message: string
  public isScoringEvent: boolean

  constructor(message: string, isScoringEvent: boolean) {
    this.message = message
    this.isScoringEvent = isScoringEvent
  }
}
