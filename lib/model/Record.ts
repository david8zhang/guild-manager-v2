export class Record {
  public numWins: number
  public numLosses: number
  public winStreak: number

  constructor() {
    this.numWins = 0
    this.numLosses = 0
    this.winStreak = 0
  }

  public getWinLossRatio(): number {
    if (this.numLosses === 0) {
      return Number.MAX_SAFE_INTEGER
    }
    return this.numWins / this.numLosses
  }

  public addWin() {
    this.numWins++
    this.winStreak++
  }

  public addLoss() {
    this.numLosses++
    this.winStreak = 0
  }
}
