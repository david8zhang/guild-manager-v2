export class Record {
  public numWins: number
  public numLosses: number
  public winStreak: number

  constructor(config?: any) {
    this.numWins = config ? config.numWins : 0
    this.numLosses = config ? config.numLosses : 0
    this.winStreak = config ? config.winStreak : 0
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

  public serialize() {
    return {
      numWins: this.numWins,
      numLosses: this.numLosses,
      winStreak: this.winStreak,
    }
  }

  public static deserializeObj(recordObj: any) {
    return new Record(recordObj)
  }
}
